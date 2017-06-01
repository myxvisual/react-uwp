import * as React from "react";
import * as PropTypes from "prop-types";

import IconButton from "../IconButton";
import Slider from "../Slider";
import Tooltip from "../Tooltip";

export interface DataProps {
  playing?: boolean;
}

export interface ControlProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class Control extends React.Component<ControlProps, void> {
  static defaultProps: ControlProps = {};

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
        <div style={styles.sliderContainer}>
          <Slider
            style={{ width: "100%" }}
            controllerWidth={16}
            customControllerStyle={{
              width: 16,
              height: 16,
              marginTop: 4
            }}
          />
          <span>00:00:00</span>
          <span style={{ float: "right" }}>00:00:00</span>
        </div>
        <div style={styles.controlsGroup2}>
          <div>
            <IconButton>Volume</IconButton>
            <Tooltip content="Subtitles">
              <IconButton>Subtitles</IconButton>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="SkipBack 10">
              <IconButton>SkipBack10</IconButton>
            </Tooltip>
            <IconButton>Play</IconButton>
            <Tooltip content="SkipForward 30">
              <IconButton>SkipForward30</IconButton>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Full Screen">
              <IconButton>FullScreen</IconButton>
            </Tooltip>
            <IconButton>MoreLegacy</IconButton>
          </div>
        </div>
      </div>
    );
  }
}

function getStyles(mock: Control): {
  root?: React.CSSProperties;
  sliderContainer?: React.CSSProperties;
  controlsGroup2?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = mock;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      position: "absolute",
      height: 96,
      left: 0,
      bottom: 0,
      width: "100%",
      fontSize: 14,
      color: theme.baseHigh,
      backgroundImage: `linear-gradient(transparent, ${theme.altMedium})`,
      ...style
    }),
    sliderContainer: {
      overflow: "hidden",
      position: "relative",
      height: 48,
      padding: "0 8px"
    },
    controlsGroup2: prepareStyles({
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    })
  };
}
