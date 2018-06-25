import * as React from "react";
import * as PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

import CustomAnimate from "../Animate/CustomAnimate";

export interface DataProps {
  /**
   * Set custom Animate speed.
   */
  speed?: number;
  /**
   * Set component leave default style.
   */
  leaveStyle?: React.CSSProperties;
  /**
   * Set component enter default style.
   */
  enterStyle?: React.CSSProperties;
  /**
   * Set custom transitionTimingFunction.
   */
  transitionTimingFunction?: string;
  /**
   * Set custom children.
   */
  children?: React.ReactElement<any> | React.ReactElement<any>[];
  /**
   * Set scroll topOffset,, when `Element` top > topOffset, will animated.
   */
  topOffset?: number;
  /**
   * Set scroll bottomOffset,, when `Element` top + bottomOffset < window.innerHeight, will animated.
   */
  bottomOffset?: number;
  /**
   * Used a `span` wrapper element.
   */
  useWrapper?: boolean;
  /**
   * Set custom wrapper Style.
   */
  wrapperStyle?: React.CSSProperties;
}

export interface ScrollRevealProps extends DataProps {
  style?: React.CSSProperties;
}

export class ScrollReveal extends React.Component<ScrollRevealProps> {
  static defaultProps: ScrollRevealProps = {
    leaveStyle: { transform: "scale(0)" },
    enterStyle: { transform: "scale(1)" },
    speed: 250,
    topOffset: 0,
    bottomOffset: 0,
    useWrapper: false
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  customAnimate: CustomAnimate;

  rootElm: Element = null;
  animated: boolean = false;

  componentDidMount() {
    this.rootElm = findDOMNode(this) as Element;
    this.context.theme.scrollReveals.push(this as any);
  }

  componentDidUpdate() {
    if (!this.context.theme.scrollReveals.includes(this as any)) {
      this.context.theme.scrollReveals.push(this as any);
    }
  }

  componentWillUnmount() {
    const { scrollReveals } = this.context.theme;
    scrollReveals.splice(scrollReveals.indexOf(this as any), 1);
  }

  setEnterStyle = () => {
    this.customAnimate.setEnterStyle();
  }

  setLeaveStyle = () => {
    this.customAnimate.setLeaveStyle();
  }

  render() {
    const {
      style,
      leaveStyle,
      enterStyle,
      speed,
      transitionTimingFunction,
      useWrapper,
      wrapperStyle,
      children
    } = this.props;
    const { theme } = this.context;

    return (
      <CustomAnimate
        ref={customAnimate => this.customAnimate = customAnimate}
        speed={speed}
        transitionTimingFunction={transitionTimingFunction}
        style={style}
        leaveStyle={leaveStyle}
        enterStyle={enterStyle}
        appearAnimate={false}
        useWrapper={useWrapper}
        wrapperStyle={wrapperStyle}
      >
        {children}
      </CustomAnimate>
    );
  }
}

export default ScrollReveal;

export {
  fadeInProps,
  scaleInProps,
  slideTopInProps,
  slideBottomInProps,
  slideLeftInProps,
  slideRightInProps
} from "../Animate/CustomAnimate";
