import { noColors } from "../common/color";
import { Screen } from "../models/json-types";

// Output does not go to terminal, but colors are controlled with terminal env vars.
export const nonTerminalScreen: Screen = {
    colors: noColors,
    isTTY: false,
    ttyWidth: 0,
    ttyHeight: 0,
    resolveFiles: "rootDir",
};
