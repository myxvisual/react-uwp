import { CustomCSSProperties } from "./StyleManager";

export interface StyleWithClassName {
  style?: CustomCSSProperties;
  inlineStyle?: React.CSSProperties;
  className?: string;
}

export function setStylesToManager(config?: {
  baseClassName?: string;
  styleWithClassNames: { [key: string]: StyleWithClassName };
  theme: ReactUWP.ThemeType;
}) {
  const newStyles: {
    [key: string]: {
      className?: string;
      style?: React.CSSProperties;
    }
  } = {};
  let { baseClassName, styleWithClassNames, theme } = config;
  baseClassName = baseClassName || "";
  const keys = Object.keys(styleWithClassNames);
  for (const key of keys) {
    let className = styleWithClassNames[key].className;
    className = className ? `-${className}` : "";
    className = `-${key}${className}`;
    newStyles[key] = {
      className: theme.styleManager.addSheetWithUpdate(styleWithClassNames[key].style, `${baseClassName}${className}`).classNameWithHash,
      style: styleWithClassNames[key].inlineStyle
    };
  }
  return newStyles;
}

export function setStyleToManager(config?: {
  style: CustomCSSProperties;
  inlineStyle?: React.CSSProperties;
  className: string;
  theme?: ReactUWP.ThemeType;
}) {
  let newStyles:  {
    className?: string;
    style?: React.CSSProperties;
  } = {};
  let { style, inlineStyle, className, theme } = config;
  className = className || "";
  newStyles = {
    className: theme.styleManager.addSheet(style, className).classNameWithHash,
    style: inlineStyle
  };
  return newStyles;
}
