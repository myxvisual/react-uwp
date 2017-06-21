export default class AddBlurEvent {
  constructor() {}
  clickListener: (e?: Event) => void;
  keydownListener: (e?: KeyboardEvent) => void;

  cleanEvent = () => {
    if (this.clickListener) {
      document.documentElement.removeEventListener("click", this.clickListener);
      this.clickListener = null;
    }
    if (this.keydownListener) {
      document.documentElement.removeEventListener("keydown", this.keydownListener);
      this.keydownListener = null;
    }
  }

  setConfig = (config?: {
    addListener: boolean;
    blurCallback: (e?: Event) => void;
    clickExcludeElm?: HTMLElement;
    keydownCallback?: (e?: KeyboardEvent) => void;
    blurKeyCodes?: number[];
  }) => {
    const {
      addListener,
      blurCallback,
      clickExcludeElm,
      blurKeyCodes
    } = config;

    if (addListener) {
      if (!this.clickListener) {
        this.clickListener = (e: Event) => {
          if (clickExcludeElm) {
            if (clickExcludeElm.contains(e.target as Node)) {
              return;
            } else {
              this.cleanEvent();
              blurCallback(e);
            }
          } else {
            this.cleanEvent();
            blurCallback(e);
          }
        };

        document.documentElement.addEventListener("click", this.clickListener);
      }

      if (!this.keydownListener && blurKeyCodes) {
        this.keydownListener = (e: KeyboardEvent) => {
          const { keyCode } = e;
          if (blurKeyCodes.includes(keyCode)) {
            blurCallback(e);
            this.cleanEvent();
          } else {
            this.cleanEvent();
          }
        };
        document.documentElement.addEventListener("keydown", this.keydownListener);
      }
    }

    if (!addListener) {
      this.cleanEvent();
    }
  }
}
