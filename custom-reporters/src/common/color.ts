export const webColors = {
    enabled: true,
    reset: (text: string) => applyStyle(0, 0, text),

    bold: (text: string) => applyStyle(1, 22, text),
    dim: (text: string) => applyStyle(2, 22, text),
    italic: (text: string) => applyStyle(3, 23, text),
    underline: (text: string) => applyStyle(4, 24, text),
    inverse: (text: string) => applyStyle(7, 27, text),
    hidden: (text: string) => applyStyle(8, 28, text),
    strikethrough: (text: string) => applyStyle(9, 29, text),

    black: (text: string) => applyStyle(30, 39, text),
    red: (text: string) => applyStyle(31, 39, text),
    green: (text: string) => applyStyle(32, 39, text),
    yellow: (text: string) => applyStyle(33, 39, text),
    blue: (text: string) => applyStyle(34, 39, text),
    magenta: (text: string) => applyStyle(35, 39, text),
    cyan: (text: string) => applyStyle(36, 39, text),
    white: (text: string) => applyStyle(37, 39, text),
    gray: (text: string) => applyStyle(90, 39, text),
    grey: (text: string) => applyStyle(90, 39, text),
};

export type Colors = typeof webColors;

export const noColors: Colors = {
    enabled: false,
    reset: (t) => t,
    bold: (t) => t,
    dim: (t) => t,
    italic: (t) => t,
    underline: (t) => t,
    inverse: (t) => t,
    hidden: (t) => t,
    strikethrough: (t) => t,
    black: (t) => t,
    red: (t) => t,
    green: (t) => t,
    yellow: (t) => t,
    blue: (t) => t,
    magenta: (t) => t,
    cyan: (t) => t,
    white: (t) => t,
    gray: (t) => t,
    grey: (t) => t,
};

const applyStyle = (open: number, close: number, text: string) =>
    `\u001b[${open}m${text}\u001b[${close}m`;

import colorsLibrary from "colors/safe";
export const colors = colorsLibrary;
