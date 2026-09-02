// Kilimo, Nitapata? rule engine.
//
// The single source of truth for what the product knows and how it decides.
// Both the web page (index.html) and any other channel (USSD, SMS, batch
// mode) import this module so there is exactly one copy of the data and
// exactly one verdict function. Nothing in here touches the DOM, the
// network, or a language model.
//
// evaluate(farmer, depot) is a pure function: same inputs, same output.

export const SOURCES = [
  {
    id: 1,
    title: "State Unveils e-Voucher System",
    pub: "Kenya News Agency (kenyanews.go.ke)",
    url: "https://www.kenyanews.go.ke/state-unveils-e-voucher-system/",
    grounds: ["Registration is via county government", "Only registered farmers are eligible"]
  },
  {
    id: 2,
    title: "Govt Gives Out Vouchers for Fertilizers; How to Apply",
    pub: "Kenyans.co.ke",
    url: "https://www.kenyans.co.ke/news/85395-govt-gives-out-vouchers-fertilizers-how-apply",
    grounds: ["7-step redemption process", "National ID required at depot", "Ksh 3,500 / bag (2023)", "NCPB, Cooperative, KNTC as depots", "KIAMIS platform link"]
  },
  {
    id: 3,
    title: "The Digital Gatekeeper: Decoding Kenya's New Era of Fertilizer Distribution",
    pub: "Jijuze",
    url: "https://jijuze.com/2025/12/23/the-digital-gatekeeper-decoding-kenyas-new-era-of-fertilizer-distribution/",
    grounds: ["Land acreage, crop type and region validation", "Assistant Chief + Sub-County Agricultural Officer approval", "Bags-per-acre limit enforced algorithmically", "Ksh 2,500 cap for DAP/NPK/CAN (2025)", "USSD *6163#, NCPB depots and agrovets"]
  },
  {
    id: 4,
    title: "How You'll Buy Cheaper Farm Inputs Using e-Voucher",
    pub: "eVuna Africa",
    url: "https://www.evuna.africa/how-youll-buy-cheaper-farm-inputs-using-e-voucher/",
    grounds: ["Farmer pays 60% of market price, government covers 40%", "Redemption at nearest agrovet", "Voucher delivered by SMS to basic phones"]
  },
  {
    id: 5,
    // TODO(mailu): confirm exact headline and paste the article URL. Added to the
    // engine on 2 Sep 2026 per FOUNDATION.md decision log; URL was not in the
    // hand-off documents.
    title: "Investigative report on fertilizer subsidy depot queues (Mt Elgon account)",
    pub: "The Star, 25 Aug 2026",
    url: "",
    grounds: ["Problem-scale figures for the problem screen", "Mt Elgon farmer at the depot by 4am with seven people already ahead"]
  }
];

// Requirement gates a farmer's own record must pass. Each is tied to the
// source(s) that document it. Order here is the order shown in the ledger.
export const REQUIREMENTS = [
  { key: "registered",  title: "Registered in the county / KIAMIS voucher system", src: [1, 2, 3] },
  { key: "idLinked",    title: "National ID available and linked to the record",   src: [2] },
  { key: "acreage",     title: "Land acreage confirmed",                          src: [3] },
  { key: "acChief",     title: "Validated by the local Assistant Chief",          src: [2, 3] },
  { key: "subCounty",   title: "Approved by the Sub-County Agricultural Officer", src: [3] },
  { key: "withinLimit", title: "Bags-per-acre allocation not yet exhausted",      src: [3] }
];

// Sample records. These are demo data built for this product, not a feed
// from KIAMIS or any county register. Every channel must label them as such.
export const FARMERS = [
  // v2 fields: collectionPointId is the depot the register assigns; phone is
  // E.164; demo:true means a placeholder number the sender must never message
  // (Twilio trial allows 5 verified numbers, see specs/08 Q3); lang is the
  // language the release message goes out in; token is the farmer page key.
  // TODO(mailu): replace up to five placeholder phones with verified team
  // phones and set demo:false on those only.
  { id: "F-2291", name: "Wanjiru M.", county: "Trans Nzoia", crop: "Maize", acres: 2.5,
    registered: true, idLinked: true, acreage: true, acChief: true, subCounty: true,
    bagsUsed: 4, bagsAllocated: 5,
    collectionPointId: "D-01", phone: "+254700000001", demo: true, lang: "sw", token: "wanj2291kt01" },
  { id: "F-3387", name: "Otieno K.", county: "Kisumu", crop: "Rice", acres: 1,
    registered: true, idLinked: true, acreage: true, acChief: false, subCounty: true,
    bagsUsed: 0, bagsAllocated: 2,
    collectionPointId: "D-04", phone: "+254700000002", demo: true, lang: "sw", token: "otie3387ks04" },
  { id: "F-1046", name: "Chebet R.", county: "Nandi", crop: "Maize", acres: 3,
    registered: true, idLinked: true, acreage: false, acChief: true, subCounty: false,
    bagsUsed: 0, bagsAllocated: 6,
    collectionPointId: "D-03", phone: "+254700000003", demo: true, lang: "sw", token: "cheb1046nd03" },
  { id: "F-5502", name: "Mwangi P.", county: "Nyandarua", crop: "Irish potato", acres: 0.5,
    registered: false, idLinked: false, acreage: false, acChief: false, subCounty: false,
    bagsUsed: 0, bagsAllocated: 0,
    collectionPointId: "D-02", phone: null, demo: true, lang: "en", token: "mwan5502ny02" },
  { id: "F-4118", name: "Kiprotich J.", county: "Uasin Gishu", crop: "Maize", acres: 4,
    registered: true, idLinked: true, acreage: true, acChief: true, subCounty: true,
    bagsUsed: 8, bagsAllocated: 8,
    collectionPointId: "D-02", phone: "+254700000005", demo: true, lang: "en", token: "kipr4118ug02" },
  { id: "F-2790", name: "Achieng L.", county: "Kericho", crop: "Tea", acres: 2,
    registered: true, idLinked: true, acreage: true, acChief: true, subCounty: true,
    bagsUsed: 1, bagsAllocated: 4,
    collectionPointId: "D-06", phone: "+254700000006", demo: true, lang: "sw", token: "achi2790kc06" }
];

export const DEPOTS = [
  { id: "D-01", name: "NCPB Kitale Depot", county: "Trans Nzoia", type: "NCPB depot", authorized: true, fertilizers: ["DAP", "NPK", "CAN"] },
  { id: "D-02", name: "NCPB Eldoret Depot", county: "Uasin Gishu", type: "NCPB depot", authorized: true, fertilizers: ["DAP", "NPK", "CAN"] },
  { id: "D-03", name: "Highland Farmers Cooperative Store", county: "Nandi", type: "Cooperative", authorized: true, fertilizers: ["DAP", "NPK"] },
  { id: "D-04", name: "KNTC Kisumu Warehouse", county: "Kisumu", type: "KNTC warehouse", authorized: true, fertilizers: ["DAP", "NPK", "CAN"] },
  { id: "D-05", name: "Mama Otieno's Agrovet", county: "Kisumu", type: "Independent agrovet (unlisted)", authorized: false, fertilizers: ["DAP", "NPK"] },
  { id: "D-06", name: "Kericho Agrovet Hub", county: "Kericho", type: "Registered agrovet", authorized: true, fertilizers: ["DAP", "NPK", "CAN"] }
];

export const PRICES = [
  { label: "Capped subsidised price, DAP / NPK / CAN", amount: "Ksh 2,500 / bag", src: [3], note: "reported Dec 2025" },
  { label: "Reported redemption price at NCPB / Coop / KNTC counters", amount: "Ksh 3,500 / bag", src: [2], note: "reported 2023" }
];

// Sources that document which kinds of depot are authorised redemption points.
export const DEPOT_AUTH_SRC = [2, 3, 4];

export const VERDICT_LABEL = { ok: "Served", warn: "Conditional", danger: "Not Served" };

/** Does the farmer's record pass one requirement? */
export function passes(farmer, req) {
  if (req.key === "withinLimit") return farmer.bagsUsed < farmer.bagsAllocated;
  return Boolean(farmer[req.key]);
}

// The gate the sub-county officer controls: nothing can be collected until
// the government has released the season's subsidy. Ranked above everything
// else in evaluate() and blockingItem(). Not a published-source requirement,
// so it carries no citation.
export const SUBSIDY_GATE = { key: "subsidy", title: "Subsidy not yet released by government", src: [] };

/**
 * The verdict. Pure, deterministic, no inference.
 *
 * season is optional. When given and season.subsidyReleased is false, the
 * verdict is Not Served for every farmer at every depot, ahead of any other
 * check. Two-argument calls behave exactly as before.
 *
 * Returns:
 *   verdict    "ok" | "warn" | "danger"
 *   reason     { text, src }   plain-language explanation and the sources behind it
 *   subsidyOK  boolean         false only when a season says the subsidy is not released
 *   depotOK    boolean         whether the depot itself is an authorised redemption point
 *   checks     every requirement with pass/fail, in ledger order
 *   gaps       the subset of checks that fail
 */
export function evaluate(farmer, depot, season) {
  const checks = REQUIREMENTS.map((r) => ({
    key: r.key,
    title: r.title,
    src: r.src,
    pass: passes(farmer, r),
    detail: r.key === "withinLimit" ? `${farmer.bagsUsed} of ${farmer.bagsAllocated} bags used` : ""
  }));
  const gaps = checks.filter((c) => !c.pass);
  const depotOK = depot.authorized;
  const subsidyOK = !(season && season.subsidyReleased === false);

  let verdict, reason;
  if (!subsidyOK) {
    verdict = "danger";
    reason = {
      text: `The government has not yet released the fertilizer subsidy for this season, so no depot can issue a bag against the voucher, whatever the farmer's own status.`,
      src: []
    };
  } else if (!depotOK) {
    verdict = "danger";
    reason = {
      text: `${depot.name} is not on the authorised redemption list for this scheme, regardless of the farmer's own status. An authorised NCPB depot, cooperative store, KNTC warehouse or registered agrovet is required.`,
      src: DEPOT_AUTH_SRC
    };
  } else if (!farmer.registered) {
    verdict = "danger";
    reason = {
      text: `${farmer.name} has no county / KIAMIS registration on file, so no depot can issue a voucher yet.`,
      src: [1, 2, 3]
    };
  } else if (gaps.length === 0) {
    verdict = "ok";
    reason = {
      text: `All ${REQUIREMENTS.length} requirements are met and ${depot.name} is an authorised redemption point. The bag can be collected against the voucher.`,
      src: DEPOT_AUTH_SRC
    };
  } else {
    verdict = "warn";
    reason = {
      text: `${depot.name} is authorised and would serve ${farmer.name} once the item(s) below are resolved.`,
      src: []
    };
  }
  return { verdict, reason, subsidyOK, depotOK, checks, gaps };
}

/** Lookup helpers shared by every channel. */
export const findFarmer = (id) => FARMERS.find((f) => f.id === id);
export const findDepot = (id) => DEPOTS.find((d) => d.id === id);
export const findSource = (id) => SOURCES.find((s) => s.id === id);
export const findFarmerByToken = (token) => FARMERS.find((f) => f.token === token);

/**
 * The single most important thing standing between this farmer and a bag,
 * or null when nothing is. Priority mirrors evaluate(): an unauthorised
 * depot outranks anything on the farmer's side; then the first failing
 * requirement in ledger order.
 */
export function blockingItem(result, depot) {
  if (result.subsidyOK === false) return SUBSIDY_GATE;
  if (!result.depotOK) {
    return { key: "depot", title: "Not an authorised redemption point", src: DEPOT_AUTH_SRC };
  }
  return result.gaps.length ? result.gaps[0] : null;
}

/**
 * Everything a counter clerk needs, in the order he needs it, as plain
 * data. Short enough to be read aloud. Used by the web clerk view and
 * reusable by SMS / USSD formatters.
 */
export function clerkSummary(farmer, depot, season) {
  const result = evaluate(farmer, depot, season);
  const blocking = blockingItem(result, depot);
  const others = Math.max(0, result.gaps.length - (blocking && !["depot", "subsidy"].includes(blocking.key) ? 1 : 0));

  let headline;
  if (!result.subsidyOK) {
    headline = `The subsidy for this season has not been released yet. No depot can serve ${farmer.name} until the sub-county office confirms release.`;
  } else if (result.verdict === "ok") {
    headline = `${farmer.name}, ${farmer.id}, is registered and cleared. ${depot.name} is an authorised redemption point.`;
  } else if (!result.depotOK) {
    headline = `${depot.name} is not an authorised redemption point for the e-Voucher scheme. ${farmer.name} should go to an NCPB depot, cooperative store, KNTC warehouse or registered agrovet.`;
  } else if (!farmer.registered) {
    headline = `${farmer.name} has no county or KIAMIS registration on file. No depot can issue a voucher until he is registered.`;
  } else {
    headline = `${farmer.name}, ${farmer.id}, is registered. ${result.gaps.length === 1 ? "One item is" : result.gaps.length + " items are"} still outstanding before ${depot.name} can serve him.`;
  }

  const price = PRICES[0];
  const citedIds = [...new Set([...(result.reason.src), ...(blocking ? blocking.src : []), ...price.src])];

  return {
    verdict: result.verdict,
    label: VERDICT_LABEL[result.verdict],
    headline,
    blocking,
    othersOutstanding: others,
    allocation: `${farmer.bagsUsed} of ${farmer.bagsAllocated} bags used`,
    price,
    sources: citedIds.map(findSource)
  };
}

/**
 * One USSD or SMS screen's worth of verdict. Plain text, no markup, no
 * em dashes, and never longer than USSD_BUDGET characters so it fits a
 * single feature-phone screen. The web share sheet sends exactly this
 * string, so the forwarded SMS and the USSD reply are identical by
 * construction.
 */
export const USSD_BUDGET = 160;

export function ussdText(farmer, depot) {
  const result = evaluate(farmer, depot);
  const blocking = blockingItem(result, depot);
  const label = VERDICT_LABEL[result.verdict].toUpperCase();
  const price = PRICES[0].amount.replace(" / bag", "/bag");

  let middle;
  if (!blocking) {
    middle = "All requirements met.";
  } else if (blocking.key === "depot") {
    middle = "Depot not authorised. Use an NCPB, coop, KNTC or registered agrovet.";
  } else {
    const more = result.gaps.length - 1;
    middle = "Missing: " + blocking.title + (more > 0 ? " (+" + more + " more)" : "") + ".";
  }

  const text = label + ": " + farmer.name + " at " + depot.name + ". " + middle + " " + price + ". Sample data.";
  if (text.length > USSD_BUDGET) {
    throw new Error("ussdText over budget (" + text.length + "): " + text);
  }
  return text;
}

/** Signature requirements: the ones a named person signs. */
export const SIGNATURE_KEYS = ["acChief", "subCounty"];
export const SIGNER = { acChief: "Assistant Chief", subCounty: "Sub-County Agricultural Officer" };

/** Reported price as a number, from the first PRICES entry. */
export const DEFAULT_PRICE_PER_BAG = Number(PRICES[0].amount.replace(/[^0-9]/g, ""));

/**
 * The frozen record a release writes and the farmer page shows. Built from
 * an evaluate() result, never recomputed on the farmer side. Pure: pass
 * `now` to make it deterministic.
 *
 * cost lines carry a src array (published) or priceSource "officer" (set
 * for the season by the sub-county office). Nothing here is a computed
 * subsidy figure: no source gives the full market price, so the subsidy
 * share is stated as text with its source.
 */
export function buildSnapshot(result, farmer, depot, season, now = new Date().toISOString()) {
  const blocking = blockingItem(result, depot);
  const approvals = REQUIREMENTS.filter((r) => SIGNATURE_KEYS.includes(r.key)).map((r) => {
    const rec = (farmer.approvals && farmer.approvals[r.key]) || {};
    return { key: r.key, title: r.title, signer: SIGNER[r.key], signed: Boolean(farmer[r.key]), signedBy: rec.signedBy || null, signedAt: rec.signedAt || null, src: r.src };
  });

  const officerPrice = season && season.pricePerBag != null;
  const pricePerBag = officerPrice ? Number(season.pricePerBag) : DEFAULT_PRICE_PER_BAG;
  const bagsRemaining = Math.max(0, farmer.bagsAllocated - farmer.bagsUsed);
  const cost = {
    pricePerBag,
    priceSource: officerPrice ? "officer" : "engine",
    priceSrc: officerPrice ? [] : PRICES[0].src,
    priceNote: officerPrice ? "set by sub-county office for this season" : PRICES[0].note,
    bagsAllocated: farmer.bagsAllocated,
    bagsUsed: farmer.bagsUsed,
    bagsRemaining,
    total: pricePerBag * bagsRemaining,
    subsidyNote: { text: "Government covers the rest of the market price, reported as 40%.", src: [4] },
    noOtherFee: { text: "No other fee is listed in the published redemption process.", src: [2] }
  };

  const sources = [...new Set([
    ...result.reason.src, ...(blocking ? blocking.src : []), ...cost.priceSrc, ...cost.subsidyNote.src, ...cost.noOtherFee.src,
    ...approvals.flatMap((a) => a.src)
  ])].sort((a, b) => a - b);

  return {
    farmerId: farmer.id,
    depotId: depot.id,
    verdict: result.verdict,
    reason: result.reason,
    blocking,
    gaps: result.gaps.map((g) => ({ key: g.key, title: g.title, src: g.src })),
    approvals,
    cost,
    sources,
    season: season ? { id: season.id || null, subsidyReleased: season.subsidyReleased !== false } : null,
    computedAt: now
  };
}

/** SMS budget for a release message: two segments, link included. */
export const RELEASE_BUDGET = 320;

// Verdict words and action phrases per language. Kept in the engine so a
// release message is generated in exactly one place; requirement titles
// come in through `titles` so the engine never imports the UI strings.
const RELEASE_WORDS = {
  en: { ok: "SERVED", warn: "CONDITIONAL", danger: "NOT SERVED",
        go: "Go to {depot}. Carry your ID and Ksh {price} per bag ({bags} bag(s), total Ksh {total}). No other fee.",
        wait: "Do not travel yet. Pending: {items}. Depot: {depot}. Price Ksh {price} per bag.",
        stop: "Do not travel. {reason}",
        sample: "Sample data." },
  sw: { ok: "UTAPATA", warn: "BADO KUNA KITU", danger: "HUTAPATA",
        go: "Nenda {depot}. Beba kitambulisho na Ksh {price} kwa mfuko (mifuko {bags}, jumla Ksh {total}). Hakuna ada nyingine.",
        wait: "Usisafiri bado. Inasubiri: {items}. Kituo: {depot}. Bei Ksh {price} kwa mfuko.",
        stop: "Usisafiri. {reason}",
        sample: "Data ya mfano." }
};
const RELEASE_REASONS = {
  en: { subsidy: "The subsidy is not yet released by government.", depot: "{depot} is not an authorised depot.", registered: "You are not registered in the county / KIAMIS system." },
  sw: { subsidy: "Ruzuku bado haijatolewa na serikali.", depot: "{depot} si kituo kilichoidhinishwa.", registered: "Hujasajiliwa katika mfumo wa kaunti / KIAMIS." }
};
const fmt = (n) => Number(n).toLocaleString("en-KE");
const fill = (t, v) => t.replace(/\{(\w+)\}/g, (_, k) => v[k]);

/**
 * The message a release sends, from a snapshot. `titles` maps requirement
 * keys to titles in the target language (pass strings.js REQ[lang]);
 * defaults to the engine's English titles. `{link}` is left for the sender
 * to fill. Under RELEASE_BUDGET with a 40-character link for every farmer
 * in the seed register; the test enforces it.
 */
export function releaseText(snapshot, farmer, depot, lang = "en", titles = {}) {
  const w = RELEASE_WORDS[lang] || RELEASE_WORDS.en;
  const rz = RELEASE_REASONS[lang] || RELEASE_REASONS.en;
  const title = (k, fallback) => titles[k] || fallback;
  const v = { depot: depot.name, price: fmt(snapshot.cost.pricePerBag), bags: snapshot.cost.bagsRemaining, total: fmt(snapshot.cost.total) };

  let body;
  if (snapshot.verdict === "ok") {
    body = fill(w.go, v);
  } else if (snapshot.blocking && ["subsidy", "depot", "registered"].includes(snapshot.blocking.key)) {
    body = fill(w.stop, { reason: fill(rz[snapshot.blocking.key], v) });
  } else {
    const names = snapshot.gaps.map((g) => title(g.key, g.title));
    const items = names.length > 2 ? names.slice(0, 2).join("; ") + " +" + (names.length - 2) : names.join("; ");
    body = fill(w.wait, { ...v, items });
  }
  const name = farmer.name.replace(/\.$/, "");
  return `${w[snapshot.verdict]}: ${name}. ${body} ${w.sample} {link}`;
}
