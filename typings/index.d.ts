interface Window {
  __REACT_UWP__?: {
    baseCSSRequired?: boolean;
    version?: string;
    docRootPath?: string;
    scrollReveals?: {
      rootElm?: HTMLElement;
      animate?: () => void;
      animated?: boolean;
      initializeAnimation: () => void;
      props: {
        speed?: number;
        style?: React.CSSProperties;
        animatedStyle?: React.CSSProperties;
        children?: React.ReactElement<any>;
        topOffset?: number;
        bottomOffset?: number;
      }
    }[];
    scrollRevealListener?: (e?: Event) => void;
  }
}

interface AcrylicTexture {
  tintColor?: string;
  tintOpacity?: number;
  blurSize?: number;
  noiseSize?: number;
  noiseOpacity?: number;
  background?: string;
}

declare namespace ReactUWP {
  interface ThemeType {
    themeName: "dark" | "light";
    fontFamily?: string;
    iconFontFamily?: string;

    useFluentDesign?: boolean;
    desktopBackgroundImage?: string;
    desktopBackground?: string;

    acrylicTexture40: AcrylicTexture;
    acrylicTexture60: AcrylicTexture;
    acrylicTexture80: AcrylicTexture;

    accent?: string;
    accentLighter1?: string;
    accentLighter2?: string;
    accentLighter3?: string;
    accentDarker1?: string;
    accentDarker2?: string;
    accentDarker3?: string;

    baseLow?: string;
    baseMediumLow?: string;
    baseMedium?: string;
    baseMediumHigh?: string;
    baseHigh?: string;

    altLow?: string;
    altMediumLow?: string;
    altMedium?: string;
    altMediumHigh?: string;
    altHigh?: string;

    listLow?: string;
    listMedium?: string;
    listAccentLow?: string;
    listAccentMedium?: string;
    listAccentHigh?: string;

    chromeLow?: string;
    chromeMediumLow?: string;
    chromeMedium?: string;
    chromeHigh?: string;

    chromeAltLow?: string;

    chromeDisabledLow?: string;
    chromeDisabledHigh?: string;

    chromeBlackLow?: string;
    chromeBlackMediumLow?: string;
    chromeBlackMedium?: string;
    chromeBlackHigh?: string;

    chromeWhite?: string;

    prepareStyles?: <TAny>(style?: React.CSSProperties | TAny) => TAny | React.CSSProperties;
    isDarkTheme?: boolean;
    updateTheme?: (theme: ThemeType) => void;
    saveTheme?: (theme: ThemeType) => void;
    typography?: {
      header?: React.CSSProperties;
      subHeader?: React.CSSProperties;

      title?: React.CSSProperties;
      subTitle?: React.CSSProperties;
      subTitleAlt?: React.CSSProperties;

      base?: React.CSSProperties;
      baseAlt?: React.CSSProperties;
      Body?: React.CSSProperties;

      captionAlt?: React.CSSProperties;
      caption?: React.CSSProperties;
    };
    zIndex?: {
      listView?: number;
      calendarView?: number;
      flyout?: number;
      tooltip?: number;
      dropDownMenu?: number;
      commandBar?: number;
      contentDialog?: number;
      mediaPlayer?: number;
      header?: number;
      [key: string]: number;
    };
  }
}
