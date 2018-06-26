import * as React from "react";
import * as PropTypes from "prop-types";
import RevealItem from "./RevealItem";
import checkIntersects from "./checkIntersects";

export interface DataProps {
  hoverSize?: number;
  hoverColor?: string;
  borderColor?: string;
  glowColor?: string;
  glowSize?: string;
}

export interface RevealContainerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface RevealContainerState {}

export class RevealContainer extends React.Component<RevealContainerProps, RevealContainerState> {
  static defaultProps: RevealContainerProps = {};

  state: RevealContainerState = {};
  config: DataProps = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  revealEls: HTMLDivElement[] = [];

  componentDidMount() {
    let {
      hoverSize,
      hoverColor,
      borderColor,
      glowColor,
      glowSize
    } = this.props;
    const { theme } = this.context;
    const setDefaultValue = (a: any, value: any) => a = (a === void 0 ? value : a);
    hoverSize = setDefaultValue(hoverSize, 30);
    hoverColor = setDefaultValue(hoverColor, theme.baseMediumHigh);
    borderColor = setDefaultValue(borderColor, theme.baseMediumHigh);
    glowColor = setDefaultValue(glowColor, theme.baseLow);
    glowSize = setDefaultValue(glowSize, 4);
    this.config = {
      hoverSize,
      hoverColor,
      borderColor,
      glowColor,
      glowSize
    };
    window.addEventListener("mousemove", this.handleMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
  }

  handleMouseMove = (e: MouseEvent) => {
    const {
      hoverSize,
      hoverColor,
      borderColor,
      glowColor,
      glowSize
    } = this.config;
    const { theme: { prefixStyle } } = this.context;
    const { clientX, clientY } = e;
    this.revealEls.forEach(el => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const isIntersects = checkIntersects({
        x: clientX,
        y: clientY,
        r: hoverSize
      }, {
        x: left,
        y: top,
        width,
        height
      });
      if (isIntersects) {
        Object.assign(el.style, prefixStyle({
          border: "double 12px transparent",
          backgroundImage: "radial-gradient(circle at top left, #f00,#3020ff)",
          backgroundOrigin: "border-box",
          backgroundClip: "content-box, border-box"
        } as any));
      } else {
        Object.assign(el.style, prefixStyle({
          borderImage: "",
          borderWidth: "3px",
          borderStyle: "solid"
        } as any));
      }
    });
  }

  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(this.revealEls);
  }

  addRevealEl = (el: HTMLDivElement) => {
    this.revealEls.push(el);
  }

  removeRevealEl = (el: HTMLDivElement) => {
    this.revealEls.splice(this.revealEls.indexOf(el), 1);
  }

  render() {
    const {
      hoverSize,
      hoverColor,
      borderColor,
      glowColor,
      glowSize,
      children,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      styles: inlineStyles,
      className: "RevealContainer"
    });

    return (
      <div
        {...attributes}
        className={styles.root.className}
        onMouseDown={this.handleMouseDown}
      >
        {React.Children.map(children, (child: any, index) => {
          const isRevealItem = child.type && child.type === RevealItem;
          console.log(isRevealItem);
          return (isRevealItem ? React.cloneElement(child, {
            haveContainer: true,
            addEl: this.addRevealEl,
            removeEl: this.removeRevealEl
          }) : child);
        })}
      </div>
    );
  }
}

function getStyles(RevealContainer: RevealContainer) {
  const {
    context: { theme },
    props: { style }
  } = RevealContainer;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      display: "inline-block",
      ...style
    })
  };
}

export default RevealContainer;
