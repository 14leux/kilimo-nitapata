// Vercel serverless function: toggle a signature approval, per
// specs/04-data-flow.md. Appends approval history via lib/store.js and
// marks the farmer dirty for re-send once the season has released.
import { requireOfficer } from "../lib/auth.js";
import { getStore } from "../lib/db.js";
import { loadFarmer, collectionPoint } from "../lib/register.js";
import { findFarmer, evaluate, SIGNATURE_KEYS } from "../engine.js";

export function createHandler(store) {
  return async function handler(req, res) {
    if (!requireOfficer(req, res)) return;

    const { farmerId, reqKey, signed, signedBy } = req.body || {};
    if (!SIGNATURE_KEYS.includes(reqKey)) {
      res.status(400).json({ error: "reqKey must be acChief or subCounty" });
      return;
    }
    const seedFarmer = findFarmer(farmerId);
    if (!seedFarmer) {
      res.status(404).json({ error: "unknown farmer" });
      return;
    }
    const sid = await store.getActiveSeasonId();
    if (!sid) {
      res.status(404).json({ error: "no active season" });
      return;
    }

    const approval = await store.putApproval(sid, farmerId, reqKey, { signed: Boolean(signed), signedBy });

    const season = await store.getSeason(sid);
    if (season.status === "released") await store.markDirty(sid, farmerId);

    const farmer = await loadFarmer(store, sid, seedFarmer);
    const depot = collectionPoint(farmer);
    const verdict = evaluate(farmer, depot, season).verdict;

    res.status(200).json({ approval, verdict });
  };
}

export default async function handler(req, res) {
  return createHandler(await getStore())(req, res);
}
