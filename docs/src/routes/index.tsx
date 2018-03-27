import * as React from "react";
import { Router, RouteComponent, browserHistory } from "react-router";

import Theme from "react-uwp/Theme";
import getTheme from "react-uwp/styles/getTheme";
import Wrapper from "../components/Wrapper";
import WrapperWithCategories from "../components/WrapperWithCategories";
import setStaticAcrylicTexture from "common/setStaticAcrylicTexture";

export interface RouterCallback {
  (error: any, component?: any): void;
}

const useFluentDesign = true;
const desktopBackgroundImage = require<string>("assets/images/blurBackground/jennifer-bailey-10753.jpg");
const theme = getTheme({ useFluentDesign, desktopBackgroundImage });

localStorage.setItem("__REACT_UWP__", "");
export class ThemeWrapper extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <Theme
        theme={theme}
        autoSaveTheme
        needGenerateAcrylic={false}
        themeWillUpdate={setStaticAcrylicTexture}
      >
        {children}
      </Theme>
    );
  }
}

function getRoutes(path = "/") {
  const CategoriesWrapper = (props: any) => (
    <WrapperWithCategories path={path}>
      {props.children}
    </WrapperWithCategories>
  );

  return {
    path,
    component: ThemeWrapper,
    indexRoute: {
      getComponent(location: Location, cb: RouterCallback) {
        require.ensure([], (require) => {
          const Child = require("./Home").default;
          cb(null, () => (
            <Wrapper needScreenInfo>
              <Child />
            </Wrapper>
          ));
        }, "react-uwp-home");
      }
    },
    childRoutes: [{
      path: "get-started",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./GetStarted").default);
          }, "react-uwp-GetStarted");
        }
      }
    }, {
      path: "server-side-rendering",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./ServerSideRendering").default);
          }, "react-uwp-ServerSideRendering");
        }
      }
    }, {
      path: "ChangeLog",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./ChangeLog").default);
          }, "react-uwp-ChangeLog");
        }
      }
    }, {
      path: "Layout",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Layout").default);
          }, "react-uwp-Layout");
        }
      }
    }, {
      path: "Resources",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Resources").default);
          }, "react-uwp-Resources");
        }
      }
    }, {
      path: "Showcase",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Showcase").default);
          }, "react-uwp-Showcase");
        }
      }
    }, {
      path: "Styles",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Styles/Colors").default);
          }, "react-uwp-Styles-Colors");
        }
      },
      childRoutes: [{
        path: "Icons",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Styles/Icons").default);
          }, "react-uwp-style-Icons");
        }
      }, {
        path: "Acrylic",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Styles/Acrylic").default);
          }, "react-uwp-style-Acrylic");
        }
      }, {
        path: "Animation",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Styles/Animation").default);
          }, "react-uwp-Styles-Animation");
        }
      }, {
        path: "Colors",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Styles/Colors").default);
          }, "react-uwp-Styles-Colors");
        }
      }, {
        path: "Custom-Theme",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Styles/CustomTheme").default);
          }, "react-uwp-Styles-CustomTheme");
        }
      }, {
        path: "Fonts",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Styles/Fonts").default);
          }, "react-uwp-Styles-Fonts");
        }
      }, {
        path: "Styling-Components",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Styles/StylingComponents").default);
          }, "react-uwp-Styles-StylingComponents");
        }
      }, {
        path: "Typography",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Styles/Typography").default);
          }, "react-uwp-Styles-Typography");
        }
      }]
    }, {
      component: CategoriesWrapper,
      path: "Components",
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            const HomeComponent = require("./Components/IndexOfComponentsByFunction").default;
            cb(null, () => <HomeComponent style={{ padding: 20 }} />);
          }, "react-uwp-Components-IndexOfComponentsByFunction");
        }
      },
      childRoutes: [{
        path: "Animate",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Animate").default);
          }, "react-uwp-Components-Animate");
        }
      }, {
        path: "CommandBar",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/CommandBar").default);
          }, "react-uwp-Components-CommandBar");
        }
      }, {
        path: "AppBarButton",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/AppBarButton").default);
          }, "react-uwp-Components-AppBarButton");
        }
      }, {
        path: "AutoSuggestBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/AutoSuggestBox").default);
          }, "react-uwp-Components-AutoSuggestBox");
        }
      }, {
        path: "Button",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Button").default);
          }, "react-uwp-Components-Button");
        }
      }, {
        path: "CheckBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/CheckBox").default);
          }, "react-uwp-Components-CheckBox");
        }
      }, {
        path: "RadioButton",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/RadioButton").default);
          }, "react-uwp-Components-RadioButton");
        }
      },  {
        path: "Slider",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Slider").default);
          }, "react-uwp-Components-Slider");
        }
      }, {
        path: "ColorPicker",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/ColorPicker").default);
          }, "react-uwp-Components-ColorPicker");
        }
      }, {
        path: "Dialog",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Dialog").default);
          }, "react-uwp-Components-Dialog");
        }
      }, {
        path: "DropDownMenu",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/DropDownMenu").default);
          }, "react-uwp-Components-DropDownMenu");
        }
      }, {
        path: "DatePickers",
        indexRoute: {
          getComponent: (location: Location, cb: RouterCallback) => {
            require.ensure([], (require) => {
              cb(null, require("./Components/DatePickers/CalendarDatePicker").default);
            }, "react-uwp-Components-DatePickers-CalendarDatePicker");
          }
        },
        childRoutes: [{
          path: "CalendarDatePicker",
          getComponent: (location: Location, cb: RouterCallback) => {
            require.ensure([], (require) => {
              cb(null, require("./Components/DatePickers/CalendarDatePicker").default);
            }, "react-uwp-Components-DatePickers-CalendarDatePicker");
          }
        }, {
          path: "CalendarView",
          getComponent: (location: Location, cb: RouterCallback) => {
            require.ensure([], (require) => {
              cb(null, require("./Components/DatePickers/CalendarView").default);
            }, "react-uwp-Components-DatePickers-CalendarView");
          }
        }, {
          path: "DatePicker",
          getComponent: (location: Location, cb: RouterCallback) => {
            require.ensure([], (require) => {
              cb(null, require("./Components/DatePickers/DatePicker").default);
            }, "react-uwp-Components-DatePickers-DatePicker");
          }
        }, {
          path: "TimePicker",
          getComponent: (location: Location, cb: RouterCallback) => {
            require.ensure([], (require) => {
              cb(null, require("./Components/DatePickers/TimePicker").default);
            }, "react-uwp-Components-DatePickers-TimePicker");
          }
        }]
      }, {
        path: "ContentDialog",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/ContentDialog").default);
          }, "react-uwp-Components-ContentDialog");
        }
      }, {
        path: "Flyout",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Flyout").default);
          }, "react-uwp-Components-Flyout");
        }
      }, {
        path: "FloatNav",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/FloatNav").default);
          }, "react-uwp-Components-FloatNav");
        }
      }, {
        path: "FlipView",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/FlipView").default);
          }, "react-uwp-Components-FlipView");
        }
      }, {
        path: "HyperLink",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/HyperLink").default);
          }, "react-uwp-Components-HyperLink");
        }
      }, {
        path: "Icon",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Icon").default);
          }, "react-uwp-Components-Icon");
        }
      }, {
        path: "IconButton",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/IconButton").default);
          }, "react-uwp-Components-IconButton");
        }
      }, {
        path: "Image",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Image").default);
          }, "react-uwp-Components-Image");
        }
      }, {
        path: "ListView",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/ListView").default);
          }, "react-uwp-Components-ListView");
        }
      }, {
        path: "MediaPlayer",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/MediaPlayer").default);
          }, "react-uwp-Components-MediaPlayer");
        }
      }, {
        path: "Menu",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Menu").default);
          }, "react-uwp-Components-Menu");
        }
      }, {
        path: "MarkdownRender",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/MarkdownRender").default);
          }, "react-uwp-Components-MarkdownRender");
        }
      }, {
        path: "NavigationView",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/NavigationView").default);
          }, "react-uwp-Components-NavigationView");
        }
      }, {
        path: "Separator",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Separator").default);
          }, "react-uwp-Components-Separator");
        }
      }, {
        path: "SplitView",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/SplitView").default);
          }, "react-uwp-Components-SplitView");
        }
      }, {
        path: "SplitViewCommand",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/SplitViewCommand").default);
          }, "react-uwp-Components-SplitViewCommand");
        }
      }, {
        path: "Tabs",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Tabs").default);
          }, "react-uwp-Components-Tabs");
        }
      }, {
        path: "Toast",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Toast").default);
          }, "react-uwp-Components-Toast");
        }
      }, {
        path: "Theme",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Theme").default);
          }, "react-uwp-Components-Theme");
        }
      }, {
        path: "ScrollReveal",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/ScrollReveal").default);
          }, "react-uwp-Components-ScrollReveal");
        }
      }, {
        path: "Toggle",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Toggle").default);
          }, "react-uwp-Components-Toggle");
        }
      }, {
        path: "Tooltip",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/Tooltip").default);
          }, "react-uwp-Components-Tooltip");
        }
      }, {
        path: "TransformCard",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/TransformCard").default);
          }, "react-uwp-Components-TransformCard");
        }
      }, {
        path: "TextBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/TextBox").default);
          }, "react-uwp-Components-TextBox");
        }
      }, {
        path: "TreeView",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/TreeView").default);
          }, "react-uwp-Components-TreeView");
        }
      }, {
        path: "ProgressBar",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/ProgressBar").default);
          }, "react-uwp-Components-ProgressBar");
        }
      }, {
        path: "ProgressRing",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/ProgressRing").default);
          }, "react-uwp-Components-ProgressRing");
        }
      }, {
        path: "PasswordBox",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/PasswordBox").default);
          }, "react-uwp-Components-PasswordBox");
        }
      }, {
        path: "RatingControl",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./Components/RatingControl").default);
          }, "react-uwp-Components-RatingControl");
        }
      }]
    }, {
      path: "*",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require("./NotFound").default);
          }, "react-uwp-NotFound");
        }
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

export { getRoutes };
export default () => <Router history={browserHistory} routes={routes} />;
