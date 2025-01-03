import { Pane, TextBladeApi } from "tweakpane";
import { waitForValue } from "./utils";

/**
 * Config.
 * It it set to default values initially.
 */
export const CONFIG = {
  discordless: false,
  discordlessFakeName: "Frog",
  // Making default value random instead of hardcoded so everyone on Discord-less doesn't get the same "account" by default.
  discordlessFakeID: Math.floor(
    Math.random() * Number.MAX_SAFE_INTEGER
  ).toString(),
  discordlessFakeChannel: "123456789012345678",
};

let savedConfigString;
if (localStorage && (savedConfigString = localStorage.getItem("sc-config"))) {
  try {
    let savedConfig = JSON.parse(savedConfigString);
    for (let key in CONFIG) {
      if (typeof savedConfig[key] !== "undefined") {
        // @ts-ignore
        CONFIG[key] = savedConfig[key];
      }
    }
  } catch {
    console.warn("Failed to load saved config:", savedConfigString);
  }
}

// Waiting for document body instead of changing @run-at, because we still need document-start to inject stuff before game loads.
export const waitForUI = waitForValue(() => document.body).then(
  () =>
    new (class {
      pane: Pane;
      statusBlade: TextBladeApi<any>;

      constructor() {
        this.pane = new Pane({
          title: "SpellCast cheat",
          expanded: true,
        });
        // For some reason tweakpane does not give itself high zIndex and doesn't properly expose the element, so that's the only way.
        // Otherwise, it would be hidden behind the game canvas.
        (
          document.querySelector('div[class*="tp"]') as HTMLDivElement
        ).style.zIndex = "99999";
        this.statusBlade = this.pane.addBlade({
          view: "text",
          label: "status",
          parse: (v: string) => v,
          value: "Loading...",
          disabled: true,
        }) as TextBladeApi<any>;
        let discordlessFolder = this.pane.addFolder({ title: "Discord-less" });
        let discordlessEnabled = discordlessFolder.addBinding(
          CONFIG,
          "discordless",
          {
            label: "enabled",
          }
        );
        let discordlessFakeName = discordlessFolder.addBinding(
          CONFIG,
          "discordlessFakeName",
          {
            label: "fakeName",
          }
        );
        let discordlessFakeID = discordlessFolder.addBinding(
          CONFIG,
          "discordlessFakeID",
          {
            label: "fakeID",
          }
        );
        let discordlessFakeChannel = discordlessFolder.addBinding(
          CONFIG,
          "discordlessFakeChannel",
          {
            label: "fakeChannel",
          }
        );
        discordlessEnabled.on("change", (e) => {
          discordlessFakeName.hidden =
            discordlessFakeID.hidden =
            discordlessFakeChannel.hidden =
              !e.value;
        });
        this.pane.on("change", () => {
          try {
            localStorage.setItem("sc-config", JSON.stringify(CONFIG));
          } catch {}
        });
      }

      set status(value: string) {
        this.statusBlade.value = value;
      }
    })()
);
