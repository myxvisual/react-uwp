import * as React from "react";
import * as PropTypes from "prop-types";

import FloatNav from "react-uwp/FloatNav";
import IconButton from "react-uwp/IconButton";

export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { theme } = this.context;
    const staticButtonStyle: React.CSSProperties = {
      background: theme.accent,
      color: "#fff"
    };

    return (
      <div>
        <FloatNav
          style={{ margin: "20px 0" }}
          topNode={[
            <IconButton>HomeSolid</IconButton>
          ]}
          expandedItems={[{
            iconNode: (
              <IconButton hoverStyle={{}} activeStyle={{}}>
                RatingStarFillReducedPaddingHTMLLegacy
              </IconButton>
            ),
            title: "Start"
          }]}
          bottomNode={[
            <IconButton>ScrollChevronUpLegacy</IconButton>
          ]}
        />


        <FloatNav
          style={{ margin: "20px 0" }}
          isFloatRight={false}
          focusItemIndex={1}
          topNode={[
            <IconButton
              style={staticButtonStyle}
              hoverStyle={staticButtonStyle}
              activeStyle={staticButtonStyle}
            >
              SettingsLegacy
            </IconButton>
          ]}
          expandedItems={[{
            iconNode: (
              <IconButton hoverStyle={{}} activeStyle={{}}>
                RatingStarFillReducedPaddingHTMLLegacy
              </IconButton>
            )
          }, {
            iconNode: (
              <IconButton hoverStyle={{}} activeStyle={{}}>
                WebcamLegacy
              </IconButton>
            ),
            title: "Start"
          }, {
            iconNode: (
              <IconButton hoverStyle={{}} activeStyle={{}}>
                HomeSolid
              </IconButton>
            ),
            title: "Jump to Home",
            href: "/"
          }]}
          bottomNode={[
            <IconButton
              style={staticButtonStyle}
              hoverStyle={staticButtonStyle}
              activeStyle={staticButtonStyle}
            >
              ScrollChevronUpLegacy
            </IconButton>
          ]}
        />
      </div>
    );
  }
}
