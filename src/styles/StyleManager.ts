export class StyleManager {
  theme: ReactUWP.ThemeType;
  sheets: any[] = [];

  constructor(theme: ReactUWP.ThemeType) {
    this.theme = theme;
  }

  renderSheets = () => {};

  sheetsToString = () => {};

  updateTheme = () => {};

  addSheet = () => {};

  updateSheetByID = () => {};

  updateAllSheet = () => {};

  removeSheetByID = () => {};
}

export default StyleManager;
