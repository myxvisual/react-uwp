import * as React from "react";
import * as PropTypes from "prop-types";
import Button from "react-uwp/Button";

export interface DataProps {}

export interface TestProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface TestState {}

export class Test extends React.Component<TestProps, TestState> {
  static defaultProps: TestProps = {};

  state: TestState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <Button>Test</Button>
      </div>
    );
  }
}

function getStyles(Test: Test) {
  const {
    context: { theme },
    props: { style }
  } = Test;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      ...style
    })
  };
}

export default Test;
