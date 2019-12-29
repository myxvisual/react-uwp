import tinyColor from "tinycolor2";
import * as easing from "d3-ease";
import * as gsap from "gsap";
import { drawElement2Ctx, DrawType } from "./helper";

interface RevealStore {
    hoverCanvas: HTMLCanvasElement;
    borderCanvas: HTMLCanvasElement;
    hoverCtx: CanvasRenderingContext2D;
    borderCtx: CanvasRenderingContext2D;
    isMouseDown: boolean;
    hoverScale: number;
}

const revealStore: RevealStore = {
    hoverCanvas: null,
    borderCanvas: null,
    hoverCtx: null,
    borderCtx: null,
    isMouseDown: false,
    hoverScale: 1
} as any;
const revealItemsMap = new Map<HTMLElement, RevealItem>();
const coverItemsMap = new Map<HTMLElement, boolean>();
const observersMap = new Map<HTMLElement, MutationObserver>();
const pureColor = "#fff";

export interface ColorStore {
    gradient: CanvasGradient;
    borderColor: string;
}
const colorMap = new Map<string, ColorStore>();

/**
 * Detect rectangle is overlap.
 * @param rect1 - DOMRect
 * @param rect2 - DOMRect
 */
export interface OverlapRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function isRectangleOverlap(rect1: OverlapRect, rect2: OverlapRect) {
    return Math.max(rect1.left, rect2.left) < Math.min(rect1.right, rect2.right) && Math.max(rect1.top, rect2.top) < Math.min(rect1.bottom, rect2.bottom);
}

export function isOverflowed(element: HTMLElement) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

/**
 * Detect cursor is inside to rect.
 * @param position The mouse cursor position.
 * @param rect The DOMRect.
 */
export function inRectInside(position: { left: number; top: number }, rect: DOMRect) {
    return (position.left > rect.left && position.left < rect.right && position.top > rect.top && position.top < rect.bottom);
}

/** Set reveal effect config. */
export interface RevalConfig {
    /** Set hover borderWidth. */
    borderWidth?: number;
    /** Set hover size. */
    hoverSize?: number;
    /** Set effectEnable type, default is both. */
    effectEnable?: "hover" | "border" | "both";
    /** Set borderType, default is inside. */
    borderType?: "inside" | "outside";
    /** Set hoverColor. */
    hoverColor?: string;
    /** Set borderColor. */
    borderColor?: string;
    /** Set canvas zIndex. */
    zIndex?: number;
    hoverGradient?: CanvasGradient;
}

export interface CircleGradient {
    x: number;
    y: number;
    color1: string;
    color2: string;
    r1: number;
    r2: number;
}

/**
 * RevealItem interface.
 *
 */
export interface RevealItem {
    element: HTMLElement;

    borderWidth?: RevalConfig["borderWidth"];
    hoverSize?: RevalConfig["hoverSize"];
    effectEnable?: RevalConfig["effectEnable"];
    borderType?: RevalConfig["borderType"];
    hoverColor?: RevalConfig["hoverColor"];

    /**
     * zIndex is not supported, only for the type.
     */
    zIndex?: RevalConfig["zIndex"];
}

const currMousePosition = {
    x: 0,
    y: 0
};
const revealConfig: Required<RevalConfig> = {
  hoverSize: 60,
  hoverColor: "rgba(255, 255, 255, .2)",
  borderWidth: 2,
  effectEnable: "both",
  borderType: "inside",
  zIndex: 9999,
  hoverGradient: null as any,
  borderColor: ""
};

/** Create reveal effect method. */
function createCanvas() {
    revealStore.hoverCanvas = document.createElement("canvas");
    revealStore.borderCanvas = document.createElement("canvas");
    document.body.appendChild(revealStore.hoverCanvas);
    document.body.appendChild(revealStore.borderCanvas);
    revealStore.hoverCtx = revealStore.hoverCanvas.getContext("2d") as CanvasRenderingContext2D;
    revealStore.borderCtx = revealStore.borderCanvas.getContext("2d") as CanvasRenderingContext2D;
    removeListeners();
    addListeners();
    updateCanvas();
}

export function removeCanvas() {
    document.body.removeChild(revealStore.hoverCanvas);
    document.body.removeChild(revealStore.borderCanvas);
    delete revealStore.hoverCanvas;
    delete revealStore.borderCanvas;
    delete revealStore.hoverCtx;
    delete revealStore.borderCtx;
}

export function updateCanvas() {
    Object.assign(revealStore.hoverCanvas.style, {
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight}px`,
        position: "fixed",
        left: "0px",
        top: "0px",
        pointerEvents: "none",
        zIndex: revealConfig.zIndex
    });
    Object.assign(revealStore.borderCanvas.style, {
        width: `${window.innerWidth}px`,
        height: `${window.innerHeight}px`,
        position: "fixed",
        left: "0px",
        top: "0px",
        pointerEvents: "none",
        zIndex: revealConfig.zIndex
    });
    Object.assign(revealStore.hoverCanvas, {
        width: window.innerWidth,
        height: window.innerHeight
    });
    Object.assign(revealStore.borderCanvas, {
        width: window.innerWidth,
        height: window.innerHeight
    });

}

export function addListeners() {
  document.addEventListener("scroll", handleScroll, true);
  document.addEventListener("click", handleScroll, true);
  window.addEventListener("resize", updateCanvas);
  window.addEventListener("mousemove", handleMouseMove);
}

export function removeListeners() {
  document.removeEventListener("scroll", handleScroll, true);
  document.removeEventListener("click", handleScroll, true);
  window.removeEventListener("resize", updateCanvas);
  window.removeEventListener("mousemove", handleMouseMove);
}

export function handleScroll(e: Event) {
    let hoverEl = document.body as HTMLElement;
    revealItemsMap.forEach(({ element }) => {
        if (element) {
            const rect = element.getBoundingClientRect() as DOMRect;
            const isInsideEl = inRectInside({ left: currMousePosition.x, top: currMousePosition.y }, rect);
            if (isInsideEl) {
                if (hoverEl.contains(element)) {
                    hoverEl = element;
                }
            }
        }
    });
    drawEffect(currMousePosition.x, currMousePosition.y, hoverEl, true);
}

function handleMouseMove(e: MouseEvent) {
    const el = e.target as HTMLElement;
    drawEffect(e.clientX, e.clientY, el, true);
}

function getHoverParentEl(hoverEl: HTMLElement) {
    let parentEl: HTMLElement = document.body;
    revealItemsMap.forEach(({ element }) => {
        if (element) {
            if (element.contains(hoverEl) && parentEl.contains(element)) {
                parentEl = element;
            }
        }
    });

    return parentEl;
}

function clearHoverCtx() {
    revealStore.hoverCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function clearBorderCtx() {
    revealStore.borderCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function drawHoverCircle(ctx: CanvasRenderingContext2D, hoverRevealConfig: Required<RevalConfig>) {
    let { hoverScale } = revealStore;
    const { x: mouseX, y: mouseY } = currMousePosition;
    let { hoverSize, hoverGradient } = hoverRevealConfig;
    hoverSize = hoverSize * hoverScale;
    const width = hoverSize * 2;

    ctx.save();
    ctx.translate(mouseX, mouseY);
    ctx.fillStyle = 0 ? "#fff" : hoverGradient;
    ctx.scale(width, width);
    ctx.filter = `blur(${hoverSize / 10}px)`;
    ctx.fillRect(-.5, -.5, 1, 1);
    ctx.restore();
}

// inside hover effect.
function drawHover(hoverEl: HTMLElement) {
    revealStore.hoverCtx.globalCompositeOperation = "source-over";
    const hoverRevealConfig = getRevealConfig(revealItemsMap.get(hoverEl) as RevealItem);
    drawHoverCircle(revealStore.hoverCtx, hoverRevealConfig);

    revealStore.hoverCtx.globalCompositeOperation = "destination-in";
    revealStore.hoverCtx.fillStyle = pureColor;
    drawElement2Ctx(revealStore.hoverCtx, hoverEl, DrawType.Fill);
}

// draw border effect.
function drawBorder(hoverRevealConfig: Required<RevalConfig>) {
    function drawAllRevealBorders() {
        const { x: mouseX, y: mouseY } = currMousePosition;
        const effectLeft = mouseX - hoverRevealConfig.hoverSize;
        const effectTop = mouseY - hoverRevealConfig.hoverSize;
        const effectSize = 2 * hoverRevealConfig.hoverSize;
        const effectRect = {
            left: effectLeft,
            top: effectTop,
            right: effectLeft + effectSize,
            bottom: effectTop + effectSize
        } as DOMRect;
        let effectItems: RevealItem[] = [];
        revealItemsMap.forEach(revealItem => {
            if (revealItem.element) {
                const rect = revealItem.element.getBoundingClientRect() as DOMRect;
                if (isRectangleOverlap(effectRect, rect)) {
                    effectItems.push(revealItem);
                }
            }
        });
        // sort effectItems by depth(deeper).
        effectItems = effectItems.sort((a, b) => a.element.compareDocumentPosition(b.element) & 2 ? -1 : 1);

        effectItems.forEach(revealItem => {
            const element = revealItem.element;
            if (!element) return;
            const currRevealConfig = getRevealConfig(revealItem);
            const { borderColor } = currRevealConfig;

            revealStore.borderCtx.globalCompositeOperation = "source-over";
            revealStore.borderCtx.strokeStyle = borderColor;

            // draw inside border.
            revealStore.borderCtx.lineWidth = currRevealConfig.borderWidth;
            revealStore.borderCtx.fillStyle = currRevealConfig.borderColor;
            revealStore.borderCtx.strokeStyle = currRevealConfig.borderColor;

            drawElement2Ctx(revealStore.borderCtx, element, DrawType.Stroke);
            const parentEl = element.parentElement as HTMLElement;
            if (coverItemsMap.has(parentEl)) {
                const rect = parentEl.getBoundingClientRect() as DOMRect;
                revealStore.borderCtx.globalCompositeOperation = "destination-in";
                revealStore.hoverCtx.globalCompositeOperation = "destination-in";
                revealStore.borderCtx.fillStyle = pureColor;
                revealStore.hoverCtx.fillStyle = pureColor;
                revealStore.borderCtx.fillRect(rect.x, rect.y, rect.width, rect.height);
                revealStore.hoverCtx.fillRect(rect.x, rect.y, rect.width, rect.height);
            }
        });
    }

    drawAllRevealBorders();
    // make border mask.
    revealStore.borderCtx.globalCompositeOperation = "destination-in";
    drawHoverCircle(revealStore.borderCtx, hoverRevealConfig);
}

function drawEffect(mouseX: number, mouseY: number, hoverEl: HTMLElement, clearHover: boolean) {
    currMousePosition.x = mouseX;
    currMousePosition.y = mouseY;
    if (clearHover) {
        clearHoverCtx();
    }
    clearBorderCtx();

    let isHoverReveal = revealItemsMap.has(hoverEl);
    if (!isHoverReveal && !coverItemsMap.has(hoverEl)) {
        hoverEl = getHoverParentEl(hoverEl);
        isHoverReveal = revealItemsMap.has(hoverEl);
    }
    const hoverRevealConfig = isHoverReveal ? getRevealConfig(revealItemsMap.get(hoverEl) as RevealItem) : revealConfig;

    switch (hoverRevealConfig.effectEnable) {
        case "hover": {
            if (isHoverReveal) {
                drawHover(hoverEl);
            }
            break;
        }
        case "border": {
            drawBorder(hoverRevealConfig);
            break;
        }
        default: {
            drawBorder(hoverRevealConfig);
            if (isHoverReveal) {
                drawHover(hoverEl);
            }
            break;
        }
    }
}

function clearCanvas() {
    if (isCanvasCreated()) {
        clearHoverCtx();
        clearBorderCtx();
    }
    revealItemsMap.clear();
}

function isCanvasCreated() {
    return revealStore.hoverCanvas && revealStore.borderCanvas && revealStore.hoverCtx && revealStore.borderCtx;
}

function checkAndCreateCanvas() {
    if (!isCanvasCreated()) {
        createCanvas();
    }
}

const observerConfig: MutationObserverInit = {
    attributes: true,
    characterData: false,
    childList: true,
    subtree: true
};

const observerParentConfig: MutationObserverInit = {
    attributes: true,
    characterData: false,
    childList: true,
    subtree: true
};

function addObserver(element: HTMLElement) {
    const { parentElement } = element;
    const observer = new MutationObserver((mutationsList) => {
        const elements = revealItemsMap.keys();
        let isRemoved = false;
        for (const el of elements) {
            if (!document.documentElement.contains(el)) {
                revealItemsMap.delete(el);
                observersMap.delete(el);
                // observer.disconnect();
                isRemoved = el === element;
            }
            if (isRemoved) break;
        }
        if (isRemoved) return;

        const isInsideEl = inRectInside({ left: currMousePosition.x, top: currMousePosition.y }, element.getBoundingClientRect() as DOMRect);
        drawEffect(currMousePosition.x, currMousePosition.y, isInsideEl ? element : document.documentElement, isInsideEl);
    });
    // Start observing the target node for configured mutations.
    // observer.observe(element, observerConfig);
    if (parentElement) {
        observer.observe(parentElement, observerParentConfig);
    }
    observersMap.set(element, observer);
}

function clearObserver(element: HTMLElement) {
    const observer = observersMap.get(element);
    if (observer) {
        observer.disconnect();
        revealItemsMap.delete(element);
    }
}

function clearObservers() {
    observersMap.forEach(observer => observer.disconnect());
    observersMap.clear();
}

const hoverMaxScale = .5;
const hoverTime = 2;
const hoverShortTime = .2;
const ease = "Quart.easeInOut";

function addEvent2Elm(element: HTMLElement) {
    revealStore.hoverScale = hoverMaxScale;
    let tlMax: gsap.TweenLite = gsap.TweenLite.to(revealStore, hoverTime, {
        hoverScale: 1,
        ease,
        onUpdate() {
            drawEffect(currMousePosition.x, currMousePosition.y, element, true);
        }
    });
    element.addEventListener("mousedown", (e) => {
        revealStore.isMouseDown = true;
        revealStore.hoverScale = hoverMaxScale;
        tlMax.restart();
    });

    element.addEventListener("mouseup", (e) => {
        revealStore.isMouseDown = false;
        const tlRestore = gsap.TweenLite.to(revealStore, hoverShortTime, {
            hoverScale: 1,
            ease,
            onUpdate() {
                drawEffect(currMousePosition.x, currMousePosition.y, element, true);
            }
        });
        if (tlMax) {
            tlMax.pause();
        }
        tlRestore.play();
    });
}

/**
 * Add reveal effect to revealItem.
 * @param revealItem - RevealItem
 */
function addRevealItem(revealItem: RevealItem) {
    checkAndCreateCanvas();
    const { element } = revealItem;
    if (element) {
        addObserver(element);
        revealItemsMap.set(element, revealItem);
        const { parentElement } = element;
        if (parentElement && isOverflowed(parentElement)) {
            coverItemsMap.set(parentElement as HTMLElement, true);
        }
    }
}

/**
 * Add reveal effect to revealItem list.
 * @param revealItems - RevealItem[]
 */
function addRevealItems(revealItems: RevealItem[]) {
    checkAndCreateCanvas();
    revealItems.forEach(revealItem => {
        addRevealItem(revealItem);
    });
}

/**
 * Add reveal effect to html element.
 * @param element - HTMLElement
 */
function addRevealEl(element: HTMLElement) {
    checkAndCreateCanvas();
    if (element) {
        addEvent2Elm(element);
        addObserver(element);
        const revealItem = { element };
        revealItemsMap.set(element, revealItem);
        const { parentElement } = element;
        if (parentElement && isOverflowed(parentElement)) {
            coverItemsMap.set(parentElement as HTMLElement, true);
        }
    }
}

/**
 * Add reveal effect to html element list.
 * @param elements - HTMLElement[] | NodeListOf<HTMLElement>
 */
function addRevealEls(elements: HTMLElement[] | NodeListOf<HTMLElement>) {
    checkAndCreateCanvas();
    elements.forEach((element: HTMLElement) => {
        addRevealEl(element);
    });
}

function addCoverEl(element: HTMLElement) {
    if (element) {
        addObserver(element);
        coverItemsMap.set(element, true);
    }
}

function addCoverEls(elements: HTMLElement[] | NodeListOf<HTMLElement>) {
    elements.forEach((element: HTMLElement) => {
        addCoverEl(element);
    });
}

/**
 * Clear all reveal effect element.
 */
function clearRevealEl(element: HTMLElement) {
    if (revealItemsMap.has(element)) {
        revealItemsMap.delete(element);
    }
    clearObserver(element);
    clearCanvas();
}

/**
 * Clear all reveal effect elements.
 */
function clearRevealEls() {
    revealItemsMap.clear();
    clearCanvas();
    clearObservers();
}

/**
 * Clear all reveal effect item.
 */
function clearRevealItem(revealItem: RevealItem) {
    if (revealItemsMap.has(revealItem.element)) {
        revealItemsMap.delete(revealItem.element);
        clearObserver(revealItem.element);
    }
    clearCanvas();
}

/**
 * Clear all reveal effect items.
 */
function clearRevealItems() {
    revealItemsMap.clear();
    clearCanvas();
    clearObservers();
}

function getRevealConfig(config: RevalConfig) {
    const newConfig = {
        hoverSize: config.hoverSize === void 0 ? revealConfig.hoverSize : config.hoverSize,
        borderWidth: config.borderWidth === void 0 ? revealConfig.borderWidth : config.borderWidth,
        effectEnable: config.effectEnable === void 0 ? revealConfig.effectEnable : config.effectEnable,
        borderType: config.borderType === void 0 ? revealConfig.borderType : config.borderType,
        hoverColor: config.hoverColor === void 0 ? revealConfig.hoverColor : config.hoverColor,
        zIndex: config.zIndex === void 0 ? revealConfig.zIndex : config.zIndex,
        borderColor: config.borderColor === void 0 ? revealConfig.borderColor : config.borderColor
    } as Required<RevalConfig>;

    const newTinyColor = tinyColor(newConfig.hoverColor);
    const hsla = newTinyColor.toHsl();
    const hslaColor = newTinyColor.toHslString();
    let storeColor = colorMap.get(hslaColor) as ColorStore;

    if (!storeColor) {
        const gradient = revealStore.hoverCtx.createRadialGradient(0, 0, 0, 0, 0, 1);
        const step = 0.01;
        for (let x = 1; x > 0; x -= step) {
            // let alpha = easing.easeCubicIn(x);
            let alpha = easing.easeCubicInOut(x);
            gradient.addColorStop(x / 2, `hsla(${hsla.h}, ${hsla.h * 100}%, ${hsla.l * 100}%, ${(1 - alpha) * hsla.a})`);
        }
        const borderColor = tinyColor({
            h: hsla.h,
            s: hsla.s,
            l: hsla.l,
            a: 1
        }).toHslString();
        storeColor = { gradient, borderColor };
        colorMap.set(hslaColor, storeColor);
    }

    newConfig.hoverGradient = storeColor.gradient;
    if (!newConfig.borderColor) {
        newConfig.borderColor = storeColor.borderColor;
    }

    return newConfig;
}

function setRevealConfig(config: RevalConfig) {
    checkAndCreateCanvas();
    const newConfig = getRevealConfig(config);
    Object.assign(revealConfig, newConfig);
    updateCanvas();
}

export {
    createCanvas,
    clearCanvas,
    handleMouseMove,
    addRevealItem,
    clearRevealItem,
    addRevealItems,
    clearRevealItems,
    addRevealEl,
    clearRevealEl,
    addRevealEls,
    clearRevealEls,
    addCoverEl,
    addCoverEls,
    setRevealConfig
};
