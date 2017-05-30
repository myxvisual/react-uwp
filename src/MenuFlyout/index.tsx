import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface MenuFlyoutProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class MenuFlyout extends React.Component<MenuFlyoutProps, void> {
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
        MenuFlyout
      </div>
    );
  }
}

function getStyles(menuFlyout: MenuFlyout): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = menuFlyout;
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
