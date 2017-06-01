import * as React from "react";
import { Router, RouteComponent, browserHistory } from "react-router";

import Theme from "react-uwp/Theme";
import Wrapper from "../components/Wrapper";
import WrapperWithCategories from "../components/WrapperWithCategories";

export interface RouterCallback {
  (error: any, component?: any): void;
}

let WrapperWithPath:  new() => React.Component<any, any>;
class WrapperWithTheme extends React.Component<{}, void> {
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
          }, "react-uwp-Components-IndexOfComponentsByFunction");
        }
      },
      childRoutes: [{
        path: "CommandBar",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/CommandBar").default);
          }, "react-uwp-Components-CommandBar");
        }
      }, {
        path: "AutoSuggestBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/AutoSuggestBox").default);
          }, "react-uwp-Components-AutoSuggestBox");
        }
      }, {
        path: "Button",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Button").default);
          }, "react-uwp-Components-Button");
        }
      }, {
        path: "CheckBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/CheckBox").default);
          }, "react-uwp-Components-CheckBox");
        }
      }, {
        path: "ColorPicker",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/ColorPicker").default);
          }, "react-uwp-Components-ColorPicker");
        }
      }, {
        path: "DatePickers",
        indexRoute: {
          getComponent: (location: Location, cb: RouterCallback) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./Components/DatePickers/CalendarView").default);
            }, "react-uwp-Components-DatePickers-CalendarView");
          }
        },
        childRoutes: [{
          path: "CalendarDatePicker",
          getComponent: (location: Location, cb: RouterCallback) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./Components/DatePickers/CalendarDatePicker").default);
            }, "react-uwp-Components-DatePickers-CalendarDatePicker");
          }
        }, {
          path: "CalendarView",
          getComponent: (location: Location, cb: RouterCallback) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./Components/DatePickers/CalendarView").default);
            }, "react-uwp-Components-DatePickers-CalendarView");
          }
        }]
      }, {
        path: "ContentDialog",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/ContentDialog").default);
          }, "react-uwp-Components-ContentDialog");
        }
      }, {
        path: "Flyout",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Flyout").default);
          }, "react-uwp-Components-Flyout");
        }
      }, {
        path: "FlipView",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/FlipView").default);
          }, "react-uwp-Components-FlipView");
        }
      }]
    }, {
      path: "Styles",
      component: WrapperWithPath,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/Colors").default);
          }, "react-uwp-Styles-Colors");
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
        path: "Animate",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/Animate").default);
          }, "react-uwp-Styles-Animate");
        }
      }, {
        path: "Colors",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/Colors").default);
          }, "react-uwp-Styles-Colors");
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
    },  {
      path: "Layout",
      getComponent: (location: Location, cb: RouterCallback) => {
        require.ensure([], (require) => {
          const Child = require<any>("./Layout").default;
          cb(null, () => (
            <WrapperWithPath>
              <Child />
            </WrapperWithPath>
          ));
        }, "react-uwp-Layout");
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
        }, "react-uwp-NotFound");
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
