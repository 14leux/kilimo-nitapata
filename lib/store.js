// Kilimo, Nitapata? store. Server only.
//
// Holds only what the sub-county officer can change (season, approvals),
// plus release snapshots, message logs and the dirty set. The register
// itself stays in engine.js as seed. Keys follow specs/03-data-model.md.
//
// createStore(client) takes any object with the Redis commands used here
// (get, set, del, keys, sadd, srem, smembers). Production passes an
// @upstash/redis client; tests pass memoryClient().
import { FARMERS, SIGNATURE_KEYS, DEFAULT_PRICE_PER_BAG } from "../engine.js";

export const key = {
  season: (sid) => `season:${sid}`,
  active: () => "season:active",
  approval: (sid, fid, req) => `season:${sid}:approval:${fid}:${req}`,
  status: (sid, fid) => `season:${sid}:status:${fid}`,
  statusVersion: (sid, fid, v) => `season:${sid}:status:${fid}:v${v}`,
  msg: (sid, fid, n) => `season:${sid}:msg:${fid}:${n}`,
  dirty: (sid) => `season:${sid}:dirty`,
  prefix: (sid) => `season:${sid}`
};

/** Last four digits only. Never log or return a full phone number. */
export function maskPhone(phone) {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, "");
  return digits.length >= 4 ? "+…" + digits.slice(-4) : "+…";
}

/** In-memory stand-in with the same command surface, for tests and `npm run dev`. */
export function memoryClient() {
  const kv = new Map();
  const sets = new Map();
  return {
    async get(k) { return kv.has(k) ? kv.get(k) : null; },
    async set(k, v) { kv.set(k, v); return "OK"; },
    async del(...ks) { let n = 0; for (const k of ks.flat()) { n += kv.delete(k) ? 1 : 0; n += sets.delete(k) ? 1 : 0; } return n; },
    async keys(pattern) {
      const re = new RegExp("^" + pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$");
      return [...new Set([...kv.keys(), ...sets.keys()])].filter((k) => re.test(k));
    },
    async sadd(k, ...members) { const s = sets.get(k) || new Set(); let n = 0; for (const m of members.flat()) { if (!s.has(m)) { s.add(m); n++; } } sets.set(k, s); return n; },
    async srem(k, ...members) { const s = sets.get(k); if (!s) return 0; let n = 0; for (const m of members.flat()) n += s.delete(m) ? 1 : 0; return n; },
    async smembers(k) { return [...(sets.get(k) || [])]; }
  };
}

/** Production client from env. Lazy so tests never touch the network. */
export async function envClient() {
  const url = process.env.UPSTASH_REDIS_REST_URL, token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not set");
  const { Redis } = await import("@upstash/redis");
  return new Redis({ url, token });
}

const enc = (v) => JSON.stringify(v);
const dec = (v) => (v == null ? null : typeof v === "string" ? JSON.parse(v) : v);

export function createStore(client) {
  const getJSON = async (k) => dec(await client.get(k));
  const setJSON = (k, v) => client.set(k, enc(v));

  return {
    client,

    // Season
    async getSeason(sid) { return getJSON(key.season(sid)); },
    async putSeason(season) { await setJSON(key.season(season.id), season); return season; },
    async getActiveSeasonId() { return (await client.get(key.active())) || null; },
    async setActiveSeasonId(sid) { await client.set(key.active(), sid); },
    async logSeason(sid, who, what, now = new Date().toISOString()) {
      const s = await getJSON(key.season(sid));
      if (!s) throw new Error(`no season ${sid}`);
      s.log = [...(s.log || []), { at: now, who, what }];
      await setJSON(key.season(sid), s);
      return s;
    },

    // Approvals
    async getApproval(sid, fid, req) { return getJSON(key.approval(sid, fid, req)); },
    async putApproval(sid, fid, req, { signed, signedBy }, now = new Date().toISOString()) {
      const prev = (await getJSON(key.approval(sid, fid, req))) || { history: [] };
      const rec = { signed: Boolean(signed), signedBy: signed ? signedBy || null : null, signedAt: signed ? now : null,
        history: [...(prev.history || []), { signed: Boolean(signed), signedBy: signedBy || null, at: now }] };
      await setJSON(key.approval(sid, fid, req), rec);
      return rec;
    },
    async approvalsFor(sid, fid) {
      const out = {};
      for (const req of SIGNATURE_KEYS) out[req] = await getJSON(key.approval(sid, fid, req));
      return out;
    },

    // Snapshots (immutable per version)
    async getStatus(sid, fid) { return getJSON(key.status(sid, fid)); },
    async putStatus(sid, fid, snapshot) {
      const prev = await getJSON(key.status(sid, fid));
      const version = (prev ? prev.version : 0) + 1;
      const rec = { ...snapshot, version };
      await setJSON(key.status(sid, fid), rec);
      await setJSON(key.statusVersion(sid, fid, version), rec);
      await client.srem(key.dirty(sid), fid);
      return rec;
    },

    // Messages
    async logMessage(sid, fid, entry) {
      const n = (await client.keys(`${key.prefix(sid)}:msg:${fid}:*`)).length + 1;
      const rec = { ...entry, to: maskPhone(entry.to), at: entry.at || new Date().toISOString() };
      await setJSON(key.msg(sid, fid, n), rec);
      return rec;
    },
    async messagesFor(sid, fid) {
      const ks = (await client.keys(`${key.prefix(sid)}:msg:${fid}:*`)).sort((a, b) => Number(a.split(":").pop()) - Number(b.split(":").pop()));
      const out = [];
      for (const k of ks) out.push(await getJSON(k));
      return out;
    },

    // Dirty set
    async markDirty(sid, ...fids) { if (fids.flat().length) await client.sadd(key.dirty(sid), ...fids.flat()); },
    async clearDirty(sid, fid) { await client.srem(key.dirty(sid), fid); },
    async listDirty(sid) { return client.smembers(key.dirty(sid)); },

    // Seed and reset
    async seed(sid, { name = "2026 long rains", now = new Date().toISOString() } = {}) {
      const season = { id: sid, name, status: "draft", subsidyReleased: false, pricePerBag: DEFAULT_PRICE_PER_BAG, priceSource: "engine",
        openedAt: null, releasedAt: null, closedAt: null, log: [{ at: now, who: "seed", what: "seeded from engine.js" }] };
      await setJSON(key.season(sid), season);
      await client.set(key.active(), sid);
      for (const f of FARMERS) {
        for (const req of SIGNATURE_KEYS) {
          await setJSON(key.approval(sid, f.id, req), { signed: Boolean(f[req]), signedBy: f[req] ? "register" : null, signedAt: f[req] ? now : null,
            history: [{ signed: Boolean(f[req]), signedBy: f[req] ? "register" : null, at: now }] });
        }
      }
      return season;
    },
    async reset(sid, opts) {
      const ks = await client.keys(`${key.prefix(sid)}*`);
      if (ks.length) await client.del(...ks);
      return this.seed(sid, opts);
    }
  };
}
