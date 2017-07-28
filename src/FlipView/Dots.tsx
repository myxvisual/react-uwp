import * as React from "react";
import * as PropTypes from "prop-types";

import IconButton from "../IconButton";
import Icon from "../Icon";

export interface DotsProps {
  count: number;
  showControl: boolean;
  controlStyle: React.CSSProperties;
  controlContentStyle: React.CSSProperties;
  iconStyle: React.CSSProperties;
  handleSwipeToIndex?: (index?: number) => void;
  defaultFocusSwipeIndex?: number;

  toggleCanAutoSwipe?: (autoSwipe?: any) => void;
  currCanAutoSwipe?: boolean;
}

export interface DotsState {
  focusSwipeIndex?: number;
}

export class Dots extends React.Component<DotsProps, DotsState> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };
  state: DotsState = {
    focusSwipeIndex: this.props.defaultFocusSwipeIndex
  };

  setFocusIndex = (focusSwipeIndex: number) => this.setState({ focusSwipeIndex: focusSwipeIndex % this.props.count });

  render() {
    const {
      count,
      showControl,
      controlStyle,
      controlContentStyle,
      iconStyle,
      handleSwipeToIndex,
      defaultFocusSwipeIndex,
      toggleCanAutoSwipe,
      currCanAutoSwipe
    } = this.props;
    const { focusSwipeIndex } = this.state;
    const { theme } = this.context;

    const styles = theme.prepareStyles({
      className: "flip-view-control",
      styles: {
        controlStyle,
        controlContentStyle
      }
    });

    return (
      count > 1 && showControl && (
        <div {...styles.controlStyle}>
          <div {...styles.controlContentStyle}>
            {Array(count).fill(0).map((numb, index) => (
              <Icon
                style={iconStyle}
                onClick={() => {
                  this.setState({ focusSwipeIndex: index });
                  handleSwipeToIndex(index);
                }}
                key={`${index}`}
              >
                {focusSwipeIndex === index ? "FullCircleMask" : "CircleRing"}
              </Icon>
            ))}
          <IconButton
            style={{ marginLeft: 2 }}
            size={32}
            onClick={toggleCanAutoSwipe}
          >
            {currCanAutoSwipe ? "Pause" : "Play"}
          </IconButton>
          </div>
        </div>
      )
    );
  }
}

export default Dots;
