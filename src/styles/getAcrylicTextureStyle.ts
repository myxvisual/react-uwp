import { isSupportBackdropFilter } from "../utils/browser/backdropFilterDetector";

export { isSupportBackdropFilter };

export interface AcrylicConfig { tintColor: string; blurSize: number; background?: string; }

export function getAcrylicTextureStyle(config: AcrylicConfig) {
  const isSupported = isSupportBackdropFilter();
  let style: React.CSSProperties;
  const { tintColor, blurSize, background } = config;
  if (isSupported) {
    style = {
      /**
       * Add theme.baseLow color.
       */
      background: background ? `${background}, ${tintColor}` : `${tintColor}`,
      backgroundBlendMode: "overlay",
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
      background: tintColor,
      backgroundBlendMode: "overlay"
    };
  }

  return style;
}
