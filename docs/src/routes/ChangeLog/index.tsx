import * as React from "react";
import * as PropTypes from "prop-types";

import MarkdownRender from "react-uwp/MarkdownRender";
import * as changeLogText from "!raw!../../../../CHANGELOG.md";

export interface DataProps {}

export interface ChangeLogProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class ChangeLog extends React.Component<ChangeLogProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      style,
      ...attributes
    } = this.props;
    const { theme } = this.context;

    return (
      <MarkdownRender
        {...attributes}
        style={theme.prefixStyle({ ...style, padding: "0 20px 60px" })}
        text={changeLogText as any}
      />
    );
  }
}
