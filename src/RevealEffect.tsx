import { useTheme } from './hooks/useTheme';
import React, { useRef, useEffect } from 'react';

export interface DataProps {
  effectEnable?: "hover" | "border" | "both" | "disabled";
  hoverSize?: number;
  hoverColor?: string;
  borderWidth?: number;
  borderColor?: string;
  effectRange?: "self" | "others" | "all";
  observerResize?: boolean;
  observerTransition?: string | string[];
}
export interface RevealEffectProps extends DataProps, React.HTMLAttributes<HTMLCanvasElement> {}

const RevealEffect: React.FC<RevealEffectProps> = ({
  borderWidth,
  hoverSize,
  effectEnable,
  hoverColor,
  borderColor,
  effectRange,
  observerResize,
  observerTransition,
  style,
  ...attributes
}) => {
  const theme = useTheme();
  const hoverCanvasEl = useRef<HTMLCanvasElement>(null);
  const borderCanvasEl = useRef<HTMLCanvasElement>(null);

  // 挂载和更新时更新DOM节点
  useEffect(() => {
    const currRevealConfig = theme.getRevealConfig(theme.revealConfig, {
      borderWidth,
      hoverSize,
      effectEnable,
      hoverColor,
      borderColor,
      effectRange,
      observerResize,
      observerTransition
    });
    theme.addBorderCanvas(borderCanvasEl.current, currRevealConfig);

    // 卸载时清理
    return () => {
      theme.removeBorderCanvas(borderCanvasEl.current);
    };
  }, [
    borderWidth,
    hoverSize,
    effectEnable,
    hoverColor,
    borderColor,
    effectRange,
    observerResize,
    observerTransition,
    theme
  ]);

  const styles = getStyles(theme, { style });
  const classes = theme.prepareStyles({
    styles,
    className: "reveal-effect"
  });

  return (
    <React.Fragment>
      <canvas
        width={0}
        height={0}
        ref={hoverCanvasEl}
        style={classes.root.style}
        className={classes.root.className}
        {...attributes}
      />
      <canvas
        width={0}
        height={0}
        ref={borderCanvasEl}
        style={classes.root.style}
        className={classes.root.className}
        {...attributes}
      />
    </React.Fragment>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
}) => {
  const { style } = props;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      background: "none",
      position: "absolute",
      pointerEvents: "none",
      flex: "0 0 auto",
      display: "none",
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      ...style
    })
  };
};


export default RevealEffect;
