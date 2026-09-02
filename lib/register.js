// Kilimo, Nitapata? register. Server only.
//
// Merges the seed register in engine.js with what the store overlays
// (signature approvals) and the season, so evaluate() sees one farmer
// object and never reads the store itself. See specs/04-data-flow.md.
import { FARMERS, DEPOTS, SIGNATURE_KEYS, findDepot, findFarmerByToken } from "../engine.js";

export async function loadSeason(store, sid) {
  const id = sid || (await store.getActiveSeasonId());
  if (!id) return null;
  return store.getSeason(id);
}

/** One farmer with approvals overlaid. Register facts are never changed here. */
export async function loadFarmer(store, sid, farmer) {
  const approvals = await store.approvalsFor(sid, farmer.id);
  const merged = { ...farmer, approvals: {} };
  for (const req of SIGNATURE_KEYS) {
    const a = approvals[req];
    if (a) {
      merged[req] = Boolean(a.signed);
      merged.approvals[req] = { signedBy: a.signedBy, signedAt: a.signedAt };
    }
  }
  return merged;
}

export async function loadFarmers(store, sid) {
  const out = [];
  for (const f of FARMERS) out.push(await loadFarmer(store, sid, f));
  return out;
}

export async function loadFarmerByToken(store, sid, token) {
  const f = findFarmerByToken(token);
  return f ? loadFarmer(store, sid, f) : null;
}

export const collectionPoint = (farmer) => findDepot(farmer.collectionPointId) || DEPOTS[0];

/** Phones the sender may use: not demo, present. */
export const isMessageable = (farmer) => Boolean(farmer.phone) && farmer.demo !== true;
