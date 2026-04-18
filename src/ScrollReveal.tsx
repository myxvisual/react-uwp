import { useTheme } from './hooks/useTheme';
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import CustomAnimate, {
  fadeInProps,
  scaleInProps,
  slideTopInProps,
  slideBottomInProps,
  slideLeftInProps,
  slideRightInProps
} from './Animate.CustomAnimate';

export interface DataProps {
  speed?: number;
  leaveStyle?: React.CSSProperties;
  enterStyle?: React.CSSProperties;
  transitionTimingFunction?: string;
  children?: React.ReactElement<any> | React.ReactElement<any>[];
  topOffset?: number;
  bottomOffset?: number;
  useWrapper?: boolean;
  wrapperStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}
export interface ScrollRevealProps extends DataProps {}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  leaveStyle = { transform: "scale(0)" },
  enterStyle = { transform: "scale(1)" },
  speed = 250,
  topOffset = 0,
  bottomOffset = 0,
  useWrapper = false,
  transitionTimingFunction,
  wrapperStyle,
  style,
  children
}) => {
  const theme = useTheme();
  const customAnimate = useRef<CustomAnimate>(null);
  const selfRef = useRef(ScrollReveal);

  // 生命周期：挂载/更新/卸载时处理scrollReveals
  useEffect(() => {
    const rootElm = findDOMNode(selfRef.current) as Element;
    theme.scrollReveals.push(selfRef.current as any);

    return () => {
      const index = theme.scrollReveals.indexOf(selfRef.current as any);
      if (index !== -1) {
        theme.scrollReveals.splice(index, 1);
      }
    };
  }, [theme]);

  // 暴露实例方法
  const setEnterStyle = () => {
    customAnimate.current?.setEnterStyle();
  };
  const setLeaveStyle = () => {
    customAnimate.current?.setLeaveStyle();
  };
  ScrollReveal.setEnterStyle = setEnterStyle;
  ScrollReveal.setLeaveStyle = setLeaveStyle;

  return (
    <CustomAnimate
      ref={customAnimate}
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
};


// 导出动画props
export {
  fadeInProps,
  scaleInProps,
  slideTopInProps,
  slideBottomInProps,
  slideLeftInProps,
  slideRightInProps
};

export default ScrollReveal;
