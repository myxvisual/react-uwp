export default class AddBlurEvent {
  constructor() {}
  cacheListener: (e?: Event) => void;

  cleanEvent = () => {
    if (this.cacheListener) {
      document.documentElement.removeEventListener("click", this.cacheListener);
      this.cacheListener = null;
    }
  }

  setConfig = (config?: {
    addListener: boolean;
    blurCallback: (e?: Event) => void;
    excludeElm?: HTMLElement;
    blurKeyCodes?: string[];
  }) => {
    const { addListener, blurCallback, excludeElm, blurKeyCodes } = config;

    if (addListener && (!this.cacheListener)) {
      this.cacheListener = (e: Event) => {
        if (excludeElm) {
          if (excludeElm.contains(e.target as Node)) {
            this.cleanEvent();
          } else {
            this.cleanEvent();
            blurCallback(e);
          }
        } else {
          this.cleanEvent();
          blurCallback(e);
        }
      };

      document.documentElement.addEventListener("click", this.cacheListener);
    }

    if (!addListener && this.cacheListener) {
      this.cleanEvent();
    }
  }
}
