import * as React from "react";

import MarkdownRender from "../../../components/MarkdownRender";
import ComponentDescription from "./ComponentDescription";

import CommandBar from "react-uwp/src/controls/CommandBar";
import Button from "react-uwp/src/controls/Button";
import HyperLink from "react-uwp/src/controls/HyperLink";

export default class Mock extends React.PureComponent<any, void> {
	render() {
		const {
			location, // tslint:disable-line:no-unused-variable
			params, // tslint:disable-line:no-unused-variable
			route, // tslint:disable-line:no-unused-variable
			router, // tslint:disable-line:no-unused-variable
			routeParams, // tslint:disable-line:no-unused-variable
			routes, // tslint:disable-line:no-unused-variable
			...attributes
		} = this.props;

		return (
			<div
				{...attributes}
				title={`${location.pathname.split("/").slice(-1)[0].split("-").map((str: string) => str[0].toUpperCase() + str.slice(1)).join(" ")}React-UWP App developer | Docs`}
			>
				<MarkdownRender
					text={
`# Controls by function
---
The UI framework for Windows provides an extensive library of controls that support UI development. Some of these controls have a visual representation; others function as the containers for other controls or content, such as images and media.
Here's a list by function of the common controls you can use in your app. `
					}
				/>

				<MarkdownRender text="## AppBars and commands" />
				<ComponentDescription
					description={
`### AppBar
A toolbar for displaying application-specific commands. See Command bar.`
					}
				>
				</ComponentDescription>
				<ComponentDescription
					description={
`### Command bar
A specialized app bar that handles the resizing of app bar button elements.`
					}
					direction="column"
					themeStyle={{ height: 140 }}
					isChromeMode
				>
					<CommandBar />
				</ComponentDescription>

				<MarkdownRender text="## Buttons" />
				<ComponentDescription
					description={
`### Button
A control that responds to user input and raises a **Click** event.`
					}
				>
					<Button>Button</Button>
				</ComponentDescription>
				<ComponentDescription
					description={
`### Hyperlink
A UWP Design Link.`
					}
				>
					<HyperLink>HyperLink</HyperLink>
				</ComponentDescription>
			</div>
		);
	}
}
