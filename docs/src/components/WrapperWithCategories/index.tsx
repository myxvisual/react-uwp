import * as React from "react";
import * as PropTypes from "prop-types";

import * as tinycolor from "tinycolor2";
import getStripedBackground from "react-uwp/styles/getStripedBackground";
import Wrapper from "../Wrapper";
import Icon from "react-uwp/Icon";
import DocsTreeView from "../DocsTreeView";

export interface DataProps {
  path?: string;
}

export interface WrapperWithCategoriesProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface WrapperWithCategoriesState {
  renderContentWidth?: number | string;
  screenType?: "phone" | "tablet" | "laptop" | "pc";
}

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 260;

export default class WrapperWithCategories extends React.Component<WrapperWithCategoriesProps, WrapperWithCategoriesState> {
  static defaultProps: WrapperWithCategoriesProps = {
    path: "/"
  };
  state: WrapperWithCategoriesState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  handleChangeRenderContentWidth = (
    renderContentWidth?: number | string,
    screenType?: "phone" | "tablet" | "laptop" | "pc"
  ) => {
    this.setState({
      renderContentWidth,
      screenType
    });
  }

  render() {
    const { path, children } = this.props;
    const { renderContentWidth, screenType } = this.state;
    const { theme } = this.context;
    const styles = getStyles(this);
    const notPhoneTablet = screenType !== "phone" && screenType !== "tablet";

    return (
      <Wrapper onChangeRenderContentWidth={this.handleChangeRenderContentWidth}>
        <div
          style={theme.prefixStyle({
            display: "flex",
            flexDirection: "row",
            width: renderContentWidth,
            minHeight: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
            margin: "0 auto"
          })}
        >
          {notPhoneTablet ? <DocsTreeView path={path} /> : null}
          <div
            style={theme.prefixStyle({
              background: theme.useFluentDesign ? theme.acrylicTexture80.background : theme.altHigh,
              width: notPhoneTablet ? "calc(100% - 320px)" : "100%",
              ...(theme.useFluentDesign ? void 0 : getStripedBackground(4, tinycolor(theme.baseHigh).setAlpha(0.025).toRgbString(), "transparent")),
              minHeight: "100%"
            })}
          >
            {React.cloneElement(children as any, { renderContentWidth, screenType })}
          </div>
        </div>
      </Wrapper>
    );
  }
}

function getStyles(wrapperWithCategories: WrapperWithCategories): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = wrapperWithCategories;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      ...style
    })
  };
}
