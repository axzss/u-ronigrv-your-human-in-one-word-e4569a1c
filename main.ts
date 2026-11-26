// Your Human in One Word — make.fun entry (program/v1).
// Writes the single-word entry to $MAKEFUN_OUTPUT_DIR/entry.txt
// (fallback ".") and prints the entry to stdout with no trailing newline.
//
// The gate: /output/entry.txt must be UTF-8 text of 1 to 30 characters,
// not only white space, and exactly one word. This program self-checks
// that before writing anything, and fails loudly if the word ever stops
// satisfying the gate.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ENTRY = "Boss";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Gate self-check: exactly one word, 1-30 characters, no whitespace at all.
if (typeof ENTRY !== "string" || ENTRY.length === 0) {
  fail("entry is empty");
}
if (ENTRY.length > 30) {
  fail(`entry is ${ENTRY.length} characters, over the 30-character gate`);
}
if (/\s/.test(ENTRY)) {
  fail("entry must be exactly one word (no whitespace)");
}
if (ENTRY.trim() !== ENTRY) {
  fail("entry must not have leading or trailing whitespace");
}
// A word, not punctuation or a number: letters only.
if (!/^[A-Za-z]+$/.test(ENTRY)) {
  fail("entry must be a single word of letters only");
}

const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR || ".");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "entry.txt");
writeFileSync(outFile, ENTRY, "utf8");

// Round-trip check: what landed on disk must be byte-identical to the word.
if (readFileSync(outFile, "utf8") !== ENTRY) {
  fail("entry.txt on disk does not match the entry");
}

// Stdout is the entry itself, with no trailing newline.
process.stdout.write(ENTRY);
