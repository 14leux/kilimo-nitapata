// Manual check against a real Upstash db. Never runs in tests.
//   UPSTASH_REDIS_REST_URL=... UPSTASH_REDIS_REST_TOKEN=... node scripts/seed.js [seasonId]
import { createStore, envClient, key } from "../lib/store.js";
const sid = process.argv[2] || "2026-long-rains";
const store = createStore(await envClient());
const season = await store.reset(sid);
const keys = await store.client.keys(`${key.prefix(sid)}*`);
console.log(`seeded season ${season.id} (${season.name}), ${keys.length} keys, active = ${await store.getActiveSeasonId()}`);
