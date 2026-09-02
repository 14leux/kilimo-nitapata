# 03 Data model

Store: Redis via the Vercel Marketplace (Upstash), one env var, `@upstash/redis`. Keys are namespaced by season so a reset is a key-prefix delete. Seed data comes from `engine.js`; the store holds only what the officer can change plus snapshots and logs.

## Farmer (seed, from engine.js, extended)
```
id            "F-2291"
name, county, crop, acres
registered, idLinked, acreage, withinLimit  booleans / derived   (register facts, read only in v1)
bagsUsed, bagsAllocated
collectionPointId  "D-01"                      (new, assigned by the register)
phone         "+2547..."                        (new, E.164, may be null)
demo          true | false                       (new, true = placeholder phone, never messaged)
lang          "sw" | "en"                       (new, default sw)
token         "k7Qx9..."                        (new, 12 char random, farmer page key)
```

## Approval (store, per farmer per signature requirement)
```
key       "season:{sid}:approval:{farmerId}:{reqKey}"   reqKey in acChief | subCounty
signed    boolean
signedBy  string | null
signedAt  ISO | null
history   [{ signed, signedBy, at }]
```
Seed: from the farmer's boolean in engine.js, signedBy "register", signedAt seed time.

## Season (store)
```
key              "season:{sid}"
id, name         "2026 long rains"
status           draft | open | released | closed
subsidyReleased  boolean
pricePerBag      number      default PRICES[0] amount as a number, 2500
priceSource      "engine" | "officer"
openedAt, releasedAt, closedAt  ISO | null
log              [{ at, who, what }]
```
`season:active` holds the current sid.

## Status snapshot (store, written at release and at every "Send updates")
```
key         "season:{sid}:status:{farmerId}"
farmerId, depotId
verdict     ok | warn | danger
blocking    { key, title, src } | null
gaps        [{ key, title, src }]
approvals   [{ key, title, signed, signedBy, src }]
cost        { pricePerBag, priceSource, priceSrc, bagsRemaining, total, subsidyNote, noOtherFee }
sources     [ids]
text        { sw, en }            releaseText output, what was actually sent
computedAt  ISO
version     integer, increments per farmer per send
```

## Message log (store)
```
key        "season:{sid}:msg:{farmerId}:{n}"
channel    whatsapp | sms | ussd
to         masked phone
status     queued | sent | failed | demo | no-phone
providerId Twilio SID | null
error      string | null
at         ISO
statusVersion  integer, which snapshot it carried
```

## Dirty set (store)
```
key   "season:{sid}:dirty"        Redis set of farmerIds whose approvals or season inputs changed since their last snapshot
```
Added on approval toggle, price change, or subsidy flag change (all farmers). Cleared per farmer when a new snapshot is written. Drives "Send updates (N)".

## Depot (seed, unchanged)
As in engine.js. `coords` reserved for Milestone B.

## Relationships
- Farmer 1 to 1 collection point (depot).
- Farmer 1 to N approvals (one per signature requirement).
- Season 1 to N snapshots (one per farmer, latest version wins, older kept under `:v{n}`).
- Snapshot 1 to N messages.

## Locked decisions
- Register facts stay in `engine.js` as seed; the store only overlays approvals and season state. `evaluate()` takes the merged farmer object, so the engine never reads the store.
- Snapshots are immutable once written; a change writes a new version.
- Phone numbers are never returned to the farmer page or logged unmasked.
