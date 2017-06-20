import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";

export interface DataProps {
  /**
   * Control show how much `Rating`.
   */
  defaultRating?: number;
  /**
   * Control show `Rating` size.
   */
  maxRating?: number;
  /**
   * Control show custom `Icon`.
   */
  icon?: string;
  /**
   * Control show custom `React.ReactNode`.
   */
  iconNode?: React.ReactNode;
  /**
   * Control custom `Icon Style`.
   */
  iconStyle?: React.CSSProperties;
  /**
   * Control custom `Icon Rated Style`.
   */
  iconRatedStyle?: React.CSSProperties;
  /**
   * `onChange` Rating call back.
   */
  onChangeRating?: (rating?: number) => void;
  /**
   * Control show custom label.
   */
  label?: string;
  /**
   * Control Rating is can't be modified.
   */
  isReadOnly?: boolean;
  /**
   * Set each ratings padding size.(px)
   */
  iconPadding?: number;
}

export interface RatingControlProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface RatingControlState {
  currRating?: number;
}

const emptyFunc = () => {};
export class RatingControl extends React.Component<RatingControlProps, RatingControlState> {
  static defaultProps: RatingControlProps = {
    defaultRating: 2.5,
    maxRating: 5,
    icon: "FavoriteStarFill",
    onChangeRating: emptyFunc,
    iconPadding: 10
  };
  rootElm: HTMLDivElement;

  state: RatingControlState = {
    currRating: this.props.defaultRating
  };

  styles = getStyles(this);

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillReceiveProps(nextProps: RatingControlProps) {
    if (nextProps.defaultRating !== this.state.currRating) {
      this.setState({ currRating: nextProps.defaultRating });
    }
  }

  handleRationClick = (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
    const { iconPadding, maxRating } = this.props;
    const lastIndex = maxRating - 1;
    const clientRect = e.currentTarget.getBoundingClientRect();
    const left = e.clientX - clientRect.left;
    let offset = left / (index === lastIndex ? clientRect.width : clientRect.width - iconPadding);
    if (offset > 1) offset = 1;
    const currRating = index + offset;
    this.setState({ currRating });
    this.props.onChangeRating(currRating);
  }

  renderRatings = (notRated = true) => {
    const { maxRating, iconNode, icon, iconStyle, iconRatedStyle, isReadOnly, iconPadding } = this.props;
    const { currRating } = this.state;
    const { theme } = this.context;
    const ratio = currRating / maxRating;
    const fontSize = iconStyle ? (+Number(iconStyle.fontSize) || 24) : 24;
    const width = fontSize * maxRating + iconPadding * (maxRating - 1);
    const offset = Math.floor(currRating) * (fontSize + iconPadding) + (currRating % 1) * fontSize;
    const lastIndex = maxRating - 1;

    const normalRatings = (
      <div
        style={{
          ...this.styles.ratingsGroup,
          ...(notRated ? void 0 : {
            clipPath: `polygon(0% 0%, ${offset}px 0%, ${offset}px 100%, 0% 100%)`,
            color: theme.accent,
            position: "absolute",
            top: 0,
            left: 0
          } as React.CSSProperties)
        }}
      >
        {Array(maxRating).fill(0).map((zero, index) => (
          iconNode || (
            <Icon
            key={`${index}`}
            style={{
              fontSize: 24,
              paddingRight: index === lastIndex ? 0 : iconPadding,
              ...iconStyle,
              ...(notRated ? void 0 : iconRatedStyle)
            }}
            onClick={isReadOnly ? void 0 : e => {
              this.handleRationClick(e, index);
            }}
          >
            {icon}
          </Icon>
          )
        ))}
      </div>
    );
    return normalRatings;
  }

  render() {
    const {
      defaultRating,
      maxRating,
      icon,
      iconNode,
      iconStyle,
      iconRatedStyle,
      onChangeRating,
      label,
      isReadOnly,
      iconPadding,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    this.styles = styles;

    const normalRender = (
      <div
        {...attributes}
        style={styles.root}
      >
        {this.renderRatings()}
        {this.renderRatings(false)}
      </div>
    );

    return label ? (
      <div style={{ display: "inline-block" }} ref={rootElm => this.rootElm = rootElm}>
        <div
          style={theme.prepareStyles({
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          })}
        >
          {normalRender}
          <span style={{ color: theme.baseMediumHigh }}>{label}</span>
        </div>
      </div>
    ) : normalRender;
  }
}

function getStyles(RatingControl: RatingControl): {
  root?: React.CSSProperties;
  ratingsGroup?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = RatingControl;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      color: theme.baseHigh,
      display: "inline-block",
      position: "relative",
      cursor: "default",
      ...style
    }),
    ratingsGroup: prepareStyles({
      display: "inline-block",
      transition: "all .25s"
    })
  };
}

export default RatingControl;
