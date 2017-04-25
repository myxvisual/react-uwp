import addCSSRule from "../common/browser/addCSSRule";

export default function setScrollBarStyle(selector = "*") {
  addCSSRule([
`${selector} {
  -ms-overflow-style: -ms-autohiding-scrollbar;
}`,
`${selector}::-webkit-scrollbar {
  -webkit-appearance: none
}`,
`${selector}::-webkit-scrollbar:vertical {
  width: 6px;
}`,
`${selector}::-webkit-scrollbar:horizontal {
  height: 6px
}`,
`${selector}::-webkit-scrollbar-thumb {
  background-color: rgba(95, 95, 95, 0.5);
}`]);
}
