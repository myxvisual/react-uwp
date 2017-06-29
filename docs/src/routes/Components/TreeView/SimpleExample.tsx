import * as React from "react";
import * as PropTypes from "prop-types";

import TreeView, { TreeItem } from "react-uwp/TreeView";
import Icon from "react-uwp/Icon";
import CheckBox from "react-uwp/CheckBox";
import Toggle from "react-uwp/Toggle";
import Slider from "react-uwp/Slider";
import DropDownMenu from "react-uwp/DropDownMenu";

export interface SimpleExampleState {
  showHeaderIcon?: boolean;
  showItemIcon?: boolean;
  iconDirection?: "left" | "right";
  itemHeight?: number;
}

const baseStyle: React.CSSProperties = {
  margin: "10px 10px 10px 0"
};
export default class SimpleExample extends React.Component<{}, SimpleExampleState> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  state: SimpleExampleState = {
    showHeaderIcon: false,
    showItemIcon: false,
    iconDirection: "left",
    itemHeight: 32
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
        <div style={baseStyle}>
          <Toggle
            style={baseStyle}
            defaultToggled={showHeaderIcon}
            label="Show Header Icon"
            onToggle={showHeaderIcon => this.setState({ showHeaderIcon })}
          />
          <Toggle
            style={baseStyle}
            defaultToggled={showItemIcon}
            label="Show Item Icon"
            onToggle={showItemIcon => this.setState({ showItemIcon })}
          />
          <DropDownMenu
            style={baseStyle}
            values={["left", "right"]}
            defaultValue={iconDirection}
            onChangeValue={(iconDirection: any) => this.setState({ iconDirection })}
          />
          <Slider
            style={{ width: 120, padding: 0, ...baseStyle }}
            minValue={0}
            maxValue={60}
            initValue={itemHeight}
            onChangedValue={itemHeight => this.setState({ itemHeight })}
            showValueInfo
          />
        </div>

        <TreeView
          style={{ height: 640 }}
          iconDirection={iconDirection}
          itemHeight={itemHeight}
          headerIcon={showHeaderIcon && <Icon style={{ fontSize: itemHeight / 3 }}>FolderLegacy</Icon>}
          itemIcon={showItemIcon && <Icon style={{ fontSize: itemHeight / 3 }}>OpenFileLegacy</Icon>}
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
          }] as TreeItem[]}
          showFocus
          background={theme.useFluentDesign ? (
            theme.acrylicTexture40.background
          ) : theme.chromeLow}
        />
      </div>
    );
  }
}
