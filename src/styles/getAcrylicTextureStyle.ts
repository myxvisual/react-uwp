import { isSupportBackdropFilter } from "../utils/browser/backdropFilterDetector";

export { isSupportBackdropFilter };

export interface AcrylicConfig { tintColor: string; blurSize: number; background?: string; }

export function getAcrylicTextureStyle(config: AcrylicConfig, useFluentDesign = true) {
  const { tintColor, blurSize, background } = config;
  let style: React.CSSProperties = useFluentDesign ? {
    /**
     * Add theme.baseLow color.
     */
    background: background ? `${background}, ${tintColor}` : tintColor,
    backgroundBlendMode: "exclusion",
    /**
     * Add blur filter.
     */
    backdropFilter: `blur(${blurSize}px)`,
    transform: "translate3d(0, 0, 0)"
  } : {
    /**
     * Add theme.baseLow color.
     */
    background: background ? `linear-gradient(${tintColor}, ${tintColor}), ${background}` : tintColor,
    backgroundBlendMode: "overlay",
    transform: "translate3d(0, 0, 0)"
  };

  return style;
}
