export function isSupportBackdropFilter() {
  let isSupported = false;
  const propertyName = "backdropFilter";
  const propertyValue = "blur(10px)";

  if (global["CSS"] && CSS.supports) {
    return CSS.supports("backdrop-filter", propertyValue);
  } else {
    let elm = document.createElement("div");
    const { style } = elm;
    isSupported = style[propertyName] !== void 0;
    if (isSupported) {
      style[propertyName] = propertyValue;
      isSupported = style.cssText.length !== 0;
    }
    elm = null;

    return isSupported;
  }
}
