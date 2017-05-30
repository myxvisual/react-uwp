import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface ScrollRevealProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ScrollRevealState {}

export default class ScrollReveal extends React.Component<ScrollRevealProps, ScrollRevealState> {
  static defaultProps: ScrollRevealProps = {};

  state: ScrollRevealState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;

    return (
      <div
        {...attributes}
      >
        ScrollReveal
      </div>
    );
  }
}
