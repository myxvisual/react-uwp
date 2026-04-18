import { useTheme } from './hooks/useTheme';
import React, { useRef, useEffect, useMemo } from 'react';

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

  // 缓存配置，避免重复计算
  const currRevealConfig = useMemo(() => 
    theme.getRevealConfig(theme.revealConfig, {
      borderWidth,
      hoverSize,
      effectEnable,
      hoverColor,
      borderColor,
      effectRange,
      observerResize,
      observerTransition
    }),
    [borderWidth, hoverSize, effectEnable, hoverColor, borderColor, effectRange, observerResize, observerTransition, theme.revealConfig]
  );

  // 挂载和更新时更新DOM节点
  useEffect(() => {
    const borderEl = borderCanvasEl.current;
    const hoverEl = hoverCanvasEl.current;
    
    theme.addBorderCanvas(borderEl, currRevealConfig);
    if (theme.addHoverCanvas && hoverEl) {
      theme.addHoverCanvas(hoverEl, currRevealConfig);
    }

    // 卸载时完整清理两个canvas，防止内存泄漏
    return () => {
      theme.removeBorderCanvas(borderEl);
      if (theme.removeHoverCanvas && hoverEl) {
        theme.removeHoverCanvas(hoverEl);
      }
    };
  }, [currRevealConfig, theme]);

  // 缓存样式计算结果，避免重复渲染时重复计算
  const classes = useMemo(() => {
    const styles = getStyles(theme, { style });
    return theme.prepareStyles({
      styles,
      className: "reveal-effect"
    });
  }, [theme, style]);

  // 复用canvas公共属性，减少重复代码
  const canvasCommonProps = {
    width: 0,
    height: 0,
    style: classes.root.style,
    className: classes.root.className,
    ...attributes
  };

  return (
    <React.Fragment>
      <canvas ref={hoverCanvasEl} {...canvasCommonProps} />
      <canvas ref={borderCanvasEl} {...canvasCommonProps} />
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
