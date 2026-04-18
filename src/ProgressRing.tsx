import { useTheme } from './hooks/useTheme';
import * as React from "react";
import { useContext, useMemo } from "react";

import vendors from "./utils/browser/vendors";
const vendorPrefixes: string[] = vendors.map(str => str ? `-${str}-` : str);

export interface DataProps {
  /**
   * Set number of dots.
   */
  dotsNumber?: number;
  /**
   * Set ProgressRing size(px).
   */
  size?: number;
  /**
   * Set ProgressRing animate run once speed (2 loop).
   */
  speed?: number;
  /**
   * Set ProgressRing dots custom style.
   */
  dotsStyle?: React.CSSProperties;
}
export type ProgressRingProps = DataProps & React.HTMLAttributes<HTMLDivElement>;

const ProgressRing: React.FC<ProgressRingProps> = (props) => {
  const {
    dotsNumber = 6,
    size = 100,
    speed = 5000,
    dotsStyle,
    style,
    className,
    ...attributes
  } = props;

  const theme = useContext<ReactUWP.ThemeType>({ theme: {} } as any);

  // Generate unique class name for animation
  const onlyClassName = useMemo(() => `react-uwp-progress-ring_${dotsNumber}_${speed}`, [dotsNumber, speed]);

  // Generate animation CSS
  const getCSSText = useMemo(() => {
    return (
`.${onlyClassName} {
}
${Array(dotsNumber).fill(0).map((name, index) => (
  [`.${onlyClassName}-item-` + index + " {",
  vendorPrefixes.map(str => (`    ${str}animation: CircleLoopFade ${speed}ms ${index * speed / 40}ms linear infinite normal forwards;`)).join("\n"),
  "  }"].join("")
)).join("")}

${vendorPrefixes.map(str => `@${str}keyframes CircleLoopFade {
  0% {
    transform: rotateZ(0deg);
    opacity: 1;
  }
  12.5% {
    transform: rotateZ(180deg);
    opacity: 0.8;
  }
  25% {
    transform: rotateZ(270deg);
    opacity: 0.8;
  }
  37.5% {
    transform: rotateZ(300deg);
    opacity: 0.8;
  }
  50% {
    transform: rotateZ(360deg);
    opacity: 1;
  }
  62.5% {
    transform: rotateZ(540deg);
    opacity: 0;
  }
  75% {
    transform: rotateZ(630deg);
    opacity: 0;
  }
  87.5% {
    transform: rotateZ(660deg);
    opacity: 0;
  }
  100% {
    transform: rotateZ(720deg);
    opacity: 1;
  }
}`)}.join("")`);
  }, [onlyClassName, dotsNumber, speed]);

  // Add animation CSS to style manager
  useMemo(() => {
    theme.styleManager?.addCSSText(getCSSText);
  }, [theme.styleManager, getCSSText]);

  const cls = getCls(theme, props);

  return (
    <div
      {...attributes}
      className={theme.classNames?.(cls.rootClass, className) || cls.rootClass}
      style={cls.root}
    >
      <div>
        {Array(dotsNumber).fill(0).map((numb, index) => (
          <div
            key={`${index}`}
            className={theme.classNames?.(`${onlyClassName}-item-${index}`, cls.itemClass) || `${onlyClassName}-item-${index}`}
            style={cls.item}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressRing;

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getCls = (theme: ReactUWP.ThemeType, props: ProgressRingProps) => {
  const {
    style,
    dotsStyle,
    size = 100
  } = props;
  const dotsSize = size / 12;

  const rawStyles = {
    root: theme.prefixStyle({
      display: "inline-block",
      ...style,
      width: size,
      height: size,
      position: "relative"
    }),
    item: theme.prefixStyle({
      background: theme.accent,
      ...dotsStyle,
      position: "absolute",
      top: 0,
      left: size / 2,
      width: dotsSize,
      height: dotsSize,
      opacity: 0,
      transformOrigin: `0px ${size / 2}px`,
      borderRadius: dotsSize
    })
  };

  const classMap = theme.prepareStyles({ styles: rawStyles, className: "progress-ring" });
  
  return {
    root: rawStyles.root,
    rootClass: classMap.root,
    item: rawStyles.item,
    itemClass: classMap.item
  };
};
