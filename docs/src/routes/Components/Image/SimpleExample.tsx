import * as React from "react";
import * as PropTypes from "prop-types";

import Image from "react-uwp/Image";

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "auto",
  maxWidth: 320,
  maxHeight: 320,
  margin: 10
};
export default class SimpleExample extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    return (
      <div>
        <Image
          style={imageStyle}
          src={require("./images/cat-649164_1280.jpg")}
        />
        <Image
          useLazyLoad
          style={imageStyle}
          src=""
        />
      </div>
    );
  }
}
