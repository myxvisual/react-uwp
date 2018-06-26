import * as React from "react";
import * as PropTypes from "prop-types";

import * as tinycolor from "tinycolor2";
import getStripedBackground from "react-uwp/styles/getStripedBackground";
import Wrapper from "../Wrapper";
import Icon from "react-uwp/Icon";
import DocsTreeView from "../DocsTreeView";
import { render } from "../../../../node_modules/@types/react-dom";

export interface DataProps {
  path?: string;
}

export interface WrapperWithCategoriesProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactElement<any>;
}

export interface WrapperWithCategoriesState {
  renderContentWidth?: number | string;
  screenType?: "phone" | "tablet" | "laptop" | "pc";
}

const HEADER_HEIGHT = 60;
const FOOTER_HEIGHT = 260;
const { innerWidth } = window;
let screenType: any;
let renderContentWidth: any;
if (innerWidth < 960) {
  screenType = "phone";
  renderContentWidth = "100%";
} else if (innerWidth >= 960 && innerWidth < 1366) {
  screenType = "tablet";
  renderContentWidth = 960;
} else if (innerWidth >= 1366 && innerWidth < 1920) {
  screenType = "laptop";
  renderContentWidth = 1280;
} else {
  screenType = "pc";
  renderContentWidth = 1600;
}

export default class WrapperWithCategories extends React.Component<WrapperWithCategoriesProps, WrapperWithCategoriesState> {
  static defaultProps: WrapperWithCategoriesProps = {
    path: "/"
  };
  state: WrapperWithCategoriesState = {
    renderContentWidth,
    screenType
  };

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
    const notPhoneTablet = screenType !== "phone" && screenType !== "tablet";
    const styles = getStyles(this);

    return (
      <Wrapper onChangeRenderContentWidth={this.handleChangeRenderContentWidth}>
        <div style={styles.wrapper}>
          {notPhoneTablet && <DocsTreeView path={path} />}
          <div style={styles.side}>
            {React.cloneElement(children, { renderContentWidth, screenType })}
          </div>
        </div>
      </Wrapper>
    );
  }
}

function getStyles(wrapperWithCategories: WrapperWithCategories) {
  const {
    context: { theme },
    props: { style },
    state: { screenType, renderContentWidth }
  } = wrapperWithCategories;
  const { prefixStyle } = theme;
  const notPhoneTablet = screenType !== "phone" && screenType !== "tablet";

  return {
    root: prefixStyle({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      ...style
    }) as React.CSSProperties,
    wrapper: prefixStyle({
      display: "flex",
      flexDirection: "row",
      width: renderContentWidth,
      minHeight: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
      margin: "0 auto"
    }),
    side: prefixStyle({
      background: theme.useFluentDesign ? theme.acrylicTexture80.background : theme.altHigh,
      width: notPhoneTablet ? "calc(100% - 320px)" : "100%",
      ...(theme.useFluentDesign ? void 0 : getStripedBackground(4, tinycolor(theme.baseHigh).setAlpha(0.025).toRgbString(), "transparent")),
      minHeight: "100%"
    }) as React.CSSProperties
  };
}
