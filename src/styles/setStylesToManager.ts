import { CustomCSSProperties } from "./StyleManager";

export interface StyleWithClass {
  style?: CustomCSSProperties;
  dynamicStyle?: React.CSSProperties;
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
    const isStyleWithClass = styleItem.className || styleItem.style || styleItem.dynamicStyle;
    let secondClassName: string = `-${key}`;

    if (isStyleWithClass) {
      secondClassName = styleItem.className;
      secondClassName = secondClassName ? `-${secondClassName}` : "";
      secondClassName = `-${key}${secondClassName}`;
    }

    const sheet = theme.styleManager.addSheetWithUpdate(
      isStyleWithClass ? styleItem.style : styleItem,
      `${className}${secondClassName}`
    );
    newStyles[key] = {
      className: sheet.classNameWithHash,
      style: isStyleWithClass ? styleItem.dynamicStyle : void 0
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
  dynamicStyle?: React.CSSProperties;
}, callback: (CSSText?: string) => void = emptyFunc) {
  let newStyles:  {
    className?: string;
    style?: CustomCSSProperties;
  } = {};
  let { style, dynamicStyle, className, theme } = config;
  className = className || "";
  const sheet = theme.styleManager.addSheetWithUpdate(style, className);
  newStyles = {
    className: sheet.classNameWithHash,
    style: dynamicStyle
  };

  callback(sheet.CSSText);
  return newStyles;
}
