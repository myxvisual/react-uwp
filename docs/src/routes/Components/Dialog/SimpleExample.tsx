import * as React from "react";
import * as PropTypes from "prop-types";

import Dialog from "react-uwp/Dialog";
import Toggle from "react-uwp/Toggle";
import Button from "react-uwp/Button";

export interface SimpleExampleState {
  showDialog1?: boolean;
  showDialog2?: boolean;
}

export default class SimpleExample extends React.Component<any, SimpleExampleState> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  state: SimpleExampleState = {
    showDialog1: false
  };

  render() {
    const { showDialog1, showDialog2 } = this.state;
    return (
      <div>
        <Toggle
          onToggle={showDialog1 => this.setState({ showDialog1 })}
          defaultToggled={showDialog1}
          label="Toggle Show Dialog 1"
        />
        <Dialog
          defaultShow={showDialog1}
          style={{ zIndex: 400 }}
          onCloseDialog={() => this.setState({ showDialog1: false })}
        >
          Dialog 1
        </Dialog>

        <Toggle
          onToggle={showDialog2 => this.setState({ showDialog2 })}
          defaultToggled={showDialog2}
          label="Toggle Show Dialog 2"
        />
        <Dialog
          defaultShow={showDialog2}
          style={{ zIndex: 400 }}
          onCloseDialog={() => this.setState({ showDialog2: false })}
        >
          <Button>Dialog 2</Button>
        </Dialog>
      </div>
    );
  }
}
