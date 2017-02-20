// tslint:disable-next-line:no-unused-variable
import * as React from "react";

import IconButton from "../IconButton";

import { DataProps } from "./index";
export default {
	items: [{
		showNode: <IconButton>&#xE122;</IconButton>,
		title: "Email",
		href: "#",
		color: "#f31349"
	}, {
		showNode: <IconButton>&#xE11B;</IconButton>,
		title: "Question",
		href: "#",
		color: "#f31349"
	}],
	onFocusIndex: () => {},
	topNode: <IconButton>&#xE10F;</IconButton>,
	bottomNode: <IconButton>&#xE010;</IconButton>,
	width: 40,
	isFloatRight: false
} as DataProps;
