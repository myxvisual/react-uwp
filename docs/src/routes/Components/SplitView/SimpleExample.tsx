import * as React from "react";
import * as PropTypes from "prop-types";

import SplitView, { SplitViewPane } from "react-uwp/SplitView";
import Toggle from "react-uwp/Toggle";
import DropDownMenu from "react-uwp/DropDownMenu";

export interface SimpleExampleState {
  expanded?: boolean;
  displayMode?: "compact" | "overlay";
}

export default class SimpleExample extends React.Component<{}, SimpleExampleState> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  state: SimpleExampleState = {
    expanded: true,
    displayMode: "compact"
  };

  render() {
    const { expanded, displayMode } = this.state;

    return (
      <div style={{ width: "100%" }}>
        <SplitView
          defaultExpanded={expanded}
          displayMode={displayMode}
          style={{
            width: "85%",
            height: 640,
            margin: "0 auto"
          }}
        >
          <div>
            <div>
              <Toggle
                label="Toggle SplitView"
                defaultToggled={expanded}
                background="none"
                onToggle={expanded => { this.setState({ expanded }); }}
              />
            </div>
            <DropDownMenu
              values={["compact", "overlay"]}
              defaultValue={displayMode}
              onChangeValue={(displayMode: any) => { this.setState({ displayMode }); }}
            />
          </div>

          <SplitViewPane>SplitViewPane</SplitViewPane>
        </SplitView>
      </div>
    );
  }
}
