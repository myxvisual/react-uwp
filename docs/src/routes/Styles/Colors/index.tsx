import * as React from "react";
import * as PropTypes from "prop-types";

import DropDownMenu from "react-uwp/DropDownMenu";
import SystemColor from "./SystemColor";
import AccentColor from "./AccentColor";

export interface DataProps {}

export interface ColorsProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ColorsState {
  showColorName?: "All" | "System" | "Accent";
}

export default class Colors extends React.Component<ColorsProps, ColorsState> {
  static defaultProps: ColorsProps = {};

  state: ColorsState = {
    showColorName: "All"
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  handleChangeColor = (value: string) => {
    this.setState({
      showColorName: value as any
    });
  }

  render() {
    const {
      className,
      id,
      style
    } = this.props;
    const { showColorName } = this.state;
    const { theme } = this.context;

    return (
      <div
        {...{ className, id }}
        style={theme.prefixStyle({
          padding: 20,
          minHeight: "100%",
          fontSize: 13,
          fontWeight: "lighter",
          ...style
        })}
      >
        <DropDownMenu
          style={{ marginLeft: 10 }}
          itemWidth={300}
          values={[
            "All",
            "Accent",
            "System"
          ]}
          defaultValue={showColorName}
          onChangeValue={this.handleChangeColor}
        />
        {showColorName === "All" ? [
          <SystemColor key="0" />,
          <AccentColor key="1" style={{ margin: "160px 0" }} />
        ] : null}
        {showColorName === "Accent" ? <AccentColor key="2" /> : null}
        {showColorName === "System" ? <SystemColor key="3" /> : null}
      </div>
    );
  }
}
