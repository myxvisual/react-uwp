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
            cb(null, require<any>("./Controls/Intro").default);
          }, "app-react-uwp-controls-intro");
        }
      }, {
        path: "index-of-controls-by-function",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Controls/IndexOfControlsByFunction").default);
          }, "app-react-uwp-controls-index-of-controls-by-function");
        }
      }, {
        path: "CommandBar",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Controls/CommandBar").default);
          }, "app-react-uwp-controls-CommandBar");
        }
      }, {
        path: "AutoSuggestBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Controls/AutoSuggestBox").default);
          }, "app-react-uwp-controls-AutoSuggestBox");
        }
      }, {
        path: "Button",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Controls/Button").default);
          }, "app-react-uwp-controls-Button");
        }
      }, {
        path: "CheckBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Controls/CheckBox").default);
          }, "app-react-uwp-controls-CheckBox");
        }
      }, {
        path: "ColorPicker",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Controls/ColorPicker").default);
          }, "app-react-uwp-controls-ColorPicker");
        }
      }]
    }, {
      path: "style",
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
