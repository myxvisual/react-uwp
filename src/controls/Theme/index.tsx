import * as React from "react";

import darkTheme from "../../styles/darkTheme";
import ThemeType from "../../styles/ThemeType";

export interface DataProps {
  theme?: ThemeType;
}
export interface ThemeProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class Theme extends React.PureComponent<ThemeProps, void> {
  static childContextTypes = {
    theme: React.PropTypes.object,
  };

  getChildContext() {
    return {
      theme: this.props.theme || darkTheme,
    };
  }

  render() {
    const { children, theme, style, ...attributes } = this.props;

    return (
      <div
        {...attributes}
        style={theme.prepareStyles({
          width: "100%",
          height: "100%",
          ...style
          })
        }
      >
        {children}
      </div>
    );
  }
}
