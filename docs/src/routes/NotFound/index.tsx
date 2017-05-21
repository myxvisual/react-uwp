import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";

export interface DataProps {}

export interface NotFoundProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface NotFoundState {}

export default class NotFound extends React.Component<NotFoundProps, NotFoundState> {
  static defaultProps: NotFoundProps = {};

  state: NotFoundState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ThemeType };

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <div>
          <h5>Oops!</h5>
          <h4>We can't seem to find the page you're looking for.</h4>
          <span>Error code: 404</span>
          <span>Here are some website roadmap.</span>
        </div>
        <div>Oops~~</div>
      </div>
    );
  }
}

function getStyles(notFound: NotFound): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = notFound;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      ...style
    })
  };
}
