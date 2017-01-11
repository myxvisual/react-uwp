import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import Mock from "../index";

it("Mock Test Casesasasd", () => {
	const mock = TestUtils.renderIntoDocument(
		<Mock />
	) as Mock;

	const mockNode = ReactDOM.findDOMNode(mock);

	expect(mockNode.textContent).toEqual("Mock");
});
