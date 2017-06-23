import * as React from "react";
import * as PropTypes from "prop-types";

import Toast from "react-uwp/Toast";
import Image from "react-uwp/Image";
import Icon from "react-uwp/Icon";
import TextBox from "react-uwp/TextBox";
import Toggle from "react-uwp/Toggle";

export interface SimpleExampleState {
  showToast1?: boolean;
  showToast2?: boolean;
  showToast3?: boolean;
}

const toggleStyle: React.CSSProperties = {
  margin: 8
};
export default class SimpleExample extends React.Component<{}, SimpleExampleState> {
  static contextTypes = { theme: PropTypes.object };
  state: SimpleExampleState = {
    showToast1: true,
    showToast2: true,
    showToast3: true
  };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { showToast1, showToast2, showToast3 } = this.state;

    return (
      <div>
        <Toggle
          style={toggleStyle}
          defaultToggled={showToast1}
          onToggle={showToast1 => this.setState({ showToast1 })}
          label="Toggle show Toast1"
        />
        <Toggle
          style={toggleStyle}
          defaultToggled={showToast2}
          onToggle={showToast2 => this.setState({ showToast2 })}
          label="Toggle show Toast2"
        />
        <Toggle
          style={toggleStyle}
          defaultToggled={showToast3}
          onToggle={showToast3 => this.setState({ showToast3 })}
          label="Toggle show Toast3"
        />

        {/*
        * Toasts Codes
        */}
        <Toast
          defaultShow={showToast1}
          onToggleShowToast={showToast1 => this.setState({ showToast1 })}
          logoNode={<Image style={{ clipPath: "circle(16px at 16px 16px)" }} src={require("assets/images/icon-32x32.png")} />}
          title="Adaptive Tiles Meeting"
          description={["Conf Room 2001 / Building 135", "10:00 AM - 10:30 AM"]}
          showCloseIcon
        />

        <Toast
          defaultShow={showToast2}
          onToggleShowToast={showToast2 => this.setState({ showToast2 })}
          logoNode={<Icon>ActionCenterNotification</Icon>}
          title="Adam Wilson tagged you in a photo"
          description={["The Enchantments were absolutely spectacular - with Andrew Bares", "Notifications visualizer"]}
          showCloseIcon
        >
          <Image
            style={{ width: "100%", marginTop: 10 }}
            src={require("../FlipView/images/dog-2332240_1280.jpg")}
          />
        </Toast>

        <Toast
          defaultShow={showToast3}
          onToggleShowToast={showToast3 => this.setState({ showToast3 })}
          logoNode={<Icon>ContactSolid</Icon>}
          title="Andrew B."
          closeDelay={5000}
          description={["Shall we meet up at 8?", "Notifications visualizer"]}
          showCloseIcon
        >
          <TextBox placeholder="Type a Reply" style={{ marginTop: 10 }} />
        </Toast>
      </div>
    );
  }
}
