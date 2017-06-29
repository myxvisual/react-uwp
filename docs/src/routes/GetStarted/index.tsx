import * as React from "react";
import * as PropTypes from "prop-types";

import MarkdownRender from "react-uwp/MarkdownRender";
import * as readMe from "!raw!./README.md";
import * as readMe_zh_CN from "!raw!./README.zh-CN.md";

const languageReadMes: any = {
  "zh-CN": readMe_zh_CN,
  "en-US": readMe
};

export interface DataProps {}
export interface GetStartedProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class GetStarted extends React.Component<GetStartedProps> {
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
<<<<<<< HEAD
        style={theme.prefixStyle({ ...style, padding: "0 20px 60px" })}
        text={readMeText as any}
=======
        style={theme.prepareStyles({ ...style, padding: "0 20px 60px" })}
        text={languageReadMes[theme.language] || readMe}
>>>>>>> docs: Add GetStarted zh-CN docs
      />
    );
  }
}
