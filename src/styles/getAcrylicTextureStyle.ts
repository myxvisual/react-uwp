import { isSupportBackdropFilter } from "../utils/browser/backdropFilterDetector";

export { isSupportBackdropFilter };

export interface AcrylicConfig { tintColor: string; opacity: number; blurSize: number; }

export function getAcrylicTextureStyle(config: AcrylicConfig) {
  const isSupported = isSupportBackdropFilter();
  let style: React.CSSProperties;
  const { tintColor, opacity, blurSize } = config;
  if (isSupported) {
    style = {
      /**
       * Add theme.baseLow color.
       */
      backgroundColor: tintColor,
      /**
       * Add noise texture.
       */
      backgroundImage: "",
      /**
       * Add blur filter.
       */
      backdropFilter: `blur(${blurSize}px)`
    } as any;
  } else {
    style = {
      /**
       * Add polyfill texture theme.acrylicText40.
       */
      background: tintColor
    };
  }

  return style;
}
