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
   * Set custom default style.
   */
  style?: React.CSSProperties;
  /**
   * Set custom animated style.
   */
  animatedStyle?: React.CSSProperties;
  /**
   * Set custom transitionTimingFunction.
   */
  transitionTimingFunction?: string;
  /**
   * Set custom children.
   */
  children?: React.ReactElement<any>;
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

export interface ScrollRevealProps extends DataProps {}

export class ScrollReveal extends React.Component<ScrollRevealProps, void> {
  static defaultProps: ScrollRevealProps = {
    style: { transform: "scale(0)" },
    animatedStyle: { transform: "scale(1)" },
    speed: 250,
    transitionTimingFunction: "ease-in-out",
    topOffset: window.innerHeight / 16,
    bottomOffset: window.innerHeight / 16,
    useWrapper: false
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  customAnimate: CustomAnimate;

  rootElm: HTMLElement = null;
  animated: boolean = false;

  componentWillMount() {
    if (!window.__REACT_UWP__) {
      window.__REACT_UWP__ = {};
    }
    if (!window.__REACT_UWP__.scrollReveals) {
      window.__REACT_UWP__.scrollReveals = [];
    }
  }

  componentDidMount() {
    this.rootElm = findDOMNode(this) as HTMLElement;
    window.__REACT_UWP__.scrollReveals.push(this);
  }

  componentWillUnmount() {
    window.__REACT_UWP__.scrollReveals.splice(window.__REACT_UWP__.scrollReveals.indexOf(this), 1);
  }

  animate = () => {
    this.customAnimate.animate();
  }

  initializeAnimation = () => {
    this.customAnimate.initializeAnimation();
  }

  render() {
    const {
      style,
      animatedStyle,
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
        animatedStyle={animatedStyle}
        appearAnimate={false}
        useSingleChild={!useWrapper}
        wrapperStyle={wrapperStyle}
      >
        {children}
      </CustomAnimate>
    );
  }
}

export default ScrollReveal;
