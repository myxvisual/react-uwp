import { isSupportBackdropFilter } from "../utils/browser/backdropFilterDetector";

export function getAcrylicTextureStyle(): CSSStyleDeclaration {
  const isSupported = isSupportBackdropFilter();
  let style: CSSStyleDeclaration;
  if (isSupported) {
    style = {
      /**
       * Add theme.baseLow color.
       */
      backgroundColor: "",
      /**
       * Add noise texture.
       */
      backgroundImage: "",
      /**
       * Add blur filter.
       */
      backdropFilter: "blur(10px)"
    } as any;
  } else {
    style = {
      /**
       * Add polyfill texture theme.acrylicText40.
       */
      background: ""
    } as CSSStyleDeclaration;
  }

  return style;
}
