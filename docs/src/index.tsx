import * as React from "react";
import { RouteComponent } from "react-router";
import Wrapper from "./Wrapper";

export interface RouterCB {
  (error: any, component?: RouteComponent): void;
}

let WrapperWithPath: React.PureComponent<void, void>;

const getRoutes = (path = "/") => {
  WrapperWithPath = class extends React.PureComponent<void, void> {
    render() {
      const { children } = this.props;
      return (
        <Wrapper path={path}>
          {children}
        </Wrapper>
      );
    }
  } as any;

  return {
    path,
    component: WrapperWithPath,
    indexRoute: {
      getComponent(location: Location, cb: RouterCB) {
        require.ensure([], (require) => {
          cb(null, require<any>("./routes/Index").default);
        }, "app-react-uwp-index");
      }
    },
    childRoutes: [{
      path: "design",
      childRoutes: [{
        path: "controls-and-patterns",
        childRoutes: [{
          path: "intro",
          getComponent: (location: Location, cb: RouterCB) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./routes/Controls/Intro").default);
            }, "app-react-uwp-controls-intro");
          }
        }, {
          path: "index-of-controls-by-function",
          getComponent: (location: Location, cb: RouterCB) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./routes/Controls/IndexOfControlsByFunciton").default);
            }, "app-react-uwp-controls-index-of-controls-by-function");
          }
        }, {
          path: "CommandBar",
          getComponent: (location: Location, cb: RouterCB) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./routes/Controls/CommandBar").default);
            }, "app-react-uwp-controls-CommandBar");
          }
        }, {
          path: "AutoSuggestBox",
          getComponent: (location: Location, cb: RouterCB) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./routes/Controls/AutoSuggestBox").default);
            }, "app-react-uwp-controls-AutoSuggestBox");
          }
        }, {
          path: "Button",
          getComponent: (location: Location, cb: RouterCB) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./routes/Controls/Button").default);
            }, "app-react-uwp-controls-Button");
          }
        }, {
          path: "CheckBox",
          getComponent: (location: Location, cb: RouterCB) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./routes/Controls/CheckBox").default);
            }, "app-react-uwp-controls-CheckBox");
          }
        }]
      }, {
        path: "style",
        childRoutes: [{
          path: "Icons",
          getComponent: (location: Location, cb: RouterCB) => {
            require.ensure([], (require) => {
              cb(null, require<any>("./routes/Style/Icons").default);
            }, "app-react-uwp-style-Icons");
          }
        }]
      }]
    }]
  };
};
const routes: any = getRoutes();

export { getRoutes, WrapperWithPath };
export default routes;
