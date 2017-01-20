import { ThemeType } from "./ThemeType";
import * as colors from "./colors";
import { fade, darken, lighten } from "../common/colorManipulator";
import prefixAll from "../common/prefixAll";

const baseHigh = "rgb(255, 255, 255)";
const altHigh = "rgb(0, 0, 0)";
const accent = colors.blue500;

const darkTheme: ThemeType = {
	fontFamily: "Microsoft YaHei, Open Sans, sans-serif, Hiragino Sans GB, Arial, Lantinghei SC, STHeiti, WenQuanYi Micro Hei, SimSun",

	accent,
	accentLighter1: lighten(accent, 0.5),
	accentLighter2: lighten(accent, 0.7),
	accentLighter3: lighten(accent, 0.9),
	accentDarker1: darken(accent, 0.5),
	accentDarker2: darken(accent, 0.7),
	accentDarker3: darken(accent, 0.9),

	baseLow: fade(baseHigh, 0.2),
	baseMediumLow: fade(baseHigh, 0.4),
	baseMedium: fade(baseHigh, 0.6),
	baseMediumHigh: fade(baseHigh, 0.8),
	baseHigh,

	altLow: fade(altHigh, 0.2),
	altMediumLow: fade(altHigh, 0.4),
	altMedium: fade(altHigh, 0.6),
	altMediumHigh: fade(altHigh, 0.8),
	altHigh,

	listLow: fade(baseHigh, 0.1),
	listMedium: fade(baseHigh, 0.2),
	listAccentLow: fade(accent, 0.6),
	listAccentMedium: fade(accent, 0.8),
	listAccentHigh: fade(accent, 0.9),

	chromeLow: "#171717",
	chromeMediumLow: "#2b2b2b",
	chromeMedium: "#1f1f1f",
	chromeHigh: "#767676",
	chromeAltLow: "#f2f2f2",
	chromeDisabledLow: "#858585",
	chromeDisabledHigh: "#333",
	chromeBlackLow: fade("#000", 0.2),
	chromeBlackMediumLow: fade("#000", 0.4),
	chromeBlackMedium: fade("#000", 0.8),
	chromeBlackHigh: "#000",
	chromeWhite: "#fff",

	prepareStyles: prefixAll(),
};

export default darkTheme;
