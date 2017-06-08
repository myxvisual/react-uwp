import * as tinycolor from "tinycolor2";
import "./fonts/segoe-mdl2-assets";
import prefixAll from "../common/prefixAll";

export function darken(color: string, coefficient: number) {
  const hsl = tinycolor(color).toHsl();
  hsl.l = hsl.l * (1 - coefficient);
  return tinycolor(hsl).toRgbString();
}
export function lighten(color: string, coefficient: number) {
  const hsl = tinycolor(color).toHsl();
  hsl.l = hsl.l + (100 - hsl.l) * coefficient;
  return tinycolor(hsl).toRgbString();
}
export interface ThemeConfig {
  themeName?: "dark" | "light";
  accent?: string;

  useFluentDesign?: boolean;
  desktopBackgroundImage?: string;
}

export default function getTheme(themeConfig: ThemeConfig): ReactUWP.ThemeType {
  let {
    themeName,
    accent,

    useFluentDesign,
    desktopBackgroundImage
  } = themeConfig;

  themeName = themeName || "dark";
  accent = accent || "#0078D7";
  useFluentDesign = useFluentDesign === void 0 ? false : useFluentDesign;

  const isDark = themeName === "dark";
  const baseHigh = isDark ? "#fff" : "#000";
  const altHigh = isDark ? "#000" : "#fff";
  const baseHighColor = tinycolor(baseHigh);
  const altHighColor = tinycolor(altHigh);
  const accentColor = tinycolor(accent);
  const accentColorHsl = accentColor.toHsl();

  return {
    themeName,
    fontFamily: "Segoe UI, Microsoft YaHei, Open Sans, sans-serif, Hiragino Sans GB, Arial, Lantinghei SC, STHeiti, WenQuanYi Micro Hei, SimSun",
    iconFontFamily: "Segoe MDL2 Assets",

    useFluentDesign,
    desktopBackgroundImage,

    acrylicTextures: {
      acrylicTexture40: {
        background: "none"
      },
      acrylicTexture60: {
        background: "none"
      },
      acrylicTexture80: {
        background: "none"
      }
    },

    accent,
    accentLighter1: lighten(accentColor.toHexString(), 0.5),
    accentLighter2: lighten(accentColor.toHexString(), 0.7),
    accentLighter3: lighten(accentColor.toHexString(), 0.9),
    accentDarker1: darken(accentColor.toHexString(), 0.5),
    accentDarker2: darken(accentColor.toHexString(), 0.7),
    accentDarker3: darken(accentColor.toHexString(), 0.9),

    baseLow: baseHighColor.setAlpha(0.2).toRgbString(),
    baseMediumLow: baseHighColor.setAlpha(0.4).toRgbString(),
    baseMedium: baseHighColor.setAlpha(0.6).toRgbString(),
    baseMediumHigh: baseHighColor.setAlpha(0.8).toRgbString(),
    baseHigh,

    altLow: altHighColor.setAlpha(0.2).toRgbString(),
    altMediumLow: altHighColor.setAlpha(0.4).toRgbString(),
    altMedium: altHighColor.setAlpha(0.6).toRgbString(),
    altMediumHigh: altHighColor.setAlpha(0.8).toRgbString(),
    altHigh,

    listLow: baseHighColor.setAlpha(0.1).toRgbString(),
    listMedium: baseHighColor.setAlpha(0.2).toRgbString(),
    listAccentLow: accentColor.setAlpha(0.6).toRgbString(),
    listAccentMedium: accentColor.setAlpha(0.8).toRgbString(),
    listAccentHigh: accentColor.setAlpha(0.9).toRgbString(),

    chromeLow: isDark ? "#171717" : "#f2f2f2",
    chromeMediumLow: isDark ? "#2b2b2b" : "f2f2f2",
    chromeMedium: isDark ? "#1f1f1f" : "#e6e6e6",
    chromeHigh: isDark ? "#767676" : "#ccc",

    chromeAltLow: isDark ? "#f2f2f2" : "#171717",
    chromeDisabledLow: isDark ? "#858585" : "#7a7a7a",
    chromeDisabledHigh: isDark ? "#333" : "#ccc",

    chromeBlackLow: tinycolor("#000").setAlpha(0.2).toRgbString(),
    chromeBlackMediumLow: tinycolor("#000").setAlpha(0.4).toRgbString(),
    chromeBlackMedium: tinycolor("#000").setAlpha(0.8).toRgbString(),
    chromeBlackHigh: "#000",
    chromeWhite: "#fff",

    isDarkTheme: isDark,
    prepareStyles: prefixAll(),

    typography: {
      header: {
        fontWeight: "lighter",
        fontSize: 46,
        lineHeight: "56px"
      },
      subHeader: {
        fontWeight: "lighter",
        fontSize: 34,
        lineHeight: "40px"
      },

      title: {
        fontWeight: "lighter",
        fontSize: 24,
        lineHeight: "28px"
      },
      subTitle: {
        fontWeight: "normal",
        fontSize: 20,
        lineHeight: "24px"
      },
      subTitleAlt: {
        fontWeight: "normal",
        fontSize: 18,
        lineHeight: "20px"
      },

      base: {
        fontWeight: 300,
        fontSize: 15,
        lineHeight: "20px"
      },
      baseAlt: {
        fontWeight: "bold",
        fontSize: 15,
        lineHeight: "20px"
      },
      Body: {
        fontWeight: 200,
        fontSize: 15,
        lineHeight: "20px"
      },

      captionAlt: {
        fontWeight: "lighter",
        fontSize: 13,
        lineHeight: "16px"
      },
      caption: {
        fontWeight: "lighter",
        fontSize: 12,
        lineHeight: "14px"
      }
    },
    zIndex: {
      listView: 10,
      calendarView: 20,
      flyout: 100,
      tooltip: 101,
      dropDownMenu: 102,
      commandBar: 200,
      contentDialog: 300,
      mediaPlayer: 2147483647
    }
  };
}
