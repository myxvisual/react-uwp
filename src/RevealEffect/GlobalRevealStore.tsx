import * as React from "react";
import { Theme } from "../styles/getTheme";
import { createRadialGradient, inRectInside, drawBorder, drawHover, updateCanvasRect } from "./helper";
import * as tinyColor from "tinycolor2";
import { Theme as ThemeType } from "react-uwp/styles/getTheme";
import { Throttle } from "../utils/Throttle";
import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer";
const ResizeObserver: typeof ResizeObserverPolyfill = window["ResizeObserver"] || ResizeObserverPolyfill;

// TODO: CSS border gradient.
const borderStyle = {
  borderImage: `radial-gradient(circle 120px at 50% 50%, red 0%, transparent 100%)`,
  borderImageSlice: 1,
  borderTop: `100px solid`
};

export interface DataProps {
  theme: Theme;
}

export interface OverlapRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

function getGradient(ctx: CanvasRenderingContext2D, borderColor: string, theme: ThemeType) {
  const hslStr = tinyColor(borderColor).toHslString();
  let gradient = theme.revealGradientMap.get(hslStr);
  if (!gradient) {
    gradient = createRadialGradient(ctx, borderColor).gradient;
    theme.revealGradientMap.set(borderColor, gradient);
  }
  return gradient;
}

function isRectangleOverlap(rect1: OverlapRect, rect2: OverlapRect) {
  return Math.max(rect1.left, rect2.left) < Math.min(rect1.right, rect2.right) && Math.max(rect1.top, rect2.top) < Math.min(rect1.bottom, rect2.bottom);
}

export interface GlobalRevealStoreProps extends DataProps {}

export class GlobalRevealStore extends React.Component<GlobalRevealStoreProps> {
  currPosition = {
    clientX: 0,
    clientY: 0
  };

  hoverBorderCanvas: HTMLCanvasElement;
  resizeObserver = new ResizeObserver((entries, observer) => {
    const { theme: { revealEffectMap } } = this.props;
    let isResize = false;
    for (const entry of entries) {
      if (isResize) break;
      if (entry.target) {
        for (const [borderCanvas] of revealEffectMap) {
          if (borderCanvas.parentElement === entry.target) {
            this.handleDrawGlobalEffect(this.currPosition as MouseEvent);
            isResize = true;
            break;
          }
        }
      }
    }
  });

  componentDidMount() {
    this.initAll();
    const { theme: { revealEffectMap } } = this.props;
    for (const [borderCanvas, revealConfig] of revealEffectMap) {
      if (revealConfig.observerResize) this.resizeObserver.observe(borderCanvas.parentElement);
    }
  }

  componentWillUnmount() {
    this.unInitAll();
  }

  initAll() {
    this.addGlobalListeners();
  }

  unInitAll() {
    this.removeGlobalListeners();
  }

  updatePosition(e: any) {
    if (!e) return this.currPosition;
    const { clientX, clientY } = e;
    if (clientX !== void 0 && clientY !== void 0) {
      this.currPosition = { clientX, clientY };
    }
    return this.currPosition;
  }

  drawByBorderCanvas = (borderCanvas: HTMLCanvasElement, isHoverEl = false) => {
    const { theme, theme: { revealEffectMap } } = this.props;
    const { clientX, clientY } = this.currPosition;
    const { hoverColor, hoverSize, borderColor, borderWidth, effectEnable } = revealEffectMap.get(borderCanvas);
    const parentEl = borderCanvas.parentElement;
    const parentRect = parentEl.getBoundingClientRect() as DOMRect;
    const hoverCanvas = borderCanvas.previousElementSibling as HTMLCanvasElement;
    const borderCtx = borderCanvas.getContext("2d");
    const hoverCtx = hoverCanvas.getContext("2d");
    const [x, y] = [clientX - parentRect.left, clientY - parentRect.top];
    const enableDrawBorder = effectEnable === "border" || effectEnable === "both";
    const enableDrawHover = effectEnable === "hover" || effectEnable === "both";

    if (enableDrawBorder) {
      borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
      const borderGradient = getGradient(borderCtx, borderColor, theme);
      drawBorder({
        borderCanvas,
        hoverSize,
        borderWidth,
        gradient: borderGradient,
        x,
        y
      });
    }

    if (isHoverEl && enableDrawHover) {
      hoverCtx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
      const hoverGradient = getGradient(hoverCtx, hoverColor, theme);
      drawHover({
        hoverCanvas,
        hoverSize,
        gradient: hoverGradient,
        x,
        y
      });
    }
  }

  globalDrawThrottle = new Throttle();
  handleDrawGlobalEffect = (event: Event) => {
    this.globalDrawThrottle.runOnceByThrottle(() => {
      this.drawGlobalEffects(event);
    });
  }
  drawGlobalEffects = (event: Event) => {
    const { clientX, clientY } = this.updatePosition(event);
    const { theme, theme: { revealEffectMap } } = this.props;
    if (revealEffectMap.size === 0) return;

    // Add hover size.
    let effectRect: { left: number; top: number; right: number; bottom: number };
    const setEffectRect = (hoverSize: number) => {
      const halfHoverSize = hoverSize / 2;
      effectRect = {
        left: clientX - halfHoverSize,
        top: clientY - halfHoverSize,
        right: clientX + halfHoverSize,
        bottom: clientY + halfHoverSize
      };
    };
    let { hoverSize } = theme.revealConfig;
    setEffectRect(hoverSize);

    if (this.hoverBorderCanvas) {
      const hoverCanvas = this.hoverBorderCanvas.previousElementSibling as HTMLCanvasElement;
      if (hoverCanvas) {
        const hoverCtx = hoverCanvas.getContext("2d");
        hoverCtx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
      }
    }

    let focusElements: Element[] = [];
    const hadFromPointEl = "elementsFromPoint" in document;
    if (hadFromPointEl) {
      focusElements = document.elementsFromPoint(this.currPosition.clientX, this.currPosition.clientY);
    }
    let foundFocusEl = false;
    for (const focusElement of focusElements) {
      if (foundFocusEl) break;
      for (const [borderCanvas, revealConfig] of revealEffectMap) {
        if (borderCanvas.parentElement === focusElement && revealConfig.effectEnable !== "disabled") {
          this.hoverBorderCanvas = borderCanvas;
          setEffectRect(revealConfig.hoverSize);
          foundFocusEl = true;
          break;
        }
      }
    }

    if (!hadFromPointEl) {
      for (const [borderCanvas, revealConfig] of revealEffectMap) {
        const parentEl = borderCanvas.parentElement;
        const parentRect = parentEl.getBoundingClientRect() as DOMRect;
        const isInside = inRectInside({ left: clientX, top: clientY }, parentRect);
        if (isInside) {
          this.hoverBorderCanvas = borderCanvas.contains(this.hoverBorderCanvas) ? this.hoverBorderCanvas : borderCanvas;
          setEffectRect(revealConfig.hoverSize);
          foundFocusEl = true;
          break;
        }
      }
    }

    // find all border effect.
    let drawBorderCanvasList: HTMLCanvasElement[] = [];
    for (const [borderCanvas, revealConfig] of revealEffectMap) {
      const borderCtx = borderCanvas.getContext("2d");
      const parentEl = borderCanvas.parentElement;
      const parentRect = parentEl.getBoundingClientRect();
      const { effectEnable, effectRange } = revealConfig;

      const isSelfRange = effectRange === "self";
      const isOthersRange = effectRange === "others";
      const isOverlap = isRectangleOverlap(effectRect, parentRect);

      borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);

      if (isOverlap) {
        updateCanvasRect(borderCanvas);
        const enableDrawBorder = effectEnable === "border" || effectEnable === "both";
        if (enableDrawBorder && !isSelfRange && !isOthersRange && this.showRenderCanvas(borderCanvas)) {
          drawBorderCanvasList.push(borderCanvas);
        }
      }
    }

    // draw all borders.
    if (foundFocusEl) {
      const revealConfig = revealEffectMap.get(this.hoverBorderCanvas);
      if (revealConfig.effectRange === "self") {
        drawBorderCanvasList = [];
      }
    }
    for (const borderCanvas of drawBorderCanvasList) {
      this.drawByBorderCanvas(borderCanvas);
    }

    // draw hoverEl.
    if (foundFocusEl && this.showRenderCanvas(this.hoverBorderCanvas)) {
      this.drawByBorderCanvas(this.hoverBorderCanvas, true);
    }
  }

  showRenderCanvas(canvasEl: HTMLCanvasElement) {
    const { parentElement } = canvasEl;
    if (parentElement) {
      const { pointerEvents, visibility, display, opacity } = window.getComputedStyle(parentElement);
      return pointerEvents !== "none" && visibility !== "hidden" && display !== "none" && opacity !== "0";
    } else {
      return false;
    }
  }

  cleanGlobalEffects = (e: Event) => {
    this.updatePosition(e);
    const { theme: { revealEffectMap } } = this.props;
    for (const [borderCanvas] of revealEffectMap) {
      const borderCtx = borderCanvas.getContext("2d");
      borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
    }
  }

  addGlobalListeners() {
    window.addEventListener("click", this.handleDrawGlobalEffect, true);
    window.addEventListener("mouseenter", this.handleDrawGlobalEffect, true);
    window.addEventListener("mouseover", this.handleDrawGlobalEffect, true);
    window.addEventListener("mousemove", this.handleDrawGlobalEffect, true);
    window.addEventListener("touchstart", this.handleDrawGlobalEffect, true);
    window.addEventListener("touchmove", this.handleDrawGlobalEffect, true);

    window.addEventListener("mouseout", this.cleanGlobalEffects, true);
    window.addEventListener("mouseleave", this.cleanGlobalEffects, true);
    window.addEventListener("touchend", this.cleanGlobalEffects, true);

    document.body.addEventListener("transitionstart", this.handleTransitionRun, false);
    document.body.addEventListener("transitionrun", this.handleTransitionRun, false);
    document.body.addEventListener("transitionend", this.handleTransitionEnd, false);
  }

  removeGlobalListeners() {
    window.removeEventListener("click", this.handleDrawGlobalEffect, true);
    window.removeEventListener("mouseenter", this.handleDrawGlobalEffect, true);
    window.removeEventListener("mouseover", this.handleDrawGlobalEffect, true);
    window.removeEventListener("mousemove", this.handleDrawGlobalEffect, true);
    window.removeEventListener("touchstart", this.handleDrawGlobalEffect, true);
    window.removeEventListener("touchmove", this.handleDrawGlobalEffect, true);

    window.removeEventListener("mouseout", this.cleanGlobalEffects, true);
    window.removeEventListener("mouseleave", this.cleanGlobalEffects, true);
    window.removeEventListener("touchend", this.cleanGlobalEffects, true);

    document.body.removeEventListener("transitionstart", this.handleTransitionRun, false);
    document.body.removeEventListener("transitionrun", this.handleTransitionRun, false);
    document.body.removeEventListener("transitionend", this.handleTransitionEnd, false);
  }

  reflowPropertyNames = ["transform", "left", "width", "top", "right", "width", "height"];
  transitionRunThrottle = new Throttle({
    runFunc: () => {
      this.handleDrawGlobalEffect(this.currPosition as MouseEvent);
    }
  });
  handleTransitionRun = (e: TransitionEvent) => {
    const { propertyName } = e;
    const { revealEffectMap } = this.props.theme;
    const transitionEl = e.target as HTMLElement;
    if (this.reflowPropertyNames.includes(propertyName)) {
      for (const [borderCanvas, revealConfig] of revealEffectMap) {
        if (transitionEl.contains(borderCanvas) && revealConfig.observerTransition === propertyName) {
          this.transitionRunThrottle.startRunFunc();
          break;
        }
      }
    }
  }

  handleTransitionEnd = (e: TransitionEvent) => {
    const { propertyName } = e;
    const { revealEffectMap } = this.props.theme;
    const transitionEl = e.target as HTMLElement;
    if (this.reflowPropertyNames.includes(propertyName)) {
      for (const [borderCanvas, revealConfig] of revealEffectMap) {
        if (transitionEl.contains(borderCanvas) && revealConfig.observerTransition === propertyName) {
          this.transitionRunThrottle.endRunFunc();
          this.handleDrawGlobalEffect(this.currPosition as MouseEvent);
        }
      }
    }
  }

  render() {
    const { theme } = this.props;
    theme.onAddBorderCanvas = (borderCanvas, revealConfig) => {
      if (revealConfig.observerResize) this.resizeObserver.observe(borderCanvas.parentElement);
    };
    return null;
  }
}

export default GlobalRevealStore;
