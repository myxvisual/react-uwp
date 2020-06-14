import * as React from "react";
import * as PropTypes from "prop-types";

import Wrapper from "../Wrapper";
import Icon from "react-uwp/Icon";
import DocsTreeView from "../DocsTreeView";
import RevealEffect from "react-uwp/RevealEffect";


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
    const notPhoneTablet = screenType !== "phone" && screenType !== "tablet";
    const styles = getStyles(this);
    const classes = theme.prepareStyles({
      styles,
      className: "WrapperWithCategories"
    });

    return (
      <Wrapper onChangeRenderContentWidth={this.handleChangeRenderContentWidth}>
        <div {...classes.wrapper}>
          {notPhoneTablet && <DocsTreeView path={path} />}
          <div {...classes.docContent}>
            {React.cloneElement(children, { renderContentWidth, screenType })}
            <RevealEffect
              effectEnable="border"
              hoverSize={400}
              borderWidth={1}
              effectRange="all"
            />
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
    docContent: prefixStyle({
      width: notPhoneTablet ? "calc(100% - 320px)" : "100%",
      borderRight: `1px solid ${theme.listLow}`,
      position: "relative",
      minHeight: "100%",
      ...theme.acrylicTexture60.style
    }) as React.CSSProperties
  };
}
