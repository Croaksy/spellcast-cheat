import { discordlessPatch } from "./lib/discordless";
import { CONFIG, waitForUI } from "./lib/ui";

waitForUI.then((ui) => (ui.status = "WIP"));
// We need to do it before everything is loaded.
if (CONFIG.discordless) {
  discordlessPatch();
}
