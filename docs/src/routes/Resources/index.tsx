import * as React from "react";
import * as PropTypes from "prop-types";

import * as tinycolor from "tinycolor2";
import getStripedBackground from "react-uwp/styles/getStripedBackground";
import { WrapperState } from "components/Wrapper";
import Category from "./components/Category";

export interface DataProps {}

export interface ResourcesProps extends DataProps, WrapperState, React.HTMLAttributes<HTMLDivElement> {}

export default class Resources extends React.Component<ResourcesProps> {
  static defaultProps: ResourcesProps = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      renderContentHeight,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div style={styles.root}>
        <Category
          style={styles.category}
          title="DSIGN TOOLKITS"
          description="These toolkits provide controls and layout templates for designing UWP apps."
          links={[{
            title: "Adobe XD toolkit",
            link: "https://aka.ms/adobexdtoolkit"
          }, {
            title: "Adobe Illustrator toolkit",
            link: "https://aka.ms/adobeillustratortoolkit"
          }, {
            title: "Adobe Photoshop toolkit",
            link: "https://aka.ms/adobephotoshoptoolkit"
          }, {
            title: "Framer toolkit (on GitHub)",
            link: "https://aka.ms/framertoolkit"
          }, {
            title: "Sketch toolkit",
            link: "https://aka.ms/sketchtoolkit"
          }]}
        />
        <Category
          style={styles.category}
          leftTopStart
          title="FONTS"
          links={[{
            title: "Segoe UI and MDL2 icon fonts",
            link: "https://aka.ms/SegoeFonts"
          }, {
            title: "Hololens icon font",
            link: "https://aka.ms/hololensiconfont"
          }]}
        />
        <Category
          style={styles.category}
          title="TOOLS"
          description="Tile and icon generator for Adobe Photoshop"
          links={[{
            title: "Download the tile and icon generator",
            link: "http://go.microsoft.com/fwlink/p/?LinkId=760394"
          }]}
        />
      </div>
    );
  }
}

function getStyles(resources: Resources): {
  root?: React.CSSProperties;
  category?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = resources;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      padding: 20,
      height: "100%",
      display: "flex",
      ...getStripedBackground(4, tinycolor(theme.baseHigh).setAlpha(0.025).toRgbString(), "transparent"),
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      ...style
    }),
    category: {
      margin: "80px 0"
    }
  };
}
