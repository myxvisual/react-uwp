export function isSupportBackdropFilter() {
  let isSupported = false;
  const propertyName = "backdropFilter";
  const propertyValue = "blur(10px)";

  if (CSS && CSS.supports) {
    return CSS.supports("backdrop-filter", propertyValue);
  } else {
    const { style } = document.createElement("div");
    isSupported = style[propertyName] !== void 0;
    if (isSupported) {
      style[propertyName] = propertyValue;
      isSupported = style.cssText.length !== 0;
    }

    return isSupported;
  }
}
