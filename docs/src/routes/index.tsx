import * as React from "react";
import { Router, RouteComponent, browserHistory } from "react-router";

import Wrapper from "../components/Wrapper";

export interface RouterCallback {
  (error: any, component?: any): void;
}

let WrapperWithPath: React.PureComponent<void, void>;

const getRoutes = (path = "/") => {
  const getWrapper = (containerStyle?: React.CSSProperties) => (
    class extends React.PureComponent<void, void> {
      render() {
        const { children } = this.props;
        return (
          <Wrapper path={path} containerStyle={containerStyle}>
            {children as any}
          </Wrapper>
        );
      }
    } as any
  );

  WrapperWithPath = getWrapper();

  return {
    path,
    component: WrapperWithPath,
    indexRoute: {
      getComponent(location: Location, cb: RouterCallback) {
        require.ensure([], (require) => {
          cb(null, require<any>("./Home").default);
        }, "app-react-uwp-home");
      }
    },
    childRoutes: [{
      path: "components",
      childRoutes: [{
        path: "intro",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Intro").default);
          }, "app-react-uwp-components-Intro");
        }
      }, {
        path: "index-of-components-by-function",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/IndexOfComponentsByFunction").default);
          }, "app-react-uwp-components-IndexOfComponentsByFunction");
        }
      }, {
        path: "CommandBar",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/CommandBar").default);
          }, "app-react-uwp-components-CommandBar");
        }
      }, {
        path: "AutoSuggestBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/AutoSuggestBox").default);
          }, "app-react-uwp-components-AutoSuggestBox");
        }
      }, {
        path: "Button",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Button").default);
          }, "app-react-uwp-components-Button");
        }
      }, {
        path: "CheckBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/CheckBox").default);
          }, "app-react-uwp-components-CheckBox");
        }
      }, {
        path: "ColorPicker",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/ColorPicker").default);
          }, "app-react-uwp-components-ColorPicker");
        }
      }]
    }, {
      path: "styles",
      component: getWrapper({ padding: 0 }),
      childRoutes: [{
        path: "Icons",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Style/Icons").default);
          }, "app-react-uwp-style-Icons");
        }
      }]
    }, {
      path: "*",
      component: () => <div>Not Found</div>
    }]
  };
};
const routes: any = getRoutes();

export { getRoutes, WrapperWithPath };
export default () => <Router history={browserHistory} routes={routes} />;
