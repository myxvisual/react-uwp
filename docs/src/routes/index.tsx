import * as React from "react";
import { Router, RouteComponent, browserHistory } from "react-router";

import Theme from "react-uwp/Theme";
import getTheme from "react-uwp/styles/getTheme";
import Wrapper from "../components/Wrapper";
import WrapperWithCategories from "../components/WrapperWithCategories";

export interface RouterCallback {
  (error: any, component?: any): void;
}
const useFluentDesign = true;
// const desktopBackgroundImage = require("assets/images/blurBackground/camera-1246655_1920.jpg");
const desktopBackgroundImage = require<string>("assets/images/blurBackground/jennifer-bailey-10753.jpg");
const theme = getTheme({ useFluentDesign, desktopBackgroundImage });

export class ThemeWrapper extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <Theme autoSaveTheme theme={theme} needGenerateAcrylic>
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
          const Child = require<any>("./Home").default;
          cb(null, () => (
            <Wrapper>
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
            cb(null, require<any>("./GetStarted").default);
          }, "react-uwp-GetStarted");
        }
      }
    }, {
      path: "server-side-rendering",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./ServerSideRendering").default);
          }, "react-uwp-ServerSideRendering");
        }
      }
    }, {
      path: "ChangeLog",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./ChangeLog").default);
          }, "react-uwp-ChangeLog");
        }
      }
    }, {
      path: "Layout",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Layout").default);
          }, "react-uwp-Layout");
        }
      }
    }, {
      path: "Resources",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Resources").default);
          }, "react-uwp-Resources");
        }
      }
    }, {
      path: "Examples",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Examples").default);
          }, "react-uwp-Examples");
        }
      }
    }, {
      path: "Styles",
      component: CategoriesWrapper,
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
        path: "Acrylic",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/Acrylic").default);
          }, "react-uwp-style-Acrylic");
        }
      }, {
        path: "Animation",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/Animation").default);
          }, "react-uwp-Styles-Animation");
        }
      }, {
        path: "Colors",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/Colors").default);
          }, "react-uwp-Styles-Colors");
        }
      }, {
        path: "Custom-Theme",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/CustomTheme").default);
          }, "react-uwp-Styles-CustomTheme");
        }
      }, {
        path: "Fonts",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/Fonts").default);
          }, "react-uwp-Styles-Fonts");
        }
      }, {
        path: "Styling-Components",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/StylingComponents").default);
          }, "react-uwp-Styles-StylingComponents");
        }
      }, {
        path: "Typography",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Styles/Typography").default);
          }, "react-uwp-Styles-Typography");
        }
      }]
    }, {
      component: CategoriesWrapper,
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
        path: "Animate",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Animate").default);
          }, "react-uwp-Components-Animate");
        }
      }, {
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
        path: "Menu",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Menu").default);
          }, "react-uwp-Components-Menu");
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
        path: "Tabs",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Tabs").default);
          }, "react-uwp-Components-Tabs");
        }
      }, {
        path: "Toast",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Toast").default);
          }, "react-uwp-Components-Toast");
        }
      }, {
        path: "Theme",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/Theme").default);
          }, "react-uwp-Components-Theme");
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
        path: "RatingControl",
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./Components/RatingControl").default);
          }, "react-uwp-Components-RatingControl");
        }
      }]
    }, {
      path: "*",
      component: CategoriesWrapper,
      indexRoute: {
        getComponent: (location: Location, cb: RouterCallback) => {
          require.ensure([], (require) => {
            cb(null, require<any>("./NotFound").default);
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
