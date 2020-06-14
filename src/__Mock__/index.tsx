import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface MockProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface MockState {}

export class Mock extends React.Component<MockProps, MockState> {
  static defaultProps: MockProps = {};

  state: MockState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const classes = theme.prepareStyles({
      styles,
      className: "Mock"
    });

    return (
      <div
        {...attributes}
        {...classes}
      >
        Mock
      </div>
    );
  }
}

function getStyles(mock: Mock) {
  const {
    context: { theme },
    props: { style }
  } = mock;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      ...style
    })
  };
}

export default Mock;
