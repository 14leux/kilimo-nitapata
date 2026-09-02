// Kilimo, Nitapata? officer auth. Server only.
//
// One shared demo passcode in a header, per specs/07-architecture.md. Not
// real auth. Compares fixed-length hashes, not the raw strings, so unequal
// lengths never short circuit the comparison.
import { createHash, timingSafeEqual } from "node:crypto";

const digest = (v) => createHash("sha256").update(String(v ?? "")).digest();

export function checkPasscode(provided, expected = process.env.OFFICER_PASSCODE) {
  if (!expected) return false;
  return timingSafeEqual(digest(provided), digest(expected));
}

/** Sends 401 with no body detail and returns false when the passcode is wrong. */
export function requireOfficer(req, res) {
  const provided = req.headers && req.headers["x-officer-passcode"];
  if (checkPasscode(provided)) return true;
  res.status(401).end();
  return false;
}
