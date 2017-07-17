import { CustomCSSProperties } from "./StyleManager";

export interface StyleWithClass {
  style?: CustomCSSProperties;
  className?: string;
}

const emptyFunc = () => {};

export function setStylesToManager(config?: {
  className?: string;
  styles: { [key: string]: StyleWithClass | CustomCSSProperties };
  theme: ReactUWP.ThemeType;
}, callback: (CSSText?: string) => void = emptyFunc) {
  const newStyles: {
    [key: string]: {
      className?: string;
      style?: React.CSSProperties;
    }
  } = {};
  let { className, styles, theme } = config;
  className = className || "";
  const keys = Object.keys(styles);

  let CSSText = "";
  for (const key of keys) {
    let styleItem: StyleWithClass = styles[key] as StyleWithClass;
    const isStyleWithClass = styleItem.className || styleItem.style;
    let secondClassName: string = `-${key}`;

    if (isStyleWithClass) {
      secondClassName = styleItem.className;
      secondClassName = secondClassName ? `-${secondClassName}` : "";
      secondClassName = `-${key}${secondClassName}`;
    }

    const { dynamicStyle, ...styleProperties } = isStyleWithClass ? styleItem.style : styleItem;
    const sheet = theme.styleManager.addSheetWithUpdate(
      styleProperties,
      `${className}${secondClassName}`
    );
    newStyles[key] = {
      className: sheet.classNameWithHash,
      style: dynamicStyle
    };
    CSSText += `${sheet.CSSText}\n`;
  }

  callback(CSSText);
  return newStyles;
}

export function setStyleToManager(config?: {
  theme?: ReactUWP.ThemeType;
  style: CustomCSSProperties;
  className: string;
}, callback: (CSSText?: string) => void = emptyFunc) {
  let newStyles:  {
    className?: string;
    style?: CustomCSSProperties;
  } = {};
  let { style, className, theme } = config;
  const { dynamicStyle, ...styleProperties } = style;
  className = className || "";
  const sheet = theme.styleManager.addSheetWithUpdate(styleProperties, className);
  newStyles = {
    className: sheet.classNameWithHash,
    style: dynamicStyle
  };

  callback(sheet.CSSText);
  return newStyles;
}
