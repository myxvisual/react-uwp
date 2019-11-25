import { isSupportBackdropFilter } from "../utils/browser/backdropFilterDetector";

export { isSupportBackdropFilter };

export interface AcrylicConfig { tintColor: string; blurSize: number; backgroundImage?: string; }

export function getAcrylicTextureStyle(config: AcrylicConfig) {
  const isSupported = isSupportBackdropFilter();
  let style: React.CSSProperties;
  const { tintColor, blurSize, backgroundImage } = config;
  if (isSupported) {
    style = {
      /**
       * Add theme.baseLow color.
       */
      backgroundColor: `${tintColor}`,
      backgroundImage,
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
