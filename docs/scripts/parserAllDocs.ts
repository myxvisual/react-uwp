import { Parser } from "./Parser";
import * as fs from "fs";
import * as path from "path";

const parser = new Parser();
const fileNames = [
  "AppBarButton",
  "AutoSuggestBox",
  "Button",
  "CalendarDatePicker",
  "CalendarView",
  "CheckBox",
  "ColorPicker",
  "CommandBar",
  "ContentDialog",
  "DatePicker",
  "DropDownMenu",
  "FlipView",
  "FloatNav",
  "Flyout",
  "FlyoutContent",
  "HyperLink",
  "Icon",
  "IconButton",
  "Image",
  "ListView",
  "MarkdownRender",
  "MediaPlayer",
  "Menu",
  "NavigationView",
  "PasswordBox",
  "ProgressBar",
  "ProgressRing",
  "RadioButton",
  "RatingControl",
  "ScrollReveal",
  "Separator",
  "Slider",
  "SplitView",
  "SplitViewCommand",
  "Tabs",
  "TextBox",
  "Theme",
  "TimePicker",
  "Toast",
  "Toggle",
  "Tooltip",
  "TreeView"
];
const files = fileNames.map(fileName => `../../src/${fileName}/index.tsx`);
files.push("../../src/Animate/CustomAnimate.tsx");

for (const file of files) {
  parser.parse(
    path.resolve(__dirname, file),
    result => {
      const fileName = result.fileName.replace(/\.tsx?/, ".doc.json");
      result.fileName = void 0;
      result.name = void 0;
      const data = JSON.stringify(result, null, 2);
      fs.writeFileSync(fileName, data.replace(/\\r\\n/g, "\\n"));
    }
  );
}
