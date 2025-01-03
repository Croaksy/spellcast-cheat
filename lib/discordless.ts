import { CONFIG } from "./ui";
import { waitForValue } from "./utils";

/**
 * Changes Discord SDK to mock version (thx Discord devs).
 */
function SDKPatch() {
  Object.defineProperty(Object.prototype, "DiscordSDK", {
    set: () => {},
    get: function () {
      // TODO: Patch mock to return better user info values and maybe even allow Discord-less parties.
      return this.DiscordSDKMock;
    },
  });
}

/**
 * Patches Discord SDK wrapper used by game to return fake auth results.
 */
function XSDiscordPatch() {
  // @ts-ignore
  waitForValue(() => unsafeWindow?.XS?.Discord).then((x) => {
    x._state.authenticated = true;
    x._state.joined_activity = true;
    x.data = {
      user: {
        avatar: "",
        discriminator: "",
        icon: "",
        id: CONFIG.discordlessFakeID,
        public_flags: 0,
        username: CONFIG.discordlessFakeName,
      },
    };
    x.getChannelID = (cb: (x: string) => void) =>
      cb(CONFIG.discordlessFakeChannel);
  });
}

/**
 * Applies all patches needed for making SpellCast Discord-less.
 */
export function discordlessPatch() {
  SDKPatch();
  XSDiscordPatch();
}
