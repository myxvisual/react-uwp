import * as React from "react";
import * as PropTypes from "prop-types";

import FlyoutContent from "../FlyoutContent";

export interface DataProps {}
export interface FlyoutProps extends DataProps, React.HTMLAttributes<HTMLSpanElement> {}

export default class Flyout extends React.Component<FlyoutProps, void> {

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { style, children, ...attributes } = this.props;
    const { theme } = this.context;
    const flyoutContents: FlyoutContent[] = [];
    const renderChild: any[] = [];
    React.Children.map(children, (child: any) => {
      if (child.type === FlyoutContent) {
        flyoutContents.push(child);
      } else {
        renderChild.push(child);
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
        {flyoutContents}
        {renderChild}
      </div>
    );
  }
}

