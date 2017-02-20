import { DataProps } from "./index";
import * as React from "react";

import Separator from "../Separator";

export default {
	items: [{
		itemNode: 1,
		disable: false
	}, {
		itemNode: 2,
		disable: true
	}, {
		itemNode: <Separator />,
		disable: true
	}, {
		itemNode: 3,
		disable: false
	}]
} as DataProps;
