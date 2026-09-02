// Kilimo, Nitapata? UI strings, English and Swahili.
//
// Everything a person reads on screen lives here, keyed once, in both
// languages. The engine stays language-neutral; this file maps engine
// records (requirement keys, verdict codes) to words.
//
// SWAHILI STATUS: machine-drafted placeholder, 2 Sep 2026. Not reviewed by
// a native speaker yet. Send this file to the reviewer; their edits paste
// straight back into the `sw` blocks below. Do not demo the Swahili toggle
// as final until the REVIEWED flag below is flipped.
export const SWAHILI_REVIEWED = false;

let lang = "en";
export const setLang = (l) => { lang = l === "sw" ? "sw" : "en"; };
export const getLang = () => lang;

export const STRINGS = {
  en: {
    "about": "About",
    "install": "Add to home screen for offline use",
    "acres": "acres",
    "pending": "link pending",
    "home.eyebrow": "Fertilizer e-Voucher readiness demo",
    "home.title": "Nikienda leo, nitapata?",
    "home.lede": "Pick the farmer and the depot. The answer comes with the source behind it.",
    "home.recent": "Recent checks",
    "home.recent.note": "Remembered on this phone only",
    "home.farmer": "Who are you checking for?",
    "home.sample": "Sample records",
    "home.depot": "Which depot?",
    "home.bycounty": "By county",
    "home.farmercounty": "farmer's county",
    "home.unlisted": "Unlisted",
    "home.disclaimer": "Sample farmer and depot records built for this demo, not a live KIAMIS or county lookup.",
    "home.cta": "Check",
    "sheet.search.farmer": "Search by name, ID, county or crop",
    "sheet.search.depot": "Search by depot or county",
    "sheet.none": "No match. Try another spelling.",
    "sheet.locate": "Use my location",
    "sheet.locate.loading": "Finding nearby depots...",
    "sheet.locate.denied": "Location not available. Pick a depot below.",
    "sheet.locate.unavailable": "Location isn't supported on this device. Pick a depot below.",
    "sheet.approx": "approx.",
    "answer.blocking": "What is missing",
    "answer.more": "and {n} more, see the full list",
    "answer.more.depot": "The farmer also has {n} item(s) outstanding, see the full list",
    "answer.price": "Reported price per bag",
    "answer.allocation": "Bags used of allocation",
    "answer.counter": "Show at the counter",
    "answer.share": "Share",
    "answer.read": "Read this to the farmer",
    "answer.another": "Another farmer, same depot",
    "answer.detail": "See everything behind this answer",
    "answer.sample": "Sample data for demonstration. Not a live KIAMIS or county record.",
    "answer.ussd": "No data bundle? The same answer works over USSD on a basic phone. Try the live simulator, no shortcode is issued yet, but this dials the real endpoint.",
    "ussd.eyebrow": "No smartphone, no data bundle",
    "ussd.head": "Same answer, on a basic phone",
    "ussd.lede": "This dials the same code the app runs on, live, right now. No shortcode is issued yet, so there is no real phone number to call; this simulator sends the exact request a phone would and shows the exact reply.",
    "ussd.placeholder": "1",
    "ussd.send": "Send",
    "ussd.restart": "Dial again",
    "ussd.back": "Back",
    "ussd.disclaimer": "Every screen here comes from the live /api/ussd endpoint, the same code Africa's Talking would call, not a mock.",
    "ussd.dialing": "Dialling...",
    "ussd.error": "Could not reach the USSD endpoint. Check your connection and dial again.",
    "ussd.ended": "Session ended. Dial again to start over.",
    "answer.copied": "Copied",
    "counter.eyebrow": "Status for depot staff",
    "counter.back": "Back",
    "detail.eyebrow": "Behind the answer",
    "detail.reqs": "Every requirement",
    "detail.prices": "Price, as reported",
    "detail.prices.note": "Two sources report different capped prices, a year apart. Treat both as reported figures, not a guarantee. The depot's posted price on the day governs.",
    "detail.sources": "Sources",
    "detail.how": "How this tool decides",
    "detail.how.1": "The six requirements and the two prices are transcribed from the five published news and analysis sources above, not from the underlying gazette notice or the KIAMIS system's own user manual, which were not publicly retrievable at build time. Where sources disagree, both figures are shown with their date and source rather than one being picked as correct.",
    "detail.how.2": "The match between a farmer and a depot is decided by a fixed rule table, not a language model: each requirement is checked against the selected farmer's record, each depot carries its own authorisation flag, and the verdict is whichever is worse of the two. Nothing is inferred or guessed.",
    "detail.back": "Back to the answer",
    "about.eyebrow": "Why this needs to exist",
    "about.head": "He can't tell a fair price from an inflated one.",
    "about.p1": "He already knows he's enrolled. What he doesn't know, until he's standing at the counter, is whether the price he's being asked for is the real one, or whether he's about to lose a day's labour and a fare finding out the hard way that something in his registration is missing.",
    "about.quote": "One farmer reached his depot by 4am and still found seven people ahead of him.",
    "about.p2": "Knowing you're eligible doesn't shorten that queue. But knowing before you travel, and being able to prove the price at the counter, changes what the trip costs you if it goes wrong.",
    "about.tie": "The person typing the question, the person deciding whether to travel, and the person who has to be convinced at the counter are three different people. Most tools like this get built for the first one and quietly fail the other two.",
    "about.farmer": "The farmer",
    "about.farmer.p": "Nikienda leo, nitapata? If I go today, will I get it? He doesn't think in terms of eligibility. He thinks in terms of \"they said we'd get fertiliser,\" and finds out otherwise only after he's already spent the trip.",
    "about.proxy": "The proxy",
    "about.proxy.p": "He's the one actually holding the phone, usually a son, daughter or grandchild who already runs the household's WhatsApp. He has to relay the answer accurately enough, by voice, that an older relative is willing to travel on the strength of it.",
    "about.clerk": "The depot clerk",
    "about.clerk.p": "Not a user of this app. The person the answer has to survive. A farmer holding up a screen with a specific number, from a specific dated source, either corrects a mistake or starts a confrontation, and he's the one who absorbs it either way.",
    "about.officer": "The extension officer",
    "about.officer.p": "She's already answering this question, one farmer at a time, all day. If this tool makes her faster, adoption doesn't happen one download at a time. It happens in groups, the moment she uses it in front of people she already talks to.",
    "about.what": "What this is",
    "about.what.p": "A readiness explainer using sample records: whether the record has a documented blocker, what may still be missing, and what published reports say about price. It cannot confirm live stock or final depot approval.",
    "about.not": "Not this",
    "about.not.1": "Buying, selling or reserving fertilizer. No marketplace function.",
    "about.not.2": "Fertilizer or crop advice. No agronomic recommendations.",
    "about.not.3": "M-Pesa or any payment. Nothing here moves money.",
    "about.cta": "Go to the check",
    "footer.1": "Built for the Claude Impact Lab, Nairobi · informational status check only",
    "footer.2": "Not affiliated with the Ministry of Agriculture or KIAMIS"
  },
  sw: {
    "about": "Kuhusu",
    "install": "Weka kwenye skrini ya nyumbani, itafanya kazi bila mtandao",
    "acres": "ekari",
    "pending": "kiungo kinasubiri",
    "home.eyebrow": "Hali ya vocha ya mbolea",
    "home.title": "Nikienda leo, nitapata?",
    "home.lede": "Chagua mkulima na kituo. Jibu linakuja na chanzo chake.",
    "home.recent": "Ukaguzi wa hivi karibuni",
    "home.recent.note": "Umehifadhiwa kwenye simu hii pekee",
    "home.farmer": "Unamkagulia nani?",
    "home.sample": "Rekodi za mfano",
    "home.depot": "Kituo kipi?",
    "home.bycounty": "Kwa kaunti",
    "home.farmercounty": "kaunti ya mkulima",
    "home.unlisted": "Hakijaorodheshwa",
    "home.disclaimer": "Rekodi za wakulima na vituo ni za mfano kwa onyesho hili, si taarifa hai kutoka KIAMIS au kaunti.",
    "home.cta": "Kagua",
    "sheet.search.farmer": "Tafuta kwa jina, nambari, kaunti au zao",
    "sheet.search.depot": "Tafuta kwa kituo au kaunti",
    "sheet.none": "Hakuna kilichopatikana. Jaribu tahajia nyingine.",
    "sheet.locate": "Tumia mahali nilipo",
    "sheet.locate.loading": "Inatafuta vituo vya karibu...",
    "sheet.locate.denied": "Mahali hapapatikani. Chagua kituo hapa chini.",
    "sheet.locate.unavailable": "Kifaa hiki hakitumii huduma ya mahali. Chagua kituo hapa chini.",
    "sheet.approx": "takriban",
    "answer.blocking": "Kinachokosekana",
    "answer.more": "na {n} zaidi, tazama orodha kamili",
    "answer.more.depot": "Mkulima pia ana jambo {n} linalosubiri, tazama orodha kamili",
    "answer.price": "Bei iliyoripotiwa kwa mfuko",
    "answer.allocation": "Mifuko iliyotumika kati ya mgao",
    "answer.counter": "Onyesha dirishani",
    "answer.share": "Tuma",
    "answer.read": "Soma ujumbe huu kwa mkulima",
    "answer.another": "Mkulima mwingine, kituo hiki",
    "answer.detail": "Tazama kila kitu nyuma ya jibu hili",
    "answer.sample": "Data ya mfano kwa onyesho. Si rekodi hai ya KIAMIS au kaunti.",
    "answer.ussd": "Huna bando? Jibu hili hili linapatikana kwa USSD kwenye simu ya kawaida. Jaribu kiigaji hai, nambari ya umma bado haijatolewa, lakini hii inapiga huduma halisi.",
    "ussd.eyebrow": "Hakuna simu janja, hakuna bando",
    "ussd.head": "Jibu lile lile, kwenye simu ya kawaida",
    "ussd.lede": "Hii inapiga msimbo uleule programu inaotumia, hai, sasa hivi. Nambari ya umma bado haijatolewa, kwa hivyo hakuna nambari halisi ya kupiga; kiigaji hiki kinatuma ombi sahihi ambalo simu ingetuma na kuonyesha jibu sahihi.",
    "ussd.placeholder": "1",
    "ussd.send": "Tuma",
    "ussd.restart": "Piga tena",
    "ussd.back": "Rudi",
    "ussd.disclaimer": "Kila skrini hapa inatoka kwa huduma hai ya /api/ussd, msimbo uleule ambao Africa's Talking ingepiga, si igizo.",
    "ussd.dialing": "Inapiga...",
    "ussd.error": "Imeshindwa kufikia huduma ya USSD. Angalia mtandao wako na upige tena.",
    "ussd.ended": "Kikao kimekwisha. Piga tena kuanza upya.",
    "answer.copied": "Imenakiliwa",
    "counter.eyebrow": "Hali kwa wafanyakazi wa kituo",
    "counter.back": "Rudi",
    "detail.eyebrow": "Nyuma ya jibu",
    "detail.reqs": "Kila sharti",
    "detail.prices": "Bei, kama ilivyoripotiwa",
    "detail.prices.note": "Vyanzo viwili vinaripoti bei tofauti za juu, tofauti ya mwaka mmoja. Zichukulie zote kama zilizoripotiwa, si hakikisho. Bei iliyobandikwa kituoni siku hiyo ndiyo inayotumika.",
    "detail.sources": "Vyanzo",
    "detail.how": "Chombo hiki kinaamua vipi",
    "detail.how.1": "Masharti sita na bei mbili zimenukuliwa kutoka vyanzo vitano vya habari na uchambuzi vilivyochapishwa hapo juu, si kutoka tangazo la gazeti la serikali au mwongozo wa mfumo wa KIAMIS, ambavyo havikupatikana hadharani wakati wa ujenzi. Pale vyanzo vinapotofautiana, takwimu zote mbili zinaonyeshwa na tarehe na chanzo chake badala ya kuchagua moja kama sahihi.",
    "detail.how.2": "Ulinganifu kati ya mkulima na kituo unaamuliwa na jedwali la sheria lisilobadilika, si mfumo wa lugha: kila sharti linakaguliwa dhidi ya rekodi ya mkulima aliyechaguliwa, kila kituo kina alama yake ya idhini, na jibu ni lile baya zaidi kati ya hayo mawili. Hakuna kinachokisiwa.",
    "detail.back": "Rudi kwenye jibu",
    "about.eyebrow": "Kwa nini hiki kinahitajika",
    "about.head": "Hawezi kutofautisha bei halali na iliyopandishwa.",
    "about.p1": "Tayari anajua amesajiliwa. Asichojua, hadi anaposimama dirishani, ni kama bei anayoombwa ndiyo halisi, au kama anakaribia kupoteza siku ya kazi na nauli kugundua kwa shida kuwa kitu katika usajili wake kinakosekana.",
    "about.quote": "Mkulima mmoja alifika kituoni saa kumi alfajiri na bado akakuta watu saba mbele yake.",
    "about.p2": "Kujua unastahili hakufupishi foleni hiyo. Lakini kujua kabla ya kusafiri, na kuweza kuthibitisha bei dirishani, kunabadilisha gharama ya safari ikiharibika.",
    "about.tie": "Anayeandika swali, anayeamua kusafiri, na anayepaswa kushawishiwa dirishani ni watu watatu tofauti. Vyombo vingi kama hiki hujengwa kwa wa kwanza na kushindwa kimya kimya kwa wengine wawili.",
    "about.farmer": "Mkulima",
    "about.farmer.p": "Nikienda leo, nitapata? Hafikirii kwa maneno ya kustahili. Anafikiri \"walisema tutapata mbolea,\" na anagundua vinginevyo tu baada ya kuwa ametumia safari.",
    "about.proxy": "Mwakilishi",
    "about.proxy.p": "Ndiye anayeshikilia simu, mara nyingi mwana, binti au mjukuu anayeendesha WhatsApp ya nyumba. Anapaswa kufikisha jibu kwa usahihi, kwa sauti, kiasi kwamba mzee yuko tayari kusafiri kwa kulitegemea.",
    "about.clerk": "Karani wa kituo",
    "about.clerk.p": "Si mtumiaji wa programu hii. Ndiye jibu linapaswa kumshinda. Mkulima anayeonyesha skrini yenye nambari maalum, kutoka chanzo chenye tarehe, ama anasahihisha kosa au anaanzisha mzozo, na ndiye anayebeba matokeo kwa vyovyote.",
    "about.officer": "Afisa ugani",
    "about.officer.p": "Tayari anajibu swali hili, mkulima mmoja baada ya mwingine, siku nzima. Chombo hiki kikimfanya awe haraka, matumizi hayaenei kwa kupakua moja moja. Yanaenea kwa makundi, wakati anakitumia mbele ya watu anaozungumza nao tayari.",
    "about.what": "Hiki ni nini",
    "about.what.p": "Ukaguzi wa hali ya vocha ya ruzuku ya mbolea: kama kituo fulani kitamhudumia mkulima aliyesajiliwa, ni nini hasa bado kinakosekana, na mfuko unagharimu kiasi gani kulingana na nyaraka. Kila jibu lina chanzo chake.",
    "about.not": "Si hiki",
    "about.not.1": "Kununua, kuuza au kuweka akiba ya mbolea. Hakuna soko.",
    "about.not.2": "Ushauri wa mbolea au mazao. Hakuna mapendekezo ya kilimo.",
    "about.not.3": "M-Pesa au malipo yoyote. Hakuna pesa inayohamishwa hapa.",
    "about.cta": "Nenda kwenye ukaguzi",
    "footer.1": "Imejengwa kwa Claude Impact Lab, Nairobi · ukaguzi wa taarifa pekee",
    "footer.2": "Haihusiani na Wizara ya Kilimo au KIAMIS"
  }
};

export const VERDICT = {
  en: { ok: "No sample-record blocker", warn: "Action required", danger: "Cannot confirm readiness" },
  sw: { ok: "Hakuna kizuizi kwenye rekodi ya mfano", warn: "Hatua inahitajika", danger: "Utayari hauwezi kuthibitishwa" }
};

// Requirement titles by engine key. "depot" is the blocking item the engine
// returns when the depot itself is the problem.
export const REQ = {
  en: {
    registered: "Registered in the county / KIAMIS voucher system",
    idLinked: "National ID available and linked to the record",
    acreage: "Land acreage confirmed",
    acChief: "Validated by the local Assistant Chief",
    subCounty: "Approved by the Sub-County Agricultural Officer",
    withinLimit: "Bags-per-acre allocation not yet exhausted",
    depot: "Not an authorised redemption point",
    subsidy: "Subsidy not yet released by government"
  },
  sw: {
    registered: "Amesajiliwa katika mfumo wa vocha wa kaunti / KIAMIS",
    idLinked: "Kitambulisho cha taifa kipo na kimeunganishwa na rekodi",
    acreage: "Ukubwa wa shamba umethibitishwa",
    acChief: "Amethibitishwa na Chifu Msaidizi wa eneo",
    subCounty: "Ameidhinishwa na Afisa wa Kilimo wa Kaunti Ndogo",
    withinLimit: "Mgao wa mifuko kwa ekari bado haujaisha",
    depot: "Si kituo kilichoidhinishwa kutoa mbolea",
    subsidy: "Ruzuku bado haijatolewa na serikali"
  }
};

export function t(key){
  const v = STRINGS[lang][key];
  return v == null ? STRINGS.en[key] : v;
}
export function tReq(item){ return REQ[lang][item.key] || REQ.en[item.key] || item.title; }
export function tVerdict(code, other = false){
  const l = other ? (lang === "sw" ? "en" : "sw") : lang;
  return VERDICT[l][code];
}

// One-paragraph reason, rebuilt from the verdict flags so Swahili does not
// depend on translating the engine's English sentence.
export function tReason(r, f, d){
  if(lang === "en") return r.reason.text;
  if(!r.depotOK) return d.name + " hakiko kwenye orodha ya vituo vilivyoidhinishwa kwa mpango huu, bila kujali hali ya mkulima. Kituo cha NCPB, duka la ushirika, ghala la KNTC au duka la pembejeo lililosajiliwa linahitajika.";
  if(!f.registered) return f.name + " hana usajili wa kaunti / KIAMIS, kwa hivyo hakuna kituo kinachoweza kutoa vocha bado.";
  if(r.gaps.length === 0) return "Masharti yote " + r.checks.length + " yametimizwa na " + d.name + " ni kituo kilichoidhinishwa. Mfuko unaweza kuchukuliwa kwa vocha.";
  return d.name + " kimeidhinishwa na kitamhudumia " + f.name + " mara jambo lililo hapa chini litakapotatuliwa.";
}

// Read-aloud script for the proxy: three short lines, always both
// languages, written to be relayed by voice to someone who is not looking
// at the screen.
export function tScript(r, f, d, blocking){
  const price = "Ksh 2,500";
  const lines = [];
  if(r.verdict === "ok"){
    lines.push({ sw: "Rekodi ya mfano ya " + f.name + " haina kizuizi kilichoandikwa kwa " + d.name + ".", en: f.name + " has no documented sample-record blocker for " + d.name + "." });
    lines.push({ sw: "Thibitisha akiba, saa za kufungua na idhini ya mwisho kabla ya kusafiri.", en: "Confirm stock, opening status and final approval before travelling." });
  } else if(!r.depotOK){
    lines.push({ sw: f.name + ", usiende " + d.name + ". Hakijaidhinishwa.", en: f.name + ", do not go to " + d.name + ". It is not authorised." });
    lines.push({ sw: "Nenda kituo cha NCPB, ushirika, KNTC au duka lililosajiliwa.", en: "Go to an NCPB depot, cooperative, KNTC or registered agrovet instead." });
  } else if(!f.registered){
    lines.push({ sw: "Rekodi ya mfano ya " + f.name + " haionyeshi usajili. Utayari hauwezi kuthibitishwa.", en: f.name + " has no registration in this sample record. Readiness cannot be confirmed." });
    lines.push({ sw: "Anza na usajili wa kaunti / KIAMIS.", en: "Start with county / KIAMIS registration." });
  } else {
    const more = r.gaps.length - 1;
    lines.push({ sw: "Rekodi ya mfano ya " + f.name + " bado ina jambo linalohitaji kushughulikiwa.", en: f.name + " still has an item requiring attention in this sample record." });
    lines.push({
      sw: "Kinachokosekana: " + REQ.sw[blocking.key] + (more > 0 ? ", na mengine " + more + "." : "."),
      en: "Missing: " + REQ.en[blocking.key] + (more > 0 ? ", and " + more + " more." : ".")
    });
  }
  lines.push({ sw: "Ripoti moja ya 2025 inataja " + price + " kwa mfuko; ripoti ya 2023 inataja Ksh 3,500. Thibitisha bei ya sasa.", en: "One 2025 secondary report states " + price + " per bag; a 2023 report states Ksh 3,500. Confirm the current posted price." });
  return lines;
}
