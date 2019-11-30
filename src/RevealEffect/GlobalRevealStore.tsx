import * as React from "react";
import { Theme } from "../styles/getTheme";
import { drawElement2Ctx, DrawType, drawRectAtRange, createRadialGradient, inRectInside, drawBorder, drawHover } from "./helper"; import * as tinyColor from "tinycolor2";
import { Theme as ThemeType } from "react-uwp/styles/getTheme";
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


let currPosition: {
  clientX?: number;
  clientY?: number;
} = {};

function getBorderMaskGradient(ctx: CanvasRenderingContext2D, borderColor: string, theme: ThemeType) {
  let gradient = theme.reveaGradientMap.get(borderColor);
  if (!gradient) {
    gradient = createRadialGradient(ctx, borderColor).gradient;
    theme.reveaGradientMap.set(borderColor, gradient);
  }
  return gradient;
}

function checkOverlap(rect1: OverlapRect, rect2: OverlapRect) {
  return Math.max(rect1.left, rect2.left) < Math.min(rect1.right, rect2.right) && Math.max(rect1.top, rect2.top) < Math.min(rect1.bottom, rect2.bottom);
}

const drawBorderThrottle = new Throttle();

export function drawGlobalEffects(e: MouseEvent, theme: ThemeType) {
  if (!drawBorderThrottle.shouldFunctionRun()) return;
  const { revealEffectMap } = theme;


  // break by self effect.
  // let isSelfBorder = false;
  // const hadSelfRange = theme.selfRangeRevealEffectMap.size > 0;
  // if (hadSelfRange) {
  //   for (const [borderCanvas, revealConfig] of revealEffectMap) {
  //     if (borderCanvas.parentElement.contains(e.target as HTMLElement)) {
  //       isSelfBorder = true;
  //     }
  //   }
  // }
  // if (isSelfBorder) return;
  
  if (revealEffectMap.size === 0) return;
  // read all revealEffectMap.
  const isScrollEvent = e.type === "scroll";
  const { clientX, clientY } = isScrollEvent ? currPosition : e;
  if (!(clientX && clientY)) return;

  if (!isScrollEvent) {
    currPosition = { clientX, clientY };
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

  // draw border effect.
  for (const [borderCanvas, revealConfig] of revealEffectMap) {
    if (!borderCanvas) return;
    const borderCtx = borderCanvas.getContext("2d");
    const rootEl = borderCanvas.parentElement;
    const rootRect = rootEl.getBoundingClientRect();
    const { borderColor, borderWidth, effectEnable, effectRange } = revealConfig;
    const disabledBorder = effectEnable === "hover" || effectEnable === "disabled";
    const disabledHover = effectEnable === "border" || effectEnable === "disabled";
    const [x, y] = [clientX - rootRect.left, clientY - rootRect.top];
    borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);

    // draw border effect func.
    const drawBorderEffect = () => {
      if (disabledBorder) return;
      const gradient = getBorderMaskGradient(borderCtx, tinyColor(borderColor).toHslString(), theme);
      drawBorder({
        borderCanvas,
        hoverSize,
        borderWidth,
        gradient,
        x,
        y
      });
    };

    const isOverlap = checkOverlap(effectRect, rootRect);
    const isInside = inRectInside({ left: clientX, top: clientY }, borderCanvas.getBoundingClientRect());
    borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);

    if ((isOverlap || isInside) && !theme.selfRangeRevealEffectMap.get(borderCanvas)) {
    // updateCanvasRect.
      updateCanvasRect(borderCanvas);
      drawBorderEffect();

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
  const hslaStr = tinyColor(revealConfig.hoverColor).toHslString();
  let hoverGradient = theme.reveaGradientMap.get(hslaStr);
  if (!hoverGradient) {
    const { gradient } = createRadialGradient(hoverCtx, revealConfig.hoverColor);
    hoverGradient = gradient;
    theme.reveaGradientMap.set(hslaStr, gradient);
  }
  const hoverRect = hoverCanvasEl.getBoundingClientRect();

  drawHover({
   hoverCanvas: hoverCanvasEl,
    hoverSize: theme.currHoverSize,
    gradient: hoverGradient,
    x: clientX - hoverRect.x,
    y: clientY - hoverRect.y
  });
}

export interface GlobalRevealStoreProps extends DataProps {}

export class GlobalRevealStore extends React.Component<GlobalRevealStoreProps> {
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
    window.addEventListener("mouseleave", this.drawEffects, true);
    document.addEventListener("click", this.drawEffects, true);
  }

  removeListeners() {
    document.removeEventListener("scroll", this.drawEffects, true);
    window.removeEventListener("mousemove", this.drawEffects, true);
    window.removeEventListener("mouseenter", this.drawEffects, true);
    window.removeEventListener("mouseleave", this.drawEffects, true);
    document.removeEventListener("click", this.drawEffects, true);
  }

  drawEffects = (e: MouseEvent) => {
    drawGlobalEffects(e, this.props.theme);
  }

  render() {
    return null;
  }
}

export default GlobalRevealStore;
