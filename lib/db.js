// Shared production store handle. Server only.
//
// Lazy and cached across invocations on the same Vercel instance. Tests
// never import this: they build createStore(memoryClient()) and pass it
// straight into each api file's createHandler(store).
import { createStore, envClient } from "./store.js";

let storePromise;

export function getStore() {
  if (!storePromise) storePromise = envClient().then(createStore);
  return storePromise;
}
