import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "react-uwp/styles/ThemeType";
import MainTitleCenter from "./MainTitleCenter";

export interface DataProps {}

export interface CategoriesProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class Categories extends React.Component<CategoriesProps, void> {
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
        <MainTitleCenter
          title="Design and UI for UWP Web Apps"
          description={<p>
            React-UWP came about from our love of React and Microsoft's UWP Design.
            <br />
            We want UWP design easier to implementation in web applications
          </p>}
          linkInfo="GET STARTED"
          link="get-started"
        />
      </div>
    );
  }
}

function getStyles(categories: Categories): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = categories;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      ...style
    })
  };
}
