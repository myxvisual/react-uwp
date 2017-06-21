import * as React from "react";
import * as PropTypes from "prop-types";

import ContentDialog, { ContentDialogProps } from "react-uwp/ContentDialog";
import Toggle from "react-uwp/Toggle";

export interface SimpleExampleState {
  showDialog?: boolean;
  showStatusBarDialog?: boolean;
}

const wrapperStyle: React.CSSProperties = {
  margin: "10px 0"
};
export default class SimpleExample extends React.Component<{}, SimpleExampleState> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  state: SimpleExampleState = {
    showDialog: false,
    showStatusBarDialog: false
  };

  handleToggle = (showDialog: boolean) => {
    this.setState({ showDialog });
  }

  handleToggleStatusBar = (showStatusBarDialog: boolean) => {
    this.setState({ showStatusBarDialog });
  }

  toggleShowDialog = (showDialog?: any) => {
    if (typeof showDialog === "boolean") {
      if (showDialog !== this.state.showDialog) {
        this.setState({ showDialog });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        showDialog: !prevState.showDialog
      }));
    }
  }

  toggleShowStatusBarDialog = (showStatusBarDialog?: any) => {
    if (typeof showStatusBarDialog === "boolean") {
      if (showStatusBarDialog !== this.state.showStatusBarDialog) {
        this.setState({ showStatusBarDialog });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        showStatusBarDialog: !prevState.showStatusBarDialog
      }));
    }
  }

  render() {
    const { showDialog, showStatusBarDialog } = this.state;
    const props: ContentDialogProps = {
      title: "Delete file permanently?",
      content: "If you delete this file, you won't be able to recover it. Do you want to delete it?"
    };
    const statusBarProps: ContentDialogProps = {
      statusBarTitle: "Status Bar",
      showCloseButton: true,
      ...props
    };
    return (
      <div>
        <div style={wrapperStyle}>
          <Toggle
            checked={showStatusBarDialog}
            label="Toggle Show StatusBarDialog"
            onToggle={this.handleToggleStatusBar}
            defaultToggled={showStatusBarDialog}
          />
          <ContentDialog
            {...statusBarProps}
            defaultShow={showStatusBarDialog}
            primaryButtonAction={this.toggleShowStatusBarDialog}
            secondaryButtonAction={this.toggleShowStatusBarDialog}
            closeButtonAction={this.toggleShowStatusBarDialog}
            onCloseDialog={() => {
              this.setState({ showStatusBarDialog: false });
            }}
          />
        </div>
        <div style={wrapperStyle}>
          <Toggle
            checked={showDialog}
            label="Toggle Show ContentDialog"
            onToggle={this.handleToggle}
            defaultToggled={showDialog}
          />
          <ContentDialog
            {...props}
            defaultShow={showDialog}
            primaryButtonAction={this.toggleShowDialog}
            secondaryButtonAction={this.toggleShowDialog}
            closeButtonAction={this.toggleShowDialog}
            onCloseDialog={() => {
              this.setState({ showDialog: false });
            }}
          />
        </div>
      </div>
    );
  }
}
