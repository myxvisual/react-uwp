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
    document.addEventListener("scroll", this.drawBorders, true);
    window.addEventListener("mousemove", this.drawBorders, true);
    window.addEventListener("mouseenter", this.drawBorders, true);
    document.addEventListener("click", this.drawBorders, true);
  }

  removeListeners() {
    document.removeEventListener("scroll", this.drawBorders, true);
    window.removeEventListener("mousemove", this.drawBorders, true);
    window.removeEventListener("mouseenter", this.drawBorders, true);
    document.removeEventListener("click", this.drawBorders, true);
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
  drawBorders = (e: MouseEvent) => {
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
    const effectRect = {
      left: clientX - hoverSize,
      top: clientY - hoverSize,
      right: clientX + 2 * hoverSize,
      bottom: clientY + 2 * hoverSize
    };
    let hoverCanvasList: HTMLCanvasElement[] = [];

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
        const { borderColor, borderWidth, effectEnable } = revealConfig;
        const disabledBorder = effectEnable === "hover" || effectEnable === "disabled";
        const disabledHover = effectEnable === "border" || effectEnable === "disabled";

        if (!disabledBorder || isInside) {
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
    hoverCanvasList = hoverCanvasList.sort((a, b) => a.parentElement.compareDocumentPosition(b.parentElement) & 2 ? -1 : 1);
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

  render() {
    return null;
  }
}

export default GlobalRevealStore;
