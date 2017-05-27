import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";

export interface DataProps {}

export interface ResourcesProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ResourcesState {}

export default class Resources extends React.Component<ResourcesProps, ResourcesState> {
  static defaultProps: ResourcesProps = {};

  state: ResourcesState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div style={styles.root}>
        Resources
      </div>
    );
  }
}

function getStyles(resources: Resources): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = resources;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      ...style
    })
  };
}
