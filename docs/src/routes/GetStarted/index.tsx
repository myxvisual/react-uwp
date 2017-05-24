import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";
import MarkdownRender from "components/MarkdownRender";
import * as readMeText from "!raw!./README.md";

export interface DataProps {}

export interface GetStartedProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface GetStartedState {}

export default class GetStarted extends React.Component<GetStartedProps, GetStartedState> {
  static defaultProps: GetStartedProps = {};

  state: GetStartedState = {};

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
        <MarkdownRender text={readMeText as any} />
      </div>
    );
  }
}

function getStyles(GetStarted: GetStarted): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = GetStarted;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      padding: 20,
      ...style
    })
  };
}
