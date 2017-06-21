function addBlurEvent(isOpen?: boolean, listener?: () => void) {
  if (isOpen) {
    window.addEventListener("click", listener);
    this.cacheListener = listener;
  }
  if (!isOpen && this.cacheEvent) {
    window.removeEventListener("click", listener);
    this.cacheListener = null;
  }
}
