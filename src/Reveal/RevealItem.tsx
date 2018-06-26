import * as React from "react";
import * as PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

export interface DataProps {
  haveContainer?: boolean;
  addEl?: (el: HTMLElement) => void;
  removeEl?: (el: HTMLElement) => void;
}

export interface RevealItemProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface RevealItemState {}

export class RevealItem extends React.Component<RevealItemProps, RevealItemState> {
  static defaultProps: RevealItemProps = {};

  state: RevealItemState = {};
  rootEl: HTMLDivElement;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  componentDidMount() {
    const { haveContainer, addEl } = this.props;
    if (haveContainer && addEl) {
      addEl((findDOMNode(this) as HTMLDivElement));
    }
  }

  componentWillUnmount() {
    const { haveContainer, removeEl } = this.props;
    if (haveContainer && removeEl) {
      removeEl((findDOMNode(this) as HTMLDivElement));
    }
  }

  render() {
    const {
      children,
      haveContainer,
      addEl,
      removeEl,
      ...attributes } = this.props;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      styles: inlineStyles,
      className: "RevealItem"
    });

    return (
      <div
        {...attributes}
        className={styles.root.className}
        ref={rootEl => this.rootEl}
      >
        {children}
      </div>
    );
  }
}

function getStyles(RevealItem: RevealItem) {
  const {
    context: { theme },
    props: { style }
  } = RevealItem;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      display: "inline-block",
      ...style
    })
  };
}

export default RevealItem;
