import { CustomCSSProperties } from "./StyleManager";

export interface StyleWithClass {
  style?: CustomCSSProperties;
  dynamicStyle?: React.CSSProperties;
  className?: string;
}

export function setStylesToManager(config?: {
  className?: string;
  styles: { [key: string]: StyleWithClass | CustomCSSProperties };
  theme: ReactUWP.ThemeType;
}) {
  const newStyles: {
    [key: string]: {
      className?: string;
      style?: React.CSSProperties;
    }
  } = {};
  let { className, styles, theme } = config;
  className = className || "";
  const keys = Object.keys(styles);

  for (const key of keys) {
    let styleItem: StyleWithClass = styles[key] as StyleWithClass;
    const isStyleWithClass = styleItem.className || styleItem.style || styleItem.dynamicStyle;
    let secondClassName: string = `-${key}`;

    if (isStyleWithClass) {
      secondClassName = styleItem.className;
      secondClassName = secondClassName ? `-${secondClassName}` : "";
      secondClassName = `-${key}${secondClassName}`;
    }

    newStyles[key] = {
      className: theme.styleManager.addSheetWithUpdate(
        isStyleWithClass ? styleItem.style : styleItem,
        `${className}${secondClassName}`
      ).classNameWithHash,
      style: isStyleWithClass ? styleItem.dynamicStyle : void 0
    };
  }
  return newStyles;
}

export function setStyleToManager(config?: {
  theme?: ReactUWP.ThemeType;
  style: CustomCSSProperties;
  className: string;
  dynamicStyle?: React.CSSProperties;
}) {
  let newStyles:  {
    className?: string;
    style?: CustomCSSProperties;
  } = {};
  let { style, dynamicStyle, className, theme } = config;
  className = className || "";
  newStyles = {
    className: theme.styleManager.addSheetWithUpdate(style, className).classNameWithHash,
    style: dynamicStyle
  };
  return newStyles;
}
