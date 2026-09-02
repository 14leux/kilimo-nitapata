// Vercel serverless function: officer board, per specs/04-data-flow.md.
//
// Computes every farmer's verdict live from the merged register plus the
// season and approval overlay. Never reads a status snapshot; that
// asymmetry (board live, farmer page frozen) is a locked decision.
import { requireOfficer } from "../lib/auth.js";
import { getStore } from "../lib/db.js";
import { loadSeason, loadFarmers, collectionPoint } from "../lib/register.js";
import { evaluate, blockingItem } from "../engine.js";

export function createHandler(store) {
  return async function handler(req, res) {
    if (!requireOfficer(req, res)) return;

    const season = await loadSeason(store, null);
    const sid = season ? season.id : null;
    const farmers = sid ? await loadFarmers(store, sid) : [];

    const rows = [];
    for (const f of farmers) {
      const depot = collectionPoint(f);
      const result = evaluate(f, depot, season);
      const messages = sid ? await store.messagesFor(sid, f.id) : [];
      const last = messages[messages.length - 1];
      rows.push({
        id: f.id,
        name: f.name,
        depot: depot.name,
        verdict: result.verdict,
        blocking: blockingItem(result, depot),
        delivery: last ? last.status : "none"
      });
    }

    res.status(200).json({ season, farmers: rows });
  };
}

export default async function handler(req, res) {
  return createHandler(await getStore())(req, res);
}
