// Kilimo, Nitapata? USSD menu.
//
// Pure function over the Africa's Talking session `text` field (every input
// the user has typed so far, joined by "*"). Returns the next screen as a
// string starting "CON " (keep the session open) or "END " (close it).
// No HTTP, no state, no copies of engine data: it imports the same engine
// the web app uses, so both channels give the same verdict by construction.
import { FARMERS, DEPOTS, ussdText } from "./engine.js";

// A USSD screen is roughly 182 characters on most Kenyan networks. Menus
// stay under this; the verdict itself is capped by ussdText().
export const USSD_SCREEN_BUDGET = 182;

const shortDepot = (d) => d.name
  .replace("Highland Farmers Cooperative Store", "Highland Coop Store")
  .replace(" Warehouse", "")
  .replace(" Depot", "");

export function farmerMenu() {
  return "CON Kilimo, Nitapata?\nChagua mkulima / Pick farmer:\n" +
    FARMERS.map((f, i) => `${i + 1}. ${f.name} ${f.id}`).join("\n");
}

export function depotMenu(farmer) {
  return `CON ${farmer.name}. Chagua kituo / Pick depot:\n` +
    DEPOTS.map((d, i) => `${i + 1}. ${shortDepot(d)}`).join("\n");
}

/** Next screen for the accumulated `text`. Empty text is the first dial. */
export function ussdMenu(text = "") {
  const steps = String(text).split("*").filter((x) => x !== "");
  if (steps.length === 0) return farmerMenu();

  const farmer = FARMERS[Number(steps[0]) - 1];
  if (!farmer) return "END Chaguo si sahihi. Piga tena. / Invalid choice. Dial again.";
  if (steps.length === 1) return depotMenu(farmer);

  const depot = DEPOTS[Number(steps[1]) - 1];
  if (!depot) return "END Chaguo si sahihi. Piga tena. / Invalid choice. Dial again.";
  return "END " + ussdText(farmer, depot);
}
