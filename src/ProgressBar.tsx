import * as React from "react";
import { useContext, useMemo } from "react";

import vendors from "./utils/browser/vendors";
const vendorPrefixes: string[] = vendors.map(str => str ? `-${str}-` : str);

export interface DataProps {
  /**
   * Set progress value. `(0 <= value <=1)`
   */
  defaultProgressValue?: number;
  /**
   * Set ProgressBar to indeterminate model.
   */
  isIndeterminate?: boolean;
  /**
   * Set ProgressBar width.
   */
  barWidth?: number;
  /**
   * Set ProgressBar height.
   */
  barHeight?: number;
  /**
   * Set ProgressBar animation speed.
   */
  speed?: number;
}

export type ProgressBarProps = DataProps & React.HTMLAttributes<HTMLDivElement>;

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const {
    defaultProgressValue = 0.5,
    isIndeterminate = false,
    speed = 4000,
    barWidth = 320,
    barHeight = 4,
    className,
    style,
    ...attributes
  } = props;

  const theme = useContext<ReactUWP.ThemeType>({ theme: {} } as any);

  // Generate unique class name for animation
  const onlyClassName = useMemo(() => `react-uwp-progress-bar_${speed}`, [speed]);

  // Generate animation CSS
  const getCSSText = useMemo(() => {
    return (
`.${onlyClassName} {
}
${Array(5).fill(0).map((name, index) => (
  [`.${onlyClassName}-item-` + index + " {",
  vendorPrefixes.map(str => (`    ${str}animation: ProgressBar ${speed}ms ${index * barHeight * barWidth * speed / 5 / 10e3}ms cubic-bezier(0.25, 0.75, 0.75, 0.25) infinite normal forwards;`)).join("\n"),
  "  }"].join("")
)).join("")}

${vendorPrefixes.map(str => `@${str}keyframes ProgressBar {
  0% {
    left: -${barHeight}px;
  }
  15% {
    left: -${barHeight}px;
  }
  85% {
    left: ${barWidth + barHeight}px;
  }
  100% {
    left: ${barWidth + barHeight}px;
  }
}`)}.join("")`);
  }, [onlyClassName, speed, barWidth, barHeight]);

  // Add animation CSS to style manager
  useMemo(() => {
    theme.styleManager?.addCSSText(getCSSText);
  }, [theme.styleManager, getCSSText]);

  const cls = getCls(theme, props);

  return (
    <div
      {...attributes}
      style={cls.root}
      className={theme.classNames?.(cls.rootClass, className) || cls.rootClass}
    >
      <div style={cls.bar} className={cls.barClass}>
        {isIndeterminate ? Array(5).fill(0).map((numb, index) => (
          <div
            key={`${index}`}
            className={theme.classNames?.(cls.itemClass, `${onlyClassName}-item-${index}`) || `${onlyClassName}-item-${index}`}
            style={cls.item}
          />
        )) : null}
      </div>
    </div>
  );
};

export default ProgressBar;

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getCls = (theme: ReactUWP.ThemeType, props: ProgressBarProps) => {
  const {
    style,
    barWidth = 320,
    barHeight = 4,
    isIndeterminate = false,
    defaultProgressValue = 0.5
  } = props;
  const { prefixStyle, prepareStyles } = theme;

  const rawStyles = {
    root: prefixStyle({
      display: "inline-block",
      verticalAlign: "middle",
      background: isIndeterminate ? void 0 : theme.chromeLow,
      overflow: "hidden",
      width: barWidth,
      height: barHeight,
      ...style
    }),
    bar: prefixStyle({
      overflow: "hidden",
      background: isIndeterminate ? void 0 : theme.accent,
      position: "relative",
      width: "100%",
      height: "100%",
      transform: isIndeterminate ? void 0 : `translate3d(-${(1 - defaultProgressValue) * 100}%, 0, 0)`
    }),
    item: {
      background: theme.listAccentHigh,
      position: "absolute",
      top: 0,
      left: -barHeight,
      width: barHeight,
      height: barHeight,
      borderRadius: barHeight
    }
  };

  const classMap = prepareStyles({ styles: rawStyles, className: "progress-bar" });
  
  return {
    root: rawStyles.root,
    rootClass: classMap.root,
    bar: rawStyles.bar,
    barClass: classMap.bar,
    item: rawStyles.item,
    itemClass: classMap.item
  };
};
