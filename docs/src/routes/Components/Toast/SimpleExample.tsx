import * as React from "react";
import * as PropTypes from "prop-types";

import Toast from "react-uwp/Toast";
import Toggle from "react-uwp/Toggle";

export interface SimpleExampleState {
  showToast1?: boolean;
  showToast2?: boolean;
}

export default class SimpleExample extends React.Component<{}, SimpleExampleState> {
  static contextTypes = { theme: PropTypes.object };
  state: SimpleExampleState = {
    showToast1: true,
    showToast2: false
  };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { showToast1, showToast2 } = this.state;

    return (
      <div>
        <Toggle
          defaultToggled={showToast1}
          onToggle={showToast1 => this.setState({ showToast1 })}
          label="Toggle show Toast1"
        />
        <Toggle
          defaultToggled={showToast2}
          onToggle={showToast2 => this.setState({ showToast2 })}
          label="Toggle show Toast2"
        />

        <Toast
          defaultShow={showToast1}
          onToggleShowToast={showToast1 => this.setState({ showToast1 })}
          showCloseIcon
        >
          Toast1
        </Toast>
        <Toast
          defaultShow={showToast2}
          onToggleShowToast={showToast2 => this.setState({ showToast2 })}
        >
          Toast2
        </Toast>
      </div>
    );
  }
}
