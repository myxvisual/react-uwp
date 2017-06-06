import * as React from "react";
import * as PropTypes from "prop-types";

import TreeView from "react-uwp/TreeView";
import Icon from "react-uwp/Icon";
import CheckBox from "react-uwp/CheckBox";
import Toggle from "react-uwp/Toggle";
import Slider from "react-uwp/Slider";

export interface SimpleExampleState {
  showHeaderIcon?: boolean;
  showItemIcon?: boolean;
  iconDirection?: "left" | "right";
  itemHeight?: number;
}

export default class SimpleExample extends React.Component<{}, SimpleExampleState> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  state: SimpleExampleState = {
    showHeaderIcon: false,
    showItemIcon: false,
    iconDirection: "left",
    itemHeight: 40
  };

  render() {
    const { theme } = this.context;
    const {
      showHeaderIcon,
      showItemIcon,
      iconDirection,
      itemHeight
    } = this.state;

    return (
      <div>
        <div>
          <Toggle
            defaultToggled={showHeaderIcon}
            label="Show Header Icon"
            onToggle={showHeaderIcon => this.setState({ showHeaderIcon })}
          />
          <Toggle
            defaultToggled={showItemIcon}
            label="Show Item Icon"
            onToggle={showItemIcon => this.setState({ showItemIcon })}
          />
          <Slider
            minValue={0}
            maxValue={100}
            initValue={itemHeight}
            onChangedValue={itemHeight => this.setState({ itemHeight })}
            showValueInfo
          />
        </div>

        <TreeView
          iconDirection="left"
          itemHeight={itemHeight}
          headerIcon={showHeaderIcon && <Icon size={itemHeight}>FolderLegacy</Icon>}
          itemIcon={showItemIcon && <Icon size={itemHeight}>OpenFileLegacy</Icon>}
          listSource={[{
            title: "A",
            children: [{
              title: "A-Child1",
              children: [{
                title: "A-Child1-Hidden",
                hidden: true
              }, {
                title: "A-Child1-Child2"
              }]
            }]
          },
          "B", {
            title: "C",
            children: [
              "C-Child-1",
              "C-Child-2"
            ]
          }, {
            title: "D",
            disabled: true
          }]}
          showFocus
          background={theme.chromeLow}
        />
      </div>
    );
  }
}
