#!/usr/bin/env node
import Anthropic from "@anthropic-ai/sdk";
import { config as loadEnv } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(here, "../.env.local");

if (fs.existsSync(envPath)) {
  loadEnv({ path: envPath, override: false });
}

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.error(
    [
      "ANTHROPIC_API_KEY is not set.",
      "",
      "To run without saving the key, use:",
      "  ANTHROPIC_API_KEY='sk-ant-...' node scripts/check-anthropic.mjs",
      "",
      "Or export it first:",
      "  export ANTHROPIC_API_KEY='sk-ant-...'",
      "  node scripts/check-anthropic.mjs",
    ].join("\n")
  );
  process.exit(2);
}

const client = new Anthropic({ apiKey });

try {
  const msg = await client.messages.create({
    model: "claude-3-5-sonnet-latest",
    max_tokens: 64,
    messages: [
      { role: "user", content: "Reply with: Claude API is working." },
    ],
  });

  const text = msg.content?.[0]?.text ?? "";
  console.log(text || "Received empty response payload.");
} catch (err) {
  console.error("Error calling Anthropic API:");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}


