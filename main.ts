// Ridiculous at First Glance, Real by the Second — make.fun entry.
// Writes one sentence (<=200 chars) pitching a bizarre startup idea
// that sounds absurd until you realise it would actually sell.
// Pure Node standard library only: no network, no external binaries.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const PITCH =
  "We rent retired librarians to patrol open-plan offices and shush noisy coworkers, because companies already buy noise-cancelling headphones by the pallet and will pay more for silence at the source.";

const OUT = "/output/entry.txt";

// Validation guard: the gate requires /output/entry.txt to be UTF-8 text
// of 1 to 200 characters, not only whitespace, and the brief requires one
// single sentence. Refuse to write anything that fails the gate instead
// of shipping a bad entry.
function validate(text: string): void {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("entry is empty");
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text.length > 200) {
    throw new Error(`entry is ${text.length} characters, over the 200 limit`);
  }
  // Must be exactly one sentence: a single terminal period, no other
  // sentence-ending punctuation, and no internal period.
  const trimmed = text.trim();
  if (!trimmed.endsWith(".")) {
    throw new Error("entry must end with a single period");
  }
  const body = trimmed.slice(0, -1);
  if (/[.!?]/.test(body)) {
    throw new Error("entry must be a single sentence");
  }
  // Must be valid UTF-8 when encoded (round-trip check).
  const encoded = new TextEncoder().encode(text);
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(encoded);
  if (decoded !== text) {
    throw new Error("entry is not valid UTF-8 text");
  }
}

validate(PITCH);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, PITCH, "utf8");
