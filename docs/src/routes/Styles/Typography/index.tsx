import * as React from "react";
import * as PropTypes from "prop-types";

import MarkdownRender from "react-uwp/MarkdownRender";

import * as readmeDoc from "!raw!./README.md";

export interface DataProps {}

export interface TypographyProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export default class Typography extends React.Component<TypographyProps> {
  static defaultProps: TypographyProps = {
    style: {
      padding: 20
    }
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  renderTypographyItem = (name: string, style: React.CSSProperties) => {
    const { theme } = this.context;
    const itemStyle: React.CSSProperties = theme.prefixStyle({
      flex: "1 1 auto",
      minWidth: "25%",
      textAlign: "left"
    });
    return <div
      style={theme.prefixStyle({
        ...style,
        display: "flex",
        margin: "20px 0",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        textTransform: "capitalize"
      })}
    >
      <p style={itemStyle}>{name}</p>
      <p style={itemStyle}>{style.fontWeight}</p>
      <p style={itemStyle}>{style.fontSize === "fontSize" ? "fontSize" : `${style.fontSize}px`}</p>
      <p style={itemStyle}>{style.lineHeight}</p>
    </div>;
  }

  render() {
    const {
      ...attributes
    } = this.props;
    const { theme } = this.context;

    const groupStyle: React.CSSProperties = {
      margin: "80px 0"
    };

    return (
      <div {...attributes}>
        <div style={groupStyle}>
          {this.renderTypographyItem("", {
            fontWeight: "fontWeight",
            fontSize: "fontSize",
            lineHeight: "lineHeight"
          } as any)}
          {this.renderTypographyItem("header", theme.typographyStyles.header)}
          {this.renderTypographyItem("subHeader", theme.typographyStyles.subHeader)}
        </div>
        <div style={groupStyle}>
          {this.renderTypographyItem("title", theme.typographyStyles.title)}
          {this.renderTypographyItem("subTitle", theme.typographyStyles.subTitle)}
          {this.renderTypographyItem("subTitleAlt", theme.typographyStyles.subTitleAlt)}
        </div>
        <div style={groupStyle}>
          {this.renderTypographyItem("base", theme.typographyStyles.base)}
          {this.renderTypographyItem("baseAlt", theme.typographyStyles.baseAlt)}
          {this.renderTypographyItem("body", theme.typographyStyles.body)}
        </div>
        <div style={groupStyle}>
          {this.renderTypographyItem("captionAlt", theme.typographyStyles.captionAlt)}
          {this.renderTypographyItem("caption", theme.typographyStyles.caption)}
        </div>
        <MarkdownRender text={readmeDoc as any} />
      </div>
    );
  }
}
