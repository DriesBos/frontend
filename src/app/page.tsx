'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './page.module.scss';

type Feed = { id: number; title: string };
type Entry = {
  id: number;
  title: string;
  url: string;
  content: string;
  status: 'read' | 'unread';
  starred?: boolean; // may exist depending on API payload
  feed?: { title: string };
  published_at?: string;
};

export default function Home() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selected = useMemo(
    () => entries.find((e) => e.id === selectedId) ?? null,
    [entries, selectedId]
  );

  async function loadFeeds() {
    const res = await fetch('/api/feeds');
    setFeeds(await res.json());
  }

  async function loadEntries() {
    const res = await fetch(
      '/api/entries?status=unread&limit=50&direction=desc&order=published_at'
    );
    const data = await res.json();
    // Miniflux returns {total, entries}
    setEntries(data.entries ?? []);
    if (!selectedId && (data.entries?.[0]?.id ?? null))
      setSelectedId(data.entries[0].id);
  }

  async function markStatus(ids: number[], status: 'read' | 'unread') {
    await fetch('/api/entries/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entry_ids: ids, status }),
    });
    await loadEntries();
  }

  async function toggleBookmark(id: number) {
    await fetch(`/api/entries/${id}/bookmark`, { method: 'POST' });
    await loadEntries();
  }

  useEffect(() => {
    loadFeeds();
    loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.title}>Peace RSS</div>
          <a
            className={styles.miniLink}
            href="/miniflux"
            target="_blank"
            rel="noreferrer"
          >
            Open Miniflux
          </a>
        </div>

        <div className={styles.sectionTitle}>Feeds</div>
        <div className={styles.feedList}>
          {feeds.map((f) => (
            <div key={f.id} className={styles.feedItem} title={f.title}>
              {f.title}
            </div>
          ))}
        </div>
      </aside>

      <main className={styles.listPane}>
        <div className={styles.toolbar}>
          <button onClick={() => loadEntries()}>Refresh</button>
          {selectedId && (
            <>
              <button onClick={() => markStatus([selectedId], 'read')}>
                Mark read
              </button>
              <button onClick={() => toggleBookmark(selectedId)}>
                Star/Unstar
              </button>
            </>
          )}
        </div>

        <div className={styles.entryList}>
          {entries.map((e) => (
            <button
              key={e.id}
              className={`${styles.entryRow} ${
                e.id === selectedId ? styles.active : ''
              }`}
              onClick={() => setSelectedId(e.id)}
            >
              <div className={styles.entryTitle}>{e.title}</div>
              <div className={styles.entryMeta}>{e.feed?.title ?? ''}</div>
            </button>
          ))}
        </div>
      </main>

      <section className={styles.detailPane}>
        {selected ? (
          <>
            <div className={styles.detailHeader}>
              <h1 className={styles.detailTitle}>{selected.title}</h1>
              <div className={styles.detailActions}>
                <a href={selected.url} target="_blank" rel="noreferrer">
                  Open source
                </a>
              </div>
            </div>
            <article
              className={styles.detailBody}
              dangerouslySetInnerHTML={{ __html: selected.content ?? '' }}
            />
          </>
        ) : (
          <div className={styles.placeholder}>Select an entry</div>
        )}
      </section>
    </div>
  );
}
