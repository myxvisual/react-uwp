import * as React from "react";
import { Router, RouteComponent, browserHistory } from "react-router";

import Theme from "react-uwp/Theme";
import getTheme from "react-uwp/styles/getTheme";
import Wrapper from "../components/Wrapper";
import WrapperWithCategories from "../components/WrapperWithCategories";

export interface RouterCallback {
  (error: any, component?: any): void;
}

const blurBackground = require("assets/images/blurBackground/camera-1246655_1920.jpg");
// const blurBackground = require("assets/images/blurBackground/blueberries-2278921_1920.jpg");
const useFluentDesign = false;

let WrapperWithPath: new() => React.Component<any, any>;
class WrapperWithTheme extends React.Component<{}, void> {
  render() {
    const { children } = this.props;
    return (
      <Theme
        autoSaveTheme
        useFluentDesign={useFluentDesign}
        blurBackground={blurBackground}
      >
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
          <Theme
            autoSaveTheme
            useFluentDesign={useFluentDesign}
            blurBackground={blurBackground}
          >
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
        path: "AppBarButton",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/AppBarButton").default);
          }, "react-uwp-Components-AppBarButton");
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
        path: "RadioButton",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/RadioButton").default);
          }, "react-uwp-Components-RadioButton");
        }
      },  {
        path: "Slider",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Slider").default);
          }, "react-uwp-Components-Slider");
        }
      }, {
        path: "ColorPicker",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/ColorPicker").default);
          }, "react-uwp-Components-ColorPicker");
        }
      }, {
        path: "DropDownMenu",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/DropDownMenu").default);
          }, "react-uwp-Components-DropDownMenu");
        }
      }, {
        path: "DatePickers",
        indexRoute: {
          getComponent: (location: Location, cb: RouterCallback) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./Components/DatePickers/CalendarDatePicker").default);
            }, "react-uwp-Components-DatePickers-CalendarDatePicker");
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
        }, {
          path: "DatePicker",
          getComponent: (location: Location, cb: RouterCallback) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./Components/DatePickers/DatePicker").default);
            }, "react-uwp-Components-DatePickers-DatePicker");
          }
        }, {
          path: "TimePicker",
          getComponent: (location: Location, cb: RouterCallback) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./Components/DatePickers/TimePicker").default);
            }, "react-uwp-Components-DatePickers-TimePicker");
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
        path: "FloatNav",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/FloatNav").default);
          }, "react-uwp-Components-FloatNav");
        }
      }, {
        path: "FlipView",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/FlipView").default);
          }, "react-uwp-Components-FlipView");
        }
      }, {
        path: "HyperLink",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/HyperLink").default);
          }, "react-uwp-Components-HyperLink");
        }
      }, {
        path: "Icon",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Icon").default);
          }, "react-uwp-Components-Icon");
        }
      }, {
        path: "IconButton",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/IconButton").default);
          }, "react-uwp-Components-IconButton");
        }
      }, {
        path: "Image",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Image").default);
          }, "react-uwp-Components-Image");
        }
      }, {
        path: "ListView",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/ListView").default);
          }, "react-uwp-Components-ListView");
        }
      }, {
        path: "MediaPlayer",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/MediaPlayer").default);
          }, "react-uwp-Components-MediaPlayer");
        }
      }, {
        path: "MarkdownRender",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/MarkdownRender").default);
          }, "react-uwp-Components-MarkdownRender");
        }
      }, {
        path: "NavigationView",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/NavigationView").default);
          }, "react-uwp-Components-NavigationView");
        }
      }, {
        path: "Separator",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Separator").default);
          }, "react-uwp-Components-Separator");
        }
      }, {
        path: "SplitView",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/SplitView").default);
          }, "react-uwp-Components-SplitView");
        }
      }, {
        path: "SplitViewCommand",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/SplitViewCommand").default);
          }, "react-uwp-Components-SplitViewCommand");
        }
      }, {
        path: "ScrollReveal",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/ScrollReveal").default);
          }, "react-uwp-Components-ScrollReveal");
        }
      }, {
        path: "Toggle",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Toggle").default);
          }, "react-uwp-Components-Toggle");
        }
      }, {
        path: "Tooltip",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Tooltip").default);
          }, "react-uwp-Components-Tooltip");
        }
      }, {
        path: "TextBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/TextBox").default);
          }, "react-uwp-Components-TextBox");
        }
      }, {
        path: "TreeView",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/TreeView").default);
          }, "react-uwp-Components-TreeView");
        }
      }, {
        path: "ProgressBar",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/ProgressBar").default);
          }, "react-uwp-Components-ProgressBar");
        }
      }, {
        path: "ProgressRing",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/ProgressRing").default);
          }, "react-uwp-Components-ProgressRing");
        }
      }, {
        path: "PasswordBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/PasswordBox").default);
          }, "react-uwp-Components-PasswordBox");
        }
      }, {
        path: "RatingsControl",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/RatingsControl").default);
          }, "react-uwp-Components-RatingsControl");
        }
      }]
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
