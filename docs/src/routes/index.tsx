import * as React from "react";
import { Router, RouteComponent, browserHistory } from "react-router";

import Theme from "react-uwp/Theme";
import Wrapper from "../components/Wrapper";
import WrapperWithCategories from "../components/WrapperWithCategories";

export interface RouterCallback {
  (error: any, component?: any): void;
}

let WrapperWithPath:  new() => React.Component<any, any>;
class WrapperWithTheme extends React.Component<void, void> {
  render() {
    const { children } = this.props;
    return (
      <Theme autoSaveTheme>
        <Wrapper>
          {children as any}
        </Wrapper>
      </Theme>
    );
  }
}

function getRoutes(path = "/") {

  const getWrapper = () => (
    class extends React.Component<void, void> {
      render() {
        const { children } = this.props;
        return (
          <Theme autoSaveTheme>
            <WrapperWithCategories path={path}>
              {children as any}
            </WrapperWithCategories>
          </Theme>
        );
      }
    }
  );
  WrapperWithPath = getWrapper();

  return {
    path,
    indexRoute: {
      getComponent(location: Location, cb: RouterCallback) {
        require.ensure([], (require) => {
          const Child = require<any>("./Home").default;
          cb(null, () => (
            <WrapperWithTheme>
              <Child />
            </WrapperWithTheme>
          ));
        }, "react-uwp-home");
      }
    },
    childRoutes: [{
      component: WrapperWithPath,
      path: "Components",
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            const HomeComponent = require<any>("./Components/IndexOfComponentsByFunction").default;
            cb(null, () => <HomeComponent style={{ padding: 20 }} />);
          }, "react-uwp-components-IndexOfComponentsByFunction");
        }
      },
      childRoutes: [{
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
      component: WrapperWithPath,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/Colors").default);
          }, "react-uwp-style-Colors");
        }
      },
      childRoutes: [{
        path: "Icons",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/Icons").default);
          }, "react-uwp-style-Icons");
        }
      }, {
        path: "Colors",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/Colors").default);
          }, "react-uwp-style-Colors");
        }
      }]
    }, {
      path: "get-started",
      getComponent: (location: Location, cb: RouterCallback) => {
        require.ensure([], (require) => {
          const Child = require<any>("./GetStarted").default;
          cb(null, () => (
            <WrapperWithPath>
              <Child />
            </WrapperWithPath>
          ));
        }, "react-uwp-get-started");
      }
    }, {
      path: "Resources",
      getComponent: (location: Location, cb: RouterCallback) => {
        require.ensure([], (require) => {
          const Child = require<any>("./Resources").default;
          cb(null, () => (
            <WrapperWithPath>
              <Child />
            </WrapperWithPath>
          ));
        }, "react-uwp-Resources");
      }
    }, {
      path: "Examples",
      getComponent: (location: Location, cb: RouterCallback) => {
        require.ensure([], (require) => {
          const Child = require<any>("./Examples").default;
          cb(null, () => (
            <WrapperWithPath>
              <Child />
            </WrapperWithPath>
          ));
        }, "react-uwp-Examples");
      }
    }, {
      path: "*",
      getComponent: (location: Location, cb: RouterCallback) => {
        require.ensure([], (require) => {
          const Child = require<any>("./NotFound").default;
          cb(null, () => (
            <WrapperWithTheme>
              <Child />
            </WrapperWithTheme>
          ));
        }, "react-uwp-style-NotFound");
      }
    }]
  };
}

const paths = location.pathname.split("/");
const versionPattern = /v\d{1,2}.\d{1,2}.\d{1,2}-?\w*\.?\d{0,2}/;
let version: string;
const rootPath = paths[1];
if (versionPattern.test(rootPath)) {
  version = rootPath;
}
const routes: any = getRoutes(version);

export { getRoutes, WrapperWithPath };
export default () => <Router history={browserHistory} routes={routes} />;
