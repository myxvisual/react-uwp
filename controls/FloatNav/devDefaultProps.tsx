// tslint:disable-next-line:no-unused-variable
import * as React from "react";

import { DataProps } from "./index";
export default {
	items: [{
		image: require("./images/flashdeal.svg"),
		title: "Flash Deal",
		href: "#",
		color: "#f31349"
	}, {
		image: require("./images/gift.svg"),
		title: "Sales Zone",
		href: "#",
		color: "#fc0d1b"
	}, {
		image: require("./images/hotGrey.svg"),
		title: "Hot",
		href: "#",
		color: "#7754e1"
	}, {
		image: require("./images/flashdeal.svg"),
		title: "Women’s fashion",
		href: "#",
		color: "#f31349"
	}, {
		image: require("./images/flashdeal.svg"),
		title: "Home & Garden",
		href: "#",
		color: "#996c5c"
	}, {
		image: require("./images/flashdeal.svg"),
		title: "Shoes, Bags & Accessories",
		href: "#",
		color: "#009490"
	}, {
		image: require("./images/flashdeal.svg"),
		title: "Toys, Kids & Babies",
		href: "#",
		color: "#f3b516"
	}, {
		image: require("./images/flashdeal.svg"),
		title: "Sports & Outdoors",
		href: "#",
		color: "#e3521b"
	}, {
		image: require("./images/flashdeal.svg"),
		title: "Men‘s Fashion",
		href: "#",
		color: "#0059a7"
	}, {
		image: require("./images/flashdeal.svg"),
		title: "Office, Gifts & Stationery",
		href: "#",
		color: "#0dca1e"
	}, {
		image: require("./images/flashdeal.svg"),
		title: "Health & Beauty",
		color: "#44b0ff"
	}, {
		image: require("./images/flashdeal.svg"),
		title: "Mobiles & Tablets",
		color: "#b018a9"
	}, {
		image: require("./images/flashdeal.svg"),
		title: "Automotives",
		color: "#eb63c9"
	}],
	onFocusIndex: () => {},
	topNode: (<img src={require("./images/gift.svg")} />),
	bottomNode: (<img src={require("./images/gift.svg")} />),
	width: 40,
	isFloatRight: false
} as DataProps;
