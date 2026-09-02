// Vercel serverless function: season flags, per specs/04-data-flow.md.
//
// Opens or closes the season and sets subsidyReleased or pricePerBag, each
// logged. Out of scope: the "release" action itself (messaging, snapshot
// writes, the released status) lives in /api/release.
import { requireOfficer } from "../lib/auth.js";
import { getStore } from "../lib/db.js";
import { FARMERS } from "../engine.js";

const HANDLED_ACTIONS = new Set(["open", "close"]);

export function createHandler(store) {
  return async function handler(req, res) {
    if (!requireOfficer(req, res)) return;

    const { action, subsidyReleased, pricePerBag } = req.body || {};
    if (!HANDLED_ACTIONS.has(action)) {
      res.status(400).json({ error: "action must be open or close; release goes through /api/release" });
      return;
    }

    const sid = await store.getActiveSeasonId();
    if (!sid) {
      res.status(404).json({ error: "no active season" });
      return;
    }

    const now = new Date().toISOString();
    let season = await store.getSeason(sid);

    if (action === "open" && season.status === "draft") {
      season.status = "open";
      season.openedAt = now;
      await store.putSeason(season);
      season = await store.logSeason(sid, "officer", "opened season", now);
    } else if (action === "close" && season.status !== "closed") {
      season.status = "closed";
      season.closedAt = now;
      await store.putSeason(season);
      season = await store.logSeason(sid, "officer", "closed season", now);
    }

    let allFarmersDirty = false;
    if (typeof subsidyReleased === "boolean" && subsidyReleased !== season.subsidyReleased) {
      season.subsidyReleased = subsidyReleased;
      await store.putSeason(season);
      season = await store.logSeason(sid, "officer", `subsidyReleased set to ${subsidyReleased}`, now);
      allFarmersDirty = true;
    }
    if (typeof pricePerBag === "number" && pricePerBag !== season.pricePerBag) {
      season.pricePerBag = pricePerBag;
      season.priceSource = "officer";
      await store.putSeason(season);
      season = await store.logSeason(sid, "officer", `pricePerBag set to ${pricePerBag}`, now);
      allFarmersDirty = true;
    }
    if (allFarmersDirty) await store.markDirty(sid, ...FARMERS.map((f) => f.id));

    res.status(200).json({ season });
  };
}

export default async function handler(req, res) {
  return createHandler(await getStore())(req, res);
}
