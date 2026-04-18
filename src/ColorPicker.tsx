import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useEffect } from 'react';
import IS_NODE_ENV from './utils/nodeJS/IS_NODE_ENV';
import Slider from './Slider';
import * as tinycolor from 'tinycolor2';

export interface DataProps {
  defaultColor?: string;
  size?: number;
  onChangeColor?: (color?: string) => void;
  onChangedColor?: (color?: string) => void;
  onChangedColorTimeout?: number;
}
export interface ColorPickerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const ColorPicker: React.FC<ColorPickerProps> = ({
  size = 336,
  defaultColor = "hsv(210, 100%, 100%)",
  onChangeColor,
  onChangedColor,
  onChangedColorTimeout = 1000 / 24,
  style,
  className,
  ...attributes
}) => {
  const theme = useTheme();
  const [hsv, setHsv] = useState<{ h: number; s: number; v: number }>(tinycolor(defaultColor).toHsv());
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const moveColorTimer = useRef<NodeJS.Timeout | null>(null);
  const colorBarTimer = useRef<NodeJS.Timeout | null>(null);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const originBodyStyle = useRef(IS_NODE_ENV ? undefined : { ...document.body.style });
  const colorSelectorElm = useRef<HTMLDivElement>(null);
  const colorMainBarElm = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<Slider>(null);

  // 渲染Canvas
  const renderCanvas = () => {
    if (!canvasRef.current) return;
    const canvasSize = size * 0.8125;
    const canvas = canvasRef.current;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const _xPosition = canvasSize / 2;
    const _yPosition = _xPosition;
    const _r = _xPosition;
    const _pi_2 = Math.PI * 2;

    ctxRef.current = canvas.getContext("2d");
    const ctx = ctxRef.current;
    if (!ctx) return;

    // 适配设备像素比
    const setCanvas2devicePixelRatio = () => {
      const { devicePixelRatio } = window;
      if (!devicePixelRatio) return;
      const { width, height } = canvas;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    setCanvas2devicePixelRatio();

    ctx.save();
    ctx.arc(_xPosition, _yPosition, _r, 0, _pi_2, true);
    ctx.clip();

    const { v, s } = hsv;
    for (let i = -1; i < 360; i++) {
      ctx.beginPath();
      ctx.moveTo(_xPosition, _yPosition);
      if (i === -1) {
        ctx.arc(_xPosition, _yPosition, _r, -_pi_2 / 360, 0, true);
      } else {
        ctx.arc(_xPosition, _yPosition, _r, 0, _pi_2 * i / 360, true);
      }
      ctx.closePath();
      const radialGradient = ctx.createRadialGradient(_xPosition, _yPosition, 0, _xPosition, _yPosition, _r);
      radialGradient.addColorStop(0, tinycolor(`hsv(${Math.abs(i)}, 0%, ${v * 100}%)`).toHexString());
      radialGradient.addColorStop(1, tinycolor(`hsv(${Math.abs(i)}, 100%, ${v * 100}%)`).toHexString());
      ctx.fillStyle = radialGradient;
      ctx.fill();
    }
    ctx.restore();
  };

  // 初始化和更新渲染Canvas
  useEffect(() => {
    renderCanvas();
  }, [hsv.v, hsv.s, size]);

  // 事件绑定和清理
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener("touchstart", handleChooseColor as any, false);
    canvas.addEventListener("touchend", handleEnd as any, false);

    return () => {
      if (moveColorTimer.current) clearTimeout(moveColorTimer.current);
      if (colorBarTimer.current) clearTimeout(colorBarTimer.current);
      if (clickTimer.current) clearTimeout(clickTimer.current);
      canvas.removeEventListener("touchstart", handleChooseColor as any, false);
      canvas.removeEventListener("touchend", handleEnd as any, false);
      document.documentElement.removeEventListener("mousemove", handleTouchMouseMove);
      document.documentElement.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("touchmove", handleTouchMouseMove);
      document.documentElement.removeEventListener("touchend", handleEnd);
    };
  }, []);

  const handleColorBarChange = (v: number) => {
    if (colorBarTimer.current) clearTimeout(colorBarTimer.current);
    const { h, s } = hsv;
    const colorHexString = tinycolor({ h, s, v }).toHexString();
    onChangeColor?.(colorHexString);
    setHsv(prev => ({ ...prev, v }));
    colorBarTimer.current = setTimeout(() => {
      onChangedColor?.(colorHexString);
    }, onChangedColorTimeout);
  };

  const handleChooseColor = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>, isClickEvent = true) => {
    e.preventDefault();
    const isTouchEvent = e.type.includes("touch");
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isClickEvent && (e.type === "mousedown" || e.type === "touchstart")) {
      document.documentElement.addEventListener("mousemove", handleTouchMouseMove, false);
      document.documentElement.addEventListener("mouseup", handleEnd);
      canvas.addEventListener("touchmove", handleTouchMouseMove, false);
      document.documentElement.addEventListener("touchend", handleEnd);
      if (!IS_NODE_ENV) {
        Object.assign(document.body.style, {
          userSelect: "none",
          msUserSelect: "none",
          webkitUserSelect: "none",
          cursor: "default"
        });
      }
    }

    const clientReact = canvas.getBoundingClientRect();
    const colorPickerBoardSize = size * 0.8125 / 2;
    const { clientX, clientY } = isTouchEvent 
      ? (e as React.TouchEvent<HTMLCanvasElement>).changedTouches[0] 
      : (e as React.MouseEvent<HTMLCanvasElement>);
    const x = clientX - clientReact.left - colorPickerBoardSize;
    const y = clientReact.top - clientY + colorPickerBoardSize;
    const r = Math.sqrt(x * x + y * y);
    let h = Math.asin(y / r) / Math.PI * 180;

    if (x > 0 && y > 0) h = 360 - h;
    if (x > 0 && y < 0) h = -h;
    if (x < 0 && y < 0) h = 180 + h;
    if (x < 0 && y > 0) h = 180 + h;
    let s = r / colorPickerBoardSize;
    if (s > 1) s = 1;

    const colorHexString = tinycolor({ h, s, v: hsv.v }).toHexString();
    const halfLightColor = tinycolor({ h, s, v: 1 });
    if (sliderRef.current?.barElm) {
      sliderRef.current.barElm.style.backgroundImage = `linear-gradient(90deg, #000, ${halfLightColor.toHexString()})`;
    }

    if (isClickEvent && e.type === "click") {
      onChangeColor?.(colorHexString);
      setHsv(prev => ({ ...prev, h, s }));
      if (clickTimer.current) clearTimeout(clickTimer.current);
      clickTimer.current = setTimeout(() => {
        onChangedColor?.(colorHexString);
      }, 0);
    } else {
      onChangeColor?.(colorHexString);
      if (moveColorTimer.current) clearTimeout(moveColorTimer.current);
      const rPos = colorPickerBoardSize * s;
      const xPos = Math.cos(h / 180 * Math.PI) * rPos;
      const yPos = Math.sin(h / 180 * Math.PI) * rPos;

      if (colorSelectorElm.current) {
        Object.assign(colorSelectorElm.current.style, theme.prefixStyle({
          transform: `translate3d(${xPos}px, ${yPos}px, 0)`
        }));
      }
      if (colorMainBarElm.current) {
        colorMainBarElm.current.style.background = colorHexString;
      }
      moveColorTimer.current = setTimeout(() => {
        onChangedColor?.(colorHexString);
        setHsv(prev => ({ ...prev, h, s }));
      }, onChangedColorTimeout);
    }
  };

  const handleTouchMouseMove = (e: any) => {
    if (!dragging) setDragging(true);
    handleChooseColor(e, false);
  };

  const handleEnd = (e: any) => {
    if (dragging) setDragging(false);
    if (moveColorTimer.current) clearTimeout(moveColorTimer.current);
    if (!IS_NODE_ENV && originBodyStyle.current) {
      Object.assign(document.body.style, {
        userSelect: undefined,
        msUserSelect: undefined,
        webkitUserSelect: undefined,
        cursor: undefined,
        ...originBodyStyle.current
      });
    }
    document.documentElement.removeEventListener("mousemove", handleTouchMouseMove);
    if (canvasRef.current) {
      canvasRef.current.removeEventListener("touchmove", handleTouchMouseMove);
    }
    document.documentElement.removeEventListener("mouseup", handleEnd);
    document.documentElement.removeEventListener("touchend", handleEnd);
  };

  // 计算样式
  const halfLightColor = tinycolor({ h: hsv.h, s: hsv.s, v: 1 });
  const colorPickerBoardSize = size * 0.8125 / 2;
  const mainBoardDotSize = size / 25;
  const r = colorPickerBoardSize * hsv.s;
  const x = Math.cos(hsv.h / 180 * Math.PI) * r;
  const y = Math.sin(hsv.h / 180 * Math.PI) * r;
  const selectorSize = colorPickerBoardSize - mainBoardDotSize / 2;
  const styles = getStyles(theme, { size, hsv, style });

  // 选择器样式
  const selectorStyle = {
    ...styles.colorSelector,
    top: selectorSize,
    left: selectorSize,
    width: mainBoardDotSize,
    height: mainBoardDotSize,
    borderRadius: mainBoardDotSize,
    background: "none",
    boxShadow: `0 0 0 4px #fff`,
    transform: `translate3d(${x}px, ${y}px, 0)`
  };

  const classes = theme.prepareStyles({ className: "color-picker", styles });

  return (
    <div 
      {...attributes} 
      style={classes.root.style} 
      className={theme.classNames(classes.root.className, className)}
    >
      <div {...classes.board}>
        <div style={{ position: "relative" }}>
          <canvas
            {...classes.mainBoard}
            ref={canvasRef}
            onClick={handleChooseColor}
            onMouseDown={handleChooseColor}
            onMouseUp={handleEnd}
          >
            Your Browser not support canvas.
          </canvas>
          <div
            ref={colorSelectorElm}
            className={classes.colorSelector.className}
            style={theme.prefixStyle(selectorStyle)}
          />
        </div>
        <div
          {...classes.colorMainBar}
          ref={colorMainBarElm}
        />
      </div>
      <Slider
        maxValue={1}
        ref={sliderRef}
        onChangeValue={handleColorBarChange}
        style={{ marginTop: size * 0.0125, width: "100%" }}
        initValue={hsv.v}
        width={size}
        barHeight={size * 0.025}
        barBackgroundImage={`linear-gradient(90deg, #000, ${halfLightColor.toHexString()})`}
        useSimpleController
      />
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  size: number;
  hsv: { h: number; s: number; v: number };
  style?: React.CSSProperties;
}) => {
  const { size, hsv, style } = props;
  const { prefixStyle } = theme;
  const currColor = tinycolor(hsv).toHslString();

  return {
    root: prefixStyle({
      display: "inline-block",
      verticalAlign: "middle",
      width: size,
      flexDirection: "column",
      ...style
    }),
    board: prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    mainBoard: prefixStyle({
      userDrag: "none",
      margin: 0,
      userSelect: "none"
    } as any),
    colorMainBar: {
      height: size * 0.8125,
      marginLeft: size * 0.025,
      width: size * 0.125,
      background: currColor
    },
    colorSelector: prefixStyle({
      pointerEvents: "none",
      userDrag: "none",
      position: "absolute"
    } as any)
  };
};


export default ColorPicker;
