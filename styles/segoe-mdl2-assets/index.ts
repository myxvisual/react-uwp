// import "./segoe-mdl2-assets.scss";

import addCSSRule from "../../common/browser/addCSSRule";
addCSSRule(
`@font-face {
	font-family: 'Segoe MDL2 Assets';
	src: url("${require("./segoe-mdl2-assets.eot")}"); /* For IE6-8 */
	src:
		local('Segoe MDL2 Assets'),
		url("${require("./segoe-mdl2-assets.woff2")}") format('woff2'),
		url("${require("./segoe-mdl2-assets.woff")}") format('woff'),
		url("${require("./segoe-mdl2-assets.ttf")}") format('truetype');
}`);
