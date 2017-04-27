import * as React from "react";
import * as PropTypes from "prop-types";

import ThemeType from "../styles/ThemeType";

export interface DataProps {}

export interface PopupMenuProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface PopupMenuState {}

export default class PopupMenu extends React.Component<PopupMenuProps, PopupMenuState> {
  static defaultProps: PopupMenuProps = {
  };

  state: PopupMenuState = {};

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
        PopupMenu
      </div>
    );
  }
}

function getStyles(popupMenu: PopupMenu): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = popupMenu;
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
