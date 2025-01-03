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
    // TODO: Let user change fake ID, name & channel ID.
    x.data = {
      avatar: "",
      discriminator: "",
      icon: "",
      id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(),
      public_flags: 0,
      username: "Frog",
    };
    x.getChannelID = (cb: (x: string) => void) => cb("123456789012345678");
  });
}

/**
 * Applies all patches needed for making SpellCast Discord-less.
 */
export function discordlessPatch() {
  SDKPatch();
  XSDiscordPatch();
}
