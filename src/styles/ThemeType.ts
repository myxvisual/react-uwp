export interface ThemeType {
	themeName: "Dark" | "Light";
	fontFamily?: string;
	iconFontFamily?: string;

	accent?: string;
	accentLighter1?: string;
	accentLighter2?: string;
	accentLighter3?: string;
	accentDarker1?: string;
	accentDarker2?: string;
	accentDarker3?: string;

	baseLow?: string;
	baseMediumLow?: string;
	baseMedium?: string;
	baseMediumHigh?: string;
	baseHigh?: string;

	altLow?: string;
	altMediumLow?: string;
	altMedium?: string;
	altMediumHigh?: string;
	altHigh?: string;

	listLow?: string;
	listMedium?: string;
	listAccentLow?: string;
	listAccentMedium?: string;
	listAccentHigh?: string;

	chromeLow?: string;
	chromeMediumLow?: string;
	chromeMedium?: string;
	chromeHigh?: string;
	chromeAltLow?: string;
	chromeDisabledLow?: string;
	chromeDisabledHigh?: string;
	chromeBlackLow?: string;
	chromeBlackMediumLow?: string;
	chromeBlackMedium?: string;
	chromeBlackHigh?: string;
	chromeWhite?: string;

	prepareStyles?: (style: React.CSSProperties) => React.CSSProperties;
	isDarkTheme?: boolean;
	updateTheme?: (theme: ThemeType) => void;
	zIndex?: {
		tooltip?: number;
		flyout?: number;
		[key: string]: number;
	};
}
