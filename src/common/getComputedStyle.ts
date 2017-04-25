export default function getComputedStyle(elm: Element, pseudoElt?: string): CSSStyleDeclaration {
  return window.getComputedStyle(elm, pseudoElt);
}
