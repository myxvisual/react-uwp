import * as React from "react";
import { Theme } from "../styles/getTheme";
import { createRadialGradient, inRectInside, drawBorder, drawHover, updateCanvasRect } from "./helper";
import * as tinyColor from "tinycolor2";
import { Theme as ThemeType } from "react-uwp/styles/getTheme";
import { Throttle } from "../utils/Throttle";
import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer";
const ResizeObserver: typeof ResizeObserverPolyfill = window["ResizeObserver"] || ResizeObserverPolyfill;

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
  let gradient = theme.revealGradientMap.get(borderColor);
  if (!gradient) {
    gradient = createRadialGradient(ctx, borderColor).gradient;
    theme.revealGradientMap.set(borderColor, gradient);
  }
  return gradient;
}

function checkOverlap(rect1: OverlapRect, rect2: OverlapRect) {
  return Math.max(rect1.left, rect2.left) < Math.min(rect1.right, rect2.right) && Math.max(rect1.top, rect2.top) < Math.min(rect1.bottom, rect2.bottom);
}

export interface GlobalRevealStoreProps extends DataProps {}

export class GlobalRevealStore extends React.Component<GlobalRevealStoreProps> {
  hoverBorderCanvas: HTMLCanvasElement;
  updatePosition(e: any) {
    if (!e) return this.currPosition;
    const { clientX, clientY } = e;
    if (clientX !== void 0 && clientY !== void 0) {
      this.currPosition = { clientX, clientY };
    }
    return this.currPosition;
  }

  currPosition = {
    clientX: 0,
    clientY: 0
  };

  resizeObserverMap: Map<HTMLCanvasElement, ResizeObserverPolyfill> = new Map();

  componentDidMount() {
    this.initAll();
  }

  componentWillUnmount() {
    this.unInitAll();
  }

  initAll() {
    this.addLocalListeners();
    this.addGlobalListeners();
    this.addResizeObserver();
    window.addEventListener("transitionstart", this.handleTransitionRun, true);
    window.addEventListener("transitionrun", this.handleTransitionRun, true);
    window.addEventListener("transitionend", this.handleTransitionEnd, true);
  }

  unInitAll() {
    this.removeLocalListeners();
    this.removeGlobalListeners();
    this.removeResizeObserver();
    window.removeEventListener("transitionstart", this.handleTransitionRun, true);
    window.removeEventListener("transitionrun", this.handleTransitionRun, true);
    window.removeEventListener("transitionend", this.handleTransitionEnd, true);
  }

  localDrawThrottle = new Throttle();
  drawLocalEffect = (event: Event, borderCanvas: HTMLCanvasElement, disabledThrottle = false) => {
    if (!borderCanvas) return;
    const { clientX, clientY } = this.updatePosition(event);
    if (!this.localDrawThrottle.shouldFunctionRun() && !disabledThrottle) return;
    const { theme, theme: { revealEffectMap } } = this.props;
    const parentEl = borderCanvas.parentElement;
    const revealConfig = revealEffectMap.get(borderCanvas);
    if (!revealConfig) return;
    const { hoverSize, borderWidth, borderColor, hoverColor, effectEnable } = revealConfig;
    if (effectEnable !== "disabled") {
      this.hoverBorderCanvas = borderCanvas;
    }
    theme.currHoverSize = hoverSize;

    const borderCtx = borderCanvas.getContext("2d");
    borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
    const parentRect = parentEl.getBoundingClientRect();
    const borderGradient = getGradient(borderCtx, borderColor, theme);
    const [x, y] = [clientX - parentRect.x, clientY - parentRect.y];
    const enableDrawBorder = effectEnable === "border" || effectEnable === "both";
    const enableDrawHover = effectEnable === "hover" || effectEnable === "both";

    if (effectEnable !== "disabled" && "stopPropagation" in event) {
      event.stopPropagation();
    }

    updateCanvasRect(borderCanvas);
    if (enableDrawBorder) {
      drawBorder({
        borderCanvas,
        hoverSize,
        borderWidth,
        gradient: borderGradient,
        x,
        y
      });
    }

    if (enableDrawHover) {
      const hoverCanvas = borderCanvas.previousElementSibling as HTMLCanvasElement;
      const hoverCtx = hoverCanvas.getContext("2d");
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

  cleanLocalEffect = (e: Event, borderCanvas: HTMLCanvasElement) => {
    const hoverCanvas = borderCanvas.previousElementSibling as HTMLCanvasElement;
    if (!hoverCanvas || !hoverCanvas) return;
    const borderCtx = borderCanvas.getContext("2d");
    const hoverCtx = hoverCanvas.getContext("2d");
    borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
    hoverCtx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
    this.hoverBorderCanvas = null;
  }

  globalDrawThrottle = new Throttle();
  drawGlobalEffects = (e: Event, disabledThrottle = false) => {
    const { clientX, clientY } = this.updatePosition(e);
    if (!this.globalDrawThrottle.shouldFunctionRun() && !disabledThrottle) return;
    const { theme, theme: { revealEffectMap } } = this.props;
    if (revealEffectMap.size === 0) return;

    // Add hover size.
    let { hoverSize } = theme.revealConfig;
    if (theme.currHoverSize !== void 0) hoverSize = theme.currHoverSize;
    const halfHoverSize = hoverSize / 2;
    let effectRect = {
      left: clientX - halfHoverSize,
      top: clientY - halfHoverSize,
      right: clientX + hoverSize,
      bottom: clientY + hoverSize
    };

    // draw border effect.
    for (const [borderCanvas, revealConfig] of revealEffectMap) {
      const borderCtx = borderCanvas.getContext("2d");
      const parentEl = borderCanvas.parentElement;
      const parentRect = parentEl.getBoundingClientRect();
      const { borderColor, borderWidth, effectEnable, effectRange } = revealConfig;
      const [x, y] = [clientX - parentRect.left, clientY - parentRect.top];

      const isOverlap = checkOverlap(effectRect, parentRect);
      const isInside = inRectInside({ left: clientX, top: clientY }, parentRect);

      borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
      const isSelfRange = effectRange === "self";
      if ((isOverlap || isInside)) {
        updateCanvasRect(borderCanvas);
        const enableDrawBorder = effectEnable === "border" || effectEnable === "both";
        if (enableDrawBorder && (!isSelfRange || this.hoverBorderCanvas === borderCanvas)) {
          const gradient = getGradient(borderCtx, borderColor, theme);
          drawBorder({
            borderCanvas,
            hoverSize,
            borderWidth,
            gradient,
            x,
            y
          });
        }
      }
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

  addBorderCanvasLocalListeners(borderCanvas: HTMLCanvasElement) {
    const parentEl = borderCanvas.parentElement;
    parentEl.addEventListener("mouseenter", e => this.drawLocalEffect(e, borderCanvas), false);
    parentEl.addEventListener("mouseover", e => this.drawLocalEffect(e, borderCanvas), false);
    parentEl.addEventListener("mousemove", e => this.drawLocalEffect(e, borderCanvas), false);
    parentEl.addEventListener("mouseout", e => this.cleanLocalEffect(e, borderCanvas), false);
    parentEl.addEventListener("mouseleave", e => this.cleanLocalEffect(e, borderCanvas), false);
    parentEl.addEventListener("touchstart", e => this.drawLocalEffect(e, borderCanvas), false);
    parentEl.addEventListener("touchmove", e => this.drawLocalEffect(e, borderCanvas), false);
    parentEl.addEventListener("touchend", e => this.cleanLocalEffect(e, borderCanvas), false);
  }

  addLocalListeners() {
    const { theme: { revealEffectMap } } = this.props;
    for (const [borderCanvas] of revealEffectMap) {
      this.addBorderCanvasLocalListeners(borderCanvas);
    }
  }

  removeBorderCanvasLocalListeners(borderCanvas: HTMLCanvasElement) {}
  removeLocalListeners() {
    const { theme: { revealEffectMap } } = this.props;
    for (const [borderCanvas] of revealEffectMap) {
      this.removeBorderCanvasLocalListeners(borderCanvas);
    }
  }

  addGlobalListeners() {
    window.addEventListener("mouseenter", this.drawGlobalEffects, true);
    window.addEventListener("mouseover", this.drawGlobalEffects, true);
    window.addEventListener("mousemove", this.drawGlobalEffects, true);
    window.addEventListener("mouseout", this.cleanGlobalEffects, true);
    window.addEventListener("mouseleave", this.cleanGlobalEffects, true);
    window.addEventListener("touchstart", this.drawGlobalEffects, true);
    window.addEventListener("touchmove", this.drawGlobalEffects, true);
    window.addEventListener("touchend", this.cleanGlobalEffects, true);
  }

  removeGlobalListeners() {
    window.removeEventListener("mouseenter", this.drawGlobalEffects, true);
    window.removeEventListener("mouseover", this.drawGlobalEffects, true);
    window.removeEventListener("mousemove", this.drawGlobalEffects, true);
    window.removeEventListener("mouseout", this.cleanGlobalEffects, true);
    window.removeEventListener("mouseleave", this.cleanGlobalEffects, true);
    window.removeEventListener("touchstart", this.drawGlobalEffects, true);
    window.removeEventListener("touchmove", this.drawGlobalEffects, true);
    window.removeEventListener("touchend", this.cleanGlobalEffects, true);
  }

  addCanvasOb = (borderCanvas: HTMLCanvasElement) => {
    if (!borderCanvas) return;
    const parentEl = borderCanvas.parentElement as HTMLElement;
    const observer = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        if (this.hoverBorderCanvas && entry.target === this.hoverBorderCanvas.parentElement) {
          this.drawLocalEffect({
            target: parentEl as EventTarget,
            type: void 0
          } as Event, this.hoverBorderCanvas);
        }
      }
    });
    observer.observe(parentEl);
    this.resizeObserverMap.set(borderCanvas, observer);
  }
  addResizeObserver = () => {
    const { theme: { revealEffectMap } } = this.props;
    for (const [borderCanvas] of revealEffectMap) {
      if (borderCanvas) this.addCanvasOb(borderCanvas);
    }
  }

  removeCanvasOb = (borderCanvas: HTMLCanvasElement) => {
    const resizeObserver = this.resizeObserverMap.get(borderCanvas);
    if (resizeObserver) {
      resizeObserver.disconnect();
      this.resizeObserverMap.delete(borderCanvas);
    }
  }
  removeResizeObserver = () => {
    for (const [borderCanvas, resizeObserver] of this.resizeObserverMap) {
      resizeObserver.disconnect();
      this.resizeObserverMap.delete(borderCanvas);
    }
  }

  reflowProps = ["transform", "left", "top", "right", "bottom"];
  transitionRunThrottle = new Throttle({
    runFunc: () => {
      this.drawGlobalEffects(this.currPosition as MouseEvent);
    }
  });
  handleTransitionRun = (e: TransitionEvent) => {
    const { theme } = this.props;
    const isHTMLElement = e && e.target && "contains" in e.target;
    if (this.reflowProps.includes(e.propertyName)) {
      if (isHTMLElement && (e.target as HTMLElement).contains(this.hoverBorderCanvas)) {
        this.transitionRunThrottle.startRunFunc();
      }
    }
  }

  handleTransitionEnd = (e: TransitionEvent) => {
    const { theme } = this.props;
    const { revealEffectMap } = theme;
    const isHTMLElement = e && e.target && "contains" in e.target;
    let isReflowCanvas = false;

    const isReflow = this.reflowProps.includes(e.propertyName);
    if (isReflow) {
      for (const [borderCanvas] of revealEffectMap) {
        if (isReflowCanvas = isHTMLElement && (e.target as HTMLElement).contains(borderCanvas)) {
          this.transitionRunThrottle.endRunFunc();
          // this.drawGlobalEffects(this.currPosition as MouseEvent, true);
          this.drawGlobalEffects(this.currPosition as MouseEvent);
          break;
        }
      }
    }
    if (isReflow && isReflowCanvas) {
      // find curr focus element.
      let findNewFocus = false;
      const focusElements = document.elementsFromPoint(this.currPosition.clientX, this.currPosition.clientY);
      for (const focusElement of focusElements) {
        if (findNewFocus) break;
        for (const [borderCanvas, revealConfig] of revealEffectMap) {
          if (borderCanvas.parentElement === focusElement && revealConfig.effectEnable !== "disabled") {
            this.hoverBorderCanvas = borderCanvas;
            break;
          }
        }
      }

      for (const [borderCanvas] of revealEffectMap) {
        if (borderCanvas !== this.hoverBorderCanvas) {
          const hoverCanvas = borderCanvas.previousElementSibling as HTMLCanvasElement;
          const hoverCtx = hoverCanvas.getContext("2d");
          hoverCtx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
        } else {
          this.drawLocalEffect({
            target: this.hoverBorderCanvas.parentElement as EventTarget,
            type: void 0
          } as Event, this.hoverBorderCanvas);
        }
      }
    }
  }

  render() {
    const { theme } = this.props;
    theme.onAddBorderCanvas = borderCanvas => {
      this.addBorderCanvasLocalListeners(borderCanvas);
      this.addCanvasOb(borderCanvas);
    };
    theme.onRemoveBorderCanvas = borderCanvas => {
      this.removeBorderCanvasLocalListeners(borderCanvas);
      this.removeCanvasOb(borderCanvas);
    };
    return null;
  }
}

export default GlobalRevealStore;
