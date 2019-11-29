import * as React from "react";
import { Theme } from "../styles/getTheme";
import { drawElement2Ctx, DrawType, drawRectAtRange, createRadialGradient, inRectInside } from "./helper"; import * as tinyColor from "tinycolor2";
import { updateCanvasRect } from "./index";
import { Throttle } from "../utils/Throttle";

export interface DataProps {
  theme: Theme;
}

export interface OverlapRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface GlobalRevealStoreProps extends DataProps {}

export class GlobalRevealStore extends React.Component<GlobalRevealStoreProps> {
  currPosition: {
    clientX?: number;
    clientY?: number;
  } = {};
  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners() {
    document.addEventListener("scroll", this.drawEffects, true);
    window.addEventListener("mousemove", this.drawEffects, true);
    window.addEventListener("mouseenter", this.drawEffects, true);
    document.addEventListener("click", this.drawEffects, true);
  }

  removeListeners() {
    document.removeEventListener("scroll", this.drawEffects, true);
    window.removeEventListener("mousemove", this.drawEffects, true);
    window.removeEventListener("mouseenter", this.drawEffects, true);
    document.removeEventListener("click", this.drawEffects, true);
  }

  getBorderMaskGradient(ctx: CanvasRenderingContext2D, borderColor: string) {
    const { theme } = this.props;
    let gradient = theme.hoverGradientMap.get(borderColor);
    if (!gradient) {
      gradient = createRadialGradient(ctx, borderColor).gradient;
      theme.hoverGradientMap.set(borderColor, gradient);
    }
    return gradient;
  }

  checkOverlap(rect1: OverlapRect, rect2: OverlapRect) {
    return Math.max(rect1.left, rect2.left) < Math.min(rect1.right, rect2.right) && Math.max(rect1.top, rect2.top) < Math.min(rect1.bottom, rect2.bottom);
  }

  drawBorderThrottle = new Throttle();
  drawEffects = (e: MouseEvent) => {
    if (!this.drawBorderThrottle.shouldFunctionRun()) return;

    const { theme } = this.props;
    const { revealEffectMap } = theme;
    if (revealEffectMap.size === 0) return;

    const isScrollEvent = e.type === "scroll";
    const { clientX, clientY } = isScrollEvent ? this.currPosition : e;
    if (!(clientX && clientY)) return;

    if (!isScrollEvent) {
      this.currPosition = { clientX, clientY };
    }

    // Add hover size.
    let { hoverSize } = theme.revealConfig;
    if (theme.currHoverSize !== void 0) hoverSize = theme.currHoverSize;
    const halfHoverSize = hoverSize / 2;
    const effectRect = {
      left: clientX - halfHoverSize,
      top: clientY - halfHoverSize,
      right: clientX + hoverSize,
      bottom: clientY + hoverSize
    };
    let hoverCanvasList: HTMLCanvasElement[] = [];

    let hadSelfRangBorder = false;
    let prevDeepCanvas: HTMLCanvasElement = null;
    // draw border effect.
    for (const [borderCanvas, revealConfig] of revealEffectMap) {
      if (!borderCanvas) return;
      // updateCanvasRect.
      const rootEl = borderCanvas.parentElement;
      const rootRect = rootEl.getBoundingClientRect();

      const isOverlap = this.checkOverlap(effectRect, rootRect);
      const isInside = inRectInside({ left: clientX, top: clientY }, borderCanvas.getBoundingClientRect());
      const borderCtx = borderCanvas.getContext("2d");
      borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);

      if (isOverlap || isInside) {
        updateCanvasRect(borderCanvas);
        const { borderColor, borderWidth, effectEnable, effectRange } = revealConfig;
        const disabledBorder = effectEnable === "hover" || effectEnable === "disabled";
        const disabledHover = effectEnable === "border" || effectEnable === "disabled";
        const isSelfRange = effectRange === "self";

        const drawBorderEffect = () => {
          // draw border effect.
          if (disabledBorder) return;
          borderCtx.globalCompositeOperation = "source-over";
          const gradient = this.getBorderMaskGradient(borderCtx, tinyColor(borderColor).toHslString());
          drawRectAtRange(borderCtx, {
            x: clientX - rootRect.left,
            y: clientY - rootRect.top,
            scale: 1,
            size: hoverSize * 2
          }, gradient);

          borderCtx.globalCompositeOperation = "destination-in";
          borderCtx.lineWidth = borderWidth;
          borderCtx.fillStyle = "#fff";
          borderCtx.strokeStyle = "#fff";
          drawElement2Ctx(borderCtx, borderCanvas.parentElement, DrawType.Stroke, false);
        };

        if (isSelfRange) hadSelfRangBorder = true;
        if (hadSelfRangBorder) {
          if (isSelfRange && isInside) {
            if (!prevDeepCanvas) {
              prevDeepCanvas = borderCanvas;
              drawBorderEffect();
            } else {
              const isAfter = borderCanvas.compareDocumentPosition(prevDeepCanvas) & Node.DOCUMENT_POSITION_FOLLOWING;
              if (!isAfter) {
                const ctx = prevDeepCanvas.getContext("2d");
                ctx.clearRect(0, 0, prevDeepCanvas.width, prevDeepCanvas.height);
                prevDeepCanvas = borderCanvas;
                drawBorderEffect();
              }
            }
          }
        } else {
          drawBorderEffect();
        }

        // add to hoverRootEls.
        if (isInside && !disabledHover) {
          hoverCanvasList.push(borderCanvas);
        }
      }
      const hoverCanvas = borderCanvas.previousElementSibling as HTMLCanvasElement;
      const hoverCtx = hoverCanvas.getContext("2d");
      hoverCtx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
    }

    // draw hover effect.
    if (!isScrollEvent) return;
    // deeper dom, common like A.children -> A.
    hoverCanvasList = hoverCanvasList.sort((a, b) => a.parentElement.compareDocumentPosition(b.parentElement) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    const borderCanvasEl = hoverCanvasList[0];
    if (!borderCanvasEl) return;
    updateCanvasRect(borderCanvasEl);
    const revealConfig = revealEffectMap.get(borderCanvasEl);
    theme.currHoverSize = revealConfig.hoverSize;
    const hoverCanvasEl = borderCanvasEl.previousElementSibling as HTMLCanvasElement;
    const hoverCtx = hoverCanvasEl.getContext("2d");
    hoverCtx.clearRect(0, 0, hoverCanvasEl.width, hoverCanvasEl.height);

    const hslaStr = tinyColor(revealConfig.hoverColor).toHslString();
    let hoverGradient = theme.hoverGradientMap.get(hslaStr);
    if (!hoverGradient) {
      const { gradient } = createRadialGradient(hoverCtx, revealConfig.hoverColor);
      hoverGradient = gradient;
      theme.hoverGradientMap.set(hslaStr, gradient);
    }
    const hoverRect = hoverCanvasEl.getBoundingClientRect();

    drawRectAtRange(hoverCtx, {
      x: clientX - hoverRect.x,
      y: clientY - hoverRect.y,
      scale: 1,
      size: revealConfig.hoverSize * 2
    }, hoverGradient);
  }

  grawBorder(borderCtx: CanvasRenderingContext2D) {
    
  }

  render() {
    return null;
  }
}

export default GlobalRevealStore;
