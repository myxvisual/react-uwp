import * as React from "react";
import * as PropTypes from "prop-types";

import Flyout from "../Flyout";
import ThemeType from "../styles/ThemeType";

export interface DataProps {}
export interface FlyoutWrapperProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}
export interface FlyoutWrapperState {}

export default class FlyoutWrapper extends React.Component<FlyoutWrapperProps, FlyoutWrapperState> {
  static defaultProps: FlyoutWrapperProps = {  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const { style, children, ...attributes } = this.props;
    const { theme } = this.context;
    const flyouts: Flyout[] = [];
    const contentNodes: any[] = [];
    React.Children.map(children, (child: any) => {
      if (child.type === FlyoutWrapper) {
        flyouts.push(child);
      } else {
        contentNodes.push(child);
      }
    });

    return (
      <div
        {...attributes}
        style={theme.prepareStyles({
          ...style,
          position: "relative"
        })}
      >
        {flyouts}
        <div>
          {contentNodes}
        </div>
      </div>
    );
  }
}

