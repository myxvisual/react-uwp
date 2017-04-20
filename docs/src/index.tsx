import * as React from "react";
import { RouteComponent } from "react-router";
import Wrapper from "./Wrapper";

export interface RouterCB {
	(error: any, component?: RouteComponent): void;
}

let WrapperWithPath: React.PureComponent<void, void>;

const getRoutes = (path = "/") => {
	WrapperWithPath = class extends React.PureComponent<void, void> {
		render() {
			const { children } = this.props;
			return (
				<Wrapper path={path}>
					{children}
				</Wrapper>
			);
		}
	} as any;

	return {
		path,
		component: WrapperWithPath,
		indexRoute: {
			getComponent(location: Location, cb: RouterCB) {
				require.ensure([], (require) => {
					cb(null, require<any>("./routes/Index").default);
				}, "app-react-uwp-index");
			}
		},
		childRoutes: [{
			path: "design",
			childRoutes: [{
				path: "controls-and-patterns",
				childRoutes: [{
					path: "intro",
					getComponent: (location: Location, cb: RouterCB) => {
						require.ensure([], (require) => {
							cb(null, require<any>("./routes/Controls/Intro").default);
						}, "app-react-uwp-controls-intro");
					}
				}, {
					path: "index-of-controls-by-function",
					getComponent: (location: Location, cb: RouterCB) => {
						require.ensure([], (require) => {
							cb(null, require<any>("./routes/Controls/IndexOfControlsByFunciton").default);
						}, "app-react-uwp-controls-index-of-controls-by-function");
					}
				}, {
					path: "Auto-Suggest-Box",
					getComponent: (location: Location, cb: RouterCB) => {
						require.ensure([], (require) => {
							cb(null, require<any>("./routes/Controls/AutoSuggestBox").default);
						}, "app-react-uwp-controls-AutoSuggestBox");
					}
				}, {
					path: "buttons",
					getComponent: (location: Location, cb: RouterCB) => {
						require.ensure([], (require) => {
							cb(null, require<any>("./routes/Controls/Buttons").default);
						}, "app-react-uwp-controls-Buttons");
					}
				}, {
					path: "check-box",
					getComponent: (location: Location, cb: RouterCB) => {
						require.ensure([], (require) => {
							cb(null, require<any>("./routes/Controls/CheckBox").default);
						}, "app-react-uwp-controls-CheckBox");
					}
				}]
			}]
		}]
	};
};
const routes: any = getRoutes();

export { getRoutes, WrapperWithPath };
export default routes;
