declare module "react-lazyload" {
	import * as React from "react";

	export interface DataProps extends React.Props<ReactLazyload> {
		once?: boolean;
		offset?: number | number[];
		scroll?: boolean;
		resize?: boolean;
		overflow?: boolean;
		debounce?: boolean | number;
		throttle?: boolean | number;
	}
	
	interface ReactLazyloadProps extends DataProps {
		placeholder?: any;
		height?: number | string;
	}

	export class ReactLazyload extends React.Component<ReactLazyloadProps, {}> {
	}

	export default ReactLazyload;

	export function forceCheck(): void;
}
