import * as React from "react";
import { Theme } from "../styles/getTheme";
import { createRadialGradient, inRectInside, drawBorder, drawHover, updateCanvasRect } from "./helper"; import * as tinyColor from "tinycolor2";
import { Theme as ThemeType } from "react-uwp/styles/getTheme";
import { Throttle } from "../utils/Throttle";
import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';
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
    this.uninitAll();
  }

  initAll() {
    this.addLocalListeners();
    this.addGlobalListeners();
    this.addResizeObserver();
    window.addEventListener("transitionrun", this.handleTransintionRun, false);
    window.addEventListener("transitionend", this.handleTransintionEnd, false);
  }

  uninitAll() {
    this.removeLocalListeners();
    this.removeGlobalListeners();
    this.remoeResizeObserver();
    window.removeEventListener("transitionrun", this.handleTransintionRun, false);
    window.removeEventListener("transitionend", this.handleTransintionEnd, false);
  }

  locaalDrawThrottle = new Throttle();
  drawLocalEffect = (event: Event, borderCanvas: HTMLCanvasElement, disabledThrottle = false) => {
    const { clientX, clientY } = this.updatePosition(event);
    if (!this.locaalDrawThrottle.shouldFunctionRun() && !disabledThrottle) return;
    const { theme, theme: { revealEffectMap } } = this.props;
    const parentEl = borderCanvas.parentElement;
    const revealConfig = revealEffectMap.get(borderCanvas);
    if (!revealConfig) return;
    const { hoverSize, borderWidth, borderColor, hoverColor, effectEnable } = revealConfig;
    this.hoverBorderCanvas = borderCanvas;
    theme.currHoverSize = hoverSize;

    const borderCtx = borderCanvas.getContext("2d");
    borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
    const parentRect = parentEl.getBoundingClientRect();
    const borderGradient = getGradient(borderCtx, borderColor, theme);
    const [x, y] = [clientX - parentRect.x, clientY - parentRect.y];
    const enableDrawBorder = effectEnable === "border" || effectEnable === "both";
    const enableDrawHover = effectEnable === "hover" || effectEnable === "both";

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
    const borderCtx = borderCanvas.getContext("2d");
    const hoverCanvas = borderCanvas.previousElementSibling as HTMLCanvasElement;
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
      
      updateCanvasRect(borderCanvas);
      borderCtx.clearRect(0, 0, borderCanvas.width, borderCanvas.height);
      const isSelfRange = effectRange === "self";
      if ((isOverlap || isInside)) {
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
        };
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
    parentEl.addEventListener("click", e => this.drawLocalEffect(e, borderCanvas), false);
    parentEl.addEventListener("mouseenter", e => this.drawLocalEffect(e, borderCanvas), false);
    parentEl.addEventListener("mousemove", e => this.drawLocalEffect(e, borderCanvas), false);
    parentEl.addEventListener("mouseleave", e => this.cleanLocalEffect(e, borderCanvas), false);
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
    // window.addEventListener("scroll", this.drawGlobalEffects, true);
    window.addEventListener("click", this.drawGlobalEffects, true);
    window.addEventListener("mouseenter", this.drawGlobalEffects, true);
    window.addEventListener("mousemove", this.drawGlobalEffects, true);
    window.addEventListener("mouseleave", this.cleanGlobalEffects, true);
  }

  removeGlobalListeners() { 
    // window.removeEventListener("scroll", this.drawGlobalEffects, true);
    window.removeEventListener("click", this.drawGlobalEffects, true);
    window.removeEventListener("mouseenter", this.drawGlobalEffects, true);
    window.removeEventListener("mousemove", this.drawGlobalEffects, true);
    window.removeEventListener("mouseleave", this.cleanGlobalEffects, true);
  }

  addCanvasOb = (borderCanvas: HTMLCanvasElement) => {
    const parentEl = borderCanvas.parentElement as HTMLElement;
    const observer = new ResizeObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.target === parentEl) {
          this.drawLocalEffect({
            target: parentEl as EventTarget,
            type: void 0
          } as Event, borderCanvas);
        }
      });
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
    const reszieObserver = this.resizeObserverMap.get(borderCanvas);
    if (reszieObserver) {
      reszieObserver.disconnect();
      this.resizeObserverMap.delete(borderCanvas);
    }
  }
  remoeResizeObserver = () => {
    for (const [borderCanvas, reszieObserver] of this.resizeObserverMap) {
      reszieObserver.disconnect();
      this.resizeObserverMap.delete(borderCanvas);
    }
  }

  transitionRunThrottle = new Throttle({
    runFunc: () => {
      this.drawGlobalEffects(this.currPosition as MouseEvent);
    }
  });
  handleTransintionRun = (e: TransitionEvent) => {
    this.transitionRunThrottle.startRunFunc();
    for (const [borderCanvas] of this.props.theme.revealEffectMap) {
      const reflowProps = ["transform", "left", "top", "right", "width", "height"];
      if (reflowProps.includes(e.propertyName)) {
        const hoverCanvas = borderCanvas.previousElementSibling as HTMLCanvasElement;
        const hoverCtx = hoverCanvas.getContext("2d");
        hoverCtx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
      }
    }
  }

  handleTransintionEnd = (e: TransitionEvent) => {
    this.transitionRunThrottle.endRuncFunc();
    const { theme } = this.props;
    const { revealEffectMap } = theme;
    const currEl = e.currentTarget as HTMLElement;
    if (currEl && "contains" in currEl) {
      for (const [borderCanvas] of revealEffectMap) {
        if (currEl.contains(borderCanvas.parentElement)) {
          this.drawGlobalEffects(this.currPosition as MouseEvent, true);
          break;
        }
      }
    }
  }

  render() {
    const { theme } = this.props;
    theme.onAddBorderCanvas = borderCanvas => {
      this.addBorderCanvasLocalListeners(borderCanvas);
      this.addCanvasOb(borderCanvas);
    }
    theme.onRemoveBorderCanvas = borderCanvas => {
      this.removeBorderCanvasLocalListeners(borderCanvas);
      this.removeCanvasOb(borderCanvas);
    }
    return null;
  }
}

export default GlobalRevealStore;
