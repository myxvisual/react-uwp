import * as React from "react";
import * as PropTypes from "prop-types";
import RevealItem from "react-uwp/Reveal/RevealItem";
import RevealContainer from "react-uwp/Reveal/RevealContainer";

export interface DataProps {}

export interface RevealProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface RevealState {}

export class Reveal extends React.Component<RevealProps, RevealState> {
  static defaultProps: RevealProps = {};

  state: RevealState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      styles: inlineStyles,
      className: "Reveal"
    });

    return (
      <div
        {...attributes}
        className={styles.root.className}
      >
        <RevealContainer>
          <RevealItem>
            Reveal
          </RevealItem>
        </RevealContainer>
      </div>
    );
  }
}

function getStyles(Reveal: Reveal) {
  const {
    context: { theme },
    props: { style }
  } = Reveal;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      ...style
    })
  };
}

export default Reveal;
