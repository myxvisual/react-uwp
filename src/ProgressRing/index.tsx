import * as React from "react";
import * as PropTypes from "prop-types";

import vendors from "../common/browser/vendors";
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
export interface ProgressRingProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class ProgressRing extends React.Component<ProgressRingProps> {
  static defaultProps: ProgressRingProps = {
    dotsNumber: 6,
    speed: 5000,
    size: 100
  };
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  getOnlyClassName = () => {
    const {
      dotsNumber,
      speed
    } = this.props;
    return `react-uwp-progress-ring_${dotsNumber}_${speed}`;
  }

  getCSSText = (className?: string) => {
    const { dotsNumber, speed } = this.props;
    return (
`.${className} {
}
${Array(dotsNumber).fill(0).map((name, index) => (
  [`.${className}-item-` + index + " {",
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
  }

  render() {
    const {
      dotsNumber,
      size,
      speed,
      dotsStyle,
      style,
      className,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const onlyClassName = this.getOnlyClassName();
    theme.styleManager.addCSSTextWithUpdate(this.getCSSText(onlyClassName));

    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "progress-ring",
      styles: inlineStyles
    });


    return (
      <div
        {...attributes}
        className={theme.classNames(styles.root.className, className)}
        style={styles.root.style}
      >
        <div>
          {Array(dotsNumber).fill(0).map((numb, index) => (
            <div
              key={`${index}`}
              className={theme.classNames(`${onlyClassName}-item-${index}`, styles.item.className)}
              style={styles.item.style}
            />
          ))}
        </div>
      </div>
    );
  }
}

function getStyles(progressRing: ProgressRing) {
  const {
    props: {
      style,
      dotsStyle,
      size
    },
    context: { theme }
  } = progressRing;
  const dotsSize = size / 12;

  return {
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
}

export default ProgressRing;
