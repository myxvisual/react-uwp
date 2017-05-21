import * as React from "react";
import { Router, RouteComponent, browserHistory } from "react-router";

import Theme from "react-uwp/Theme";
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
          <Theme autoSaveTheme>
            <Wrapper path={path} containerStyle={containerStyle}>
              {children as any}
            </Wrapper>
          </Theme>
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
        }, "react-uwp-home");
      }
    },
    childRoutes: [{
      path: "components",
      childRoutes: [{
        path: "intro",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Intro").default);
          }, "react-uwp-components-Intro");
        }
      }, {
        path: "index-of-components-by-function",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/IndexOfComponentsByFunction").default);
          }, "react-uwp-components-IndexOfComponentsByFunction");
        }
      }, {
        path: "CommandBar",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/CommandBar").default);
          }, "react-uwp-components-CommandBar");
        }
      }, {
        path: "AutoSuggestBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/AutoSuggestBox").default);
          }, "react-uwp-components-AutoSuggestBox");
        }
      }, {
        path: "Button",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Button").default);
          }, "react-uwp-components-Button");
        }
      }, {
        path: "CheckBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/CheckBox").default);
          }, "react-uwp-components-CheckBox");
        }
      }, {
        path: "ColorPicker",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/ColorPicker").default);
          }, "react-uwp-components-ColorPicker");
        }
      }]
    }, {
      path: "styles",
      childRoutes: [{
        path: "Icons",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/Icons").default);
          }, "react-uwp-style-Icons");
        }
      }]
    }, {
      path: "*",
      getComponent: (location: Location, cb: RouterCallback) => {
        require.ensure([], (require) => {
          cb(null, require<any>("./NotFound").default);
        }, "react-uwp-style-NotFound");
      }
    }]
  };
};
const routes: any = getRoutes();

export { getRoutes, WrapperWithPath };
export default () => <Router history={browserHistory} routes={routes} />;
