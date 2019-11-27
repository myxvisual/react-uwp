import * as React from "react";
import { Theme } from "../styles/getTheme";
import { drawElement2Ctx, DrawType, drawRectAtRange } from "../../packages/reveal-effect/src/hepler";

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
  currCursor = {
    clientX: 0,
    clientY: 0
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners() {
    // document.addEventListener("scroll", this.drawBorders, true);
    // window.addEventListener("mousemove", this.drawBorders, true);
    // window.addEventListener("mouseenter", this.drawBorders, true);
    // document.addEventListener("click", this.drawBorders, true);
  }

  removeListeners() {
    // document.removeEventListener("scroll", this.drawBorders, true);
    // window.removeEventListener("mousemove", this.drawBorders, true);
    // window.removeEventListener("mouseenter", this.drawBorders, true);
    // document.removeEventListener("click", this.drawBorders, true);
  }

  checkOverlap(rect1: OverlapRect, rect2: OverlapRect) {
    return Math.max(rect1.left, rect2.left) < Math.min(rect1.right, rect2.right) && Math.max(rect1.top, rect2.top) < Math.min(rect1.bottom, rect2.bottom);
  }

  gradient: CanvasGradient;
  drawBorders = (e: MouseEvent) => {
    const { borderRevealMap } = this.props.theme;
    if (borderRevealMap.size === 0) return;

    const { theme } = this.props;
    const { clientX, clientY } = e;
    this.currCursor = { clientX, clientY };
    const hoverEl = e.target as HTMLElement;
    const borderCanvasEls: HTMLCanvasElement[] = [];

    // Add hover size.
    let hoverSize = 100;
    for (const [borderCanvas, revealConfig] of borderRevealMap) {
      if (!borderCanvas) return;
      const rootEl = borderCanvas.parentElement;
      const isOnRoot = rootEl.contains(hoverEl);
      if (isOnRoot) {
        hoverSize = revealConfig.hoverSize || hoverSize;
        break;
      }
    }

    const effectRect = {
      left: clientX - hoverSize,
      top: clientY - hoverSize,
      right: clientX + 2 * hoverSize,
      bottom: clientY + 2 * hoverSize
    };

    for (const [borderCanvas, revealConfig] of borderRevealMap) {
      if (!borderCanvas) return;
      const rootEl = borderCanvas.parentElement;
      const rootRect = rootEl.getBoundingClientRect();
      const isOverlap = this.checkOverlap(effectRect, rootRect);
      const borderCtx = borderCanvas.getContext("2d");

      borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
      borderCtx.save();
      if (isOverlap) {
        borderCanvasEls.push(borderCanvas);

        borderCtx.globalCompositeOperation = "source-over";
        borderCtx.lineWidth = 2;
        // TODO: Add border color.
        const borderColor = theme.baseMedium;
        borderCtx.fillStyle = borderColor;
        borderCtx.strokeStyle = borderColor;
        drawElement2Ctx(borderCtx, borderCanvas.parentElement, DrawType.Stroke, false);


        borderCtx.globalCompositeOperation = "destination-in";
        if (!this.gradient) {
          this.gradient = borderCtx.createRadialGradient(0, 0, 0, 0, 0, 1);
          this.gradient.addColorStop(0, "#fff");
          this.gradient.addColorStop(.5, "transparent");
        }
        drawRectAtRange(borderCtx, {
          x: clientX - rootRect.left,
          y: clientY - rootRect.top,
          scale: 1,
          size: hoverSize * 2
        }, this.gradient);
      }
      borderCtx.restore();
    }
  }

  render() {
    return null;
  }
}

export default GlobalRevealStore;
