export interface StyleWithClassName {
  style?: React.CSSProperties;
  inlineStyle?: React.CSSProperties;
  className?: string;
}

export default function setStylesToManager(config?: {
  baseClassName?: string;
  styles?: { [key: string]: StyleWithClassName };
  theme?: ReactUWP.ThemeType;
}) {
  const newStyles: {
    [key: string]: {
      className?: string;
      style?: React.CSSProperties;
    }
  } = {};
  let { baseClassName, styles, theme } = config;
  baseClassName = baseClassName || "";
  const keys = Object.keys(styles);
  for (const key of keys) {
    let className = styles[key].className;
    className = className ? `-${className}` : "";
    newStyles[key] = {
      className: theme.styleManager.addSheet(styles[key].style, `${baseClassName}${className}`).classNameWithHash,
      style: styles[key].inlineStyle
    };
  }
  return newStyles;
}
