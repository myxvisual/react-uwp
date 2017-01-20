import { ThemeType } from "./ThemeType";
import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";

export default function getTheme(themeType: "dark" | "light"): ThemeType {
	switch (themeType) {
		case "dark": {
			return darkTheme;
		}
		case "light": {
			return lightTheme;
		}
		default: {
			return darkTheme;
		}
	};
}
