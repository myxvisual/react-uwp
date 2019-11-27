import * as React from "react";
import { Theme } from "../styles/getTheme";
import { drawElement2Ctx, DrawType, drawRectAtRange, createRadialGradient, frameMS, getNow } from "./helper";

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
  borderMaskGradient: CanvasGradient;
  borderPrevDrawTime = getNow();

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

  getBorderMaskGradient(ctx: CanvasRenderingContext2D) {
    if (!this.borderMaskGradient) {
      const { gradient } = createRadialGradient(ctx, "#fff");
      this.borderMaskGradient = gradient;
    }
    return this.borderMaskGradient;
  }

  checkOverlap(rect1: OverlapRect, rect2: OverlapRect) {
    return Math.max(rect1.left, rect2.left) < Math.min(rect1.right, rect2.right) && Math.max(rect1.top, rect2.top) < Math.min(rect1.bottom, rect2.bottom);
  }

  drawBorders = (e: MouseEvent) => {
    const now = getNow();
    if (now - this.borderPrevDrawTime < frameMS) {
      return;
    }
    this.borderPrevDrawTime = now;
    const { reveaEffectMap } = this.props.theme;
    if (reveaEffectMap.size === 0) return;

    const { theme } = this.props;
    const { clientX, clientY } = e;
    const hoverEl = e.target as HTMLElement;
    const borderCanvasEls: HTMLCanvasElement[] = [];

    // Add hover size.
    let { hoverSize } = theme.revealConfig;
    for (const [borderCanvas, revealConfig] of reveaEffectMap) {
      if (!borderCanvas) return;
      const rootEl = borderCanvas.parentElement;
      const isOnRoot = rootEl.contains(hoverEl);
      if (isOnRoot) {
        hoverSize = revealConfig.hoverSize;
        break;
      }
    }

    const effectRect = {
      left: clientX - hoverSize,
      top: clientY - hoverSize,
      right: clientX + 2 * hoverSize,
      bottom: clientY + 2 * hoverSize
    };

    for (const [borderCanvas, revealConfig] of reveaEffectMap) {
      if (!borderCanvas) return;
      const rootEl = borderCanvas.parentElement;
      const rootRect = rootEl.getBoundingClientRect();
      const isOverlap = this.checkOverlap(effectRect, rootRect);
      const borderCtx = borderCanvas.getContext("2d");
      borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);

      if (isOverlap) {
        borderCanvasEls.push(borderCanvas);
        const { borderColor, borderWidth, effectEnable } = revealConfig;
        if (effectEnable === "hover") return;

        borderCtx.globalCompositeOperation = "source-over";
        const gradient = this.getBorderMaskGradient(borderCtx);
        drawRectAtRange(borderCtx, {
          x: clientX - rootRect.left,
          y: clientY - rootRect.top,
          scale: 1,
          size: hoverSize * 2
        }, gradient);

        borderCtx.globalCompositeOperation = "destination-in";
        borderCtx.lineWidth = borderWidth;
        borderCtx.fillStyle = borderColor;
        borderCtx.strokeStyle = borderColor;
        drawElement2Ctx(borderCtx, borderCanvas.parentElement, DrawType.Stroke, false);
      }
    }
  }

  render() {
    return null;
  }
}

export default GlobalRevealStore;
