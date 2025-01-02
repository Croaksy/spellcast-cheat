import { Pane, TextBladeApi } from "tweakpane";
import { waitForValue } from "./utils";

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
      }

      set status(value: string) {
        this.statusBlade.value = value;
      }
    })()
);
