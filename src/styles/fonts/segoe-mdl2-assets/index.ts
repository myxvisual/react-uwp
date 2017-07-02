export default function setSegoeMDL2AssetsFonts() {
  const linkElm = document.createElement("link");
  Object.assign(linkElm, {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/react-uwp/1.1.0/css/segoe-mdl2-assets.css"
  });
  document.head.appendChild(linkElm);
}

export { setSegoeMDL2AssetsFonts };

// import addCSSRule from "../../common/browser/addCSSRule";
// addCSSRule(
// `@font-face {
//   font-family: "Segoe MDL2 Assets";
//   src:
//     local("Segoe MDL2 Assets"),
//     url("${require("./segmdl2.eot")}"),
//     url("${require("./segmdl2.woff2")}") format("woff2"),
//     url("${require("./segmdl2.woff")}") format("woff"),
//     url("${require("./segmdl2.svg#SegoeMDL2Assets")}") format("svg"),
//     url("${require("./segmdl2.ttf")}") format("truetype");
// }
// `);
