import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";
import { WrapperState } from "components/Wrapper";
import Category from "./components/Category";

export interface DataProps {}

export interface ResourcesProps extends DataProps, WrapperState, React.HTMLAttributes<HTMLDivElement> {}

export default class Resources extends React.Component<ResourcesProps, void> {
  static defaultProps: ResourcesProps = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

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
            link: "http://download.microsoft.com/download/1/3/C/13CE5C92-024E-40C8-A867-83D891CC4D39/Adobe%20XD%20design%20toolkit%20for%20UWP%20apps%20v1705.zip"
          }, {
            title: "Adobe Illustrator toolkit",
            link: "http://download.microsoft.com/download/C/C/4/CC478BD5-6469-450D-80EF-52D27EEAD4C4/Adobe%20Illustrator%20design%20toolkit%20for%20UWP%20apps%20v1705.zip"
          }, {
            title: "Adobe Photoshop toolkit",
            link: "http://download.microsoft.com/download/C/D/A/CDA7FC2B-D5EA-48A4-906D-C6F4A4B311BB/Adobe%20Photoshop%20design%20toolkit%20for%20UWP%20apps%20v1705.zip"
          }, {
            title: "Framer toolkit (on GitHub)",
            link: "https://github.com/Microsoft/windows-framer-toolkit"
          }, {
            title: "Sketch toolkit",
            link: "http://download.microsoft.com/download/B/4/C/B4C6B0B9-C8BC-4CE2-A833-DCE89399060E/Sketch%20design%20toolkit%20for%20UWP%20apps%20v1705.zip"
          }]}
        />
        <Category
          style={styles.category}
          leftTopStart
          title="FONTS"
          links={[{
            title: "Segoe UI and MDL2 icon fonts",
            link: "http://download.microsoft.com/download/1/B/C/1BCF071A-78EE-4968-ACBE-15461C274B61/Segoe%20fonts%20v1705.2.zip"
          }, {
            title: "Hololens icon font",
            link: "http://download.microsoft.com/download/3/8/D/38D659E2-4B9C-413A-B2E7-1956181DC427/Hololens-font-v1705.zip"
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
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      padding: 20,
      height: "100%",
      display: "flex",
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
