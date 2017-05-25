import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";

export interface DataProps {}

export interface ColorsProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ColorsState {}

export default class Colors extends React.Component<ColorsProps, ColorsState> {
  static defaultProps: ColorsProps = {};

  state: ColorsState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const {
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        Colors
      </div>
    );
  }
}

function getStyles(colors: Colors): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = colors;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      ...style
    })
  };
}
