import * as React from "react";
import * as ReactDOM from "react-dom";

export default function renderToBody(RenderComponent: any, callback = () => {}, removeCallback = () => {}, lifeTime = 2500) {
	const { body } = window.document;
	let renderDOM = window.document.createElement("div");
	body.appendChild(renderDOM);

	ReactDOM.render(
		<RenderComponent />,
		renderDOM,
		() => {
			callback();
			if (lifeTime) {
				setTimeout(() => {
					body.removeChild(renderDOM);
					renderDOM = null;
					removeCallback();
				}, lifeTime);
			}
		}
	);
};
