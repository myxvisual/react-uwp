import * as React from "react";
import * as PropTypes from "prop-types";

import Icon from "../Icon";
import IconButton from "../IconButton";
import Slider from "../Slider";
import Tooltip from "../Tooltip";
import Flyout from "../Flyout";
import FlyoutContent from "../FlyoutContent";
import ListView from "../ListView";

export interface DataProps {
  playing?: boolean;
  played?: number;
  volume?: number;
  playbackRate?: number;
  duration?: number;

  playOrPauseAction?: () => void;
  fullScreenAction?: () => void;
  skipBackAction?: (backRate?: number) => void;
  skipForwardAction?: (forwardRate?: number) => void;
  onChangePlaybackRate?: (playbackRate?: number) => void;
  onChangeVolume?: (volume?: number) => void;
  onChangeSeek?: (seek?: number) => void;
}

export interface ControlProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}
export interface ControlState {
  showVolumeSlider?: boolean;
  showPlaybackChoose?: boolean;
}

const emptyFunc = () => {};
export default class Control extends React.Component<ControlProps, ControlState> {
  static defaultProps: ControlProps = {
    playOrPauseAction: emptyFunc,
    fullScreenAction: emptyFunc,
    skipBackAction: emptyFunc,
    skipForwardAction: emptyFunc,
    onChangePlaybackRate: emptyFunc,
    onChangeVolume: emptyFunc,
    onChangeSeek: emptyFunc
  };

  state: ControlState = {
    showVolumeSlider: false,
    showPlaybackChoose: false
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  toggleShowPlaybackChoose = (showPlaybackChoose?: any) => {
    if (typeof showPlaybackChoose === "boolean") {
      if (showPlaybackChoose !== this.state.showPlaybackChoose) {
        this.setState({ showPlaybackChoose });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        showPlaybackChoose: !prevState.showPlaybackChoose
      }));
    }
  }

  toggleShowVolumeSlider = (showVolumeSlider?: any) => {
    if (typeof showVolumeSlider === "boolean") {
      if (showVolumeSlider !== this.state.showVolumeSlider) {
        this.setState({ showVolumeSlider });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        showVolumeSlider: !prevState.showVolumeSlider
      }));
    }
  }

  second2HHMMSS = (second: number) => {
    let s: any = (second % 60).toFixed(0);
    let m: any = parseInt(`${second / 60}`);
    m %= 60;
    let h: any = parseInt(`${second / 3600}`);
    if (s < 10) s = `0${s}`;
    if (m < 10) m = `0${m}`;
    if (h < 10) h = `0${h}`;
    return `${h}:${m}:${s}`;
  }

  render() {
    let {
      playing,
      played,
      volume,
      playbackRate,
      duration,

      playOrPauseAction,
      fullScreenAction,
      skipBackAction,
      skipForwardAction,
      onChangePlaybackRate,
      onChangeVolume,
      onChangeSeek,
      ...attributes
    } = this.props;
    const { showPlaybackChoose, showVolumeSlider } = this.state;
    played = played || 0;
    duration = duration || 0;
    const playedValue = played * duration;

    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <div style={styles.sliderContainer}>
          <Slider
            style={{ width: "100%", padding: "0 16px" }}
            initValue={played || 0}
            minValue={0}
            maxValue={1}
            controllerWidth={16}
            customControllerStyle={{
              width: 16,
              height: 16,
              marginTop: 4
            }}
            transition="all .25s"
            onChangeValue={(value) => {
              onChangeSeek(Number(value.toFixed(1)));
            }}
          />
          <span style={{ marginLeft: 16 }}>{this.second2HHMMSS(playedValue)}</span>
          <span style={{ float: "right", marginRight: 16 }}>{this.second2HHMMSS(duration)}</span>
        </div>
        <div style={styles.controlsGroup2}>
          <div>
            <Flyout>
              <IconButton onClick={this.toggleShowVolumeSlider}>
                Volume
              </IconButton>
              <FlyoutContent
                style={{ width: void 0 }}
                isControlled
                show={showVolumeSlider}
                verticalPosition="top"
                horizontalPosition="right"
              >
                <Slider style={{ width: 240 }} onChangeValue={onChangeVolume} initValue={volume} />
              </FlyoutContent>
            </Flyout>
            <Tooltip content="Subtitles">
              <IconButton>Subtitles</IconButton>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Skip Back">
              <IconButton onClick={skipBackAction as any}>SkipBack10</IconButton>
            </Tooltip>
            <IconButton onClick={playOrPauseAction}>{playing ? "Pause" : "Play"}</IconButton>
            <Tooltip content="Skip Forward">
              <IconButton onClick={skipForwardAction as any}>SkipForward30</IconButton>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Full Screen">
              <IconButton onClick={fullScreenAction}>FullScreen</IconButton>
            </Tooltip>
            <Flyout>
              <IconButton onClick={this.toggleShowPlaybackChoose}>
                MoreLegacy
              </IconButton>
              <FlyoutContent
                style={{ width: 120, cursor: "pointer", padding: 0 }}
                isControlled
                show={showPlaybackChoose}
                verticalPosition="top"
                horizontalPosition="left"
              >
                <Tooltip
                  style={{ height: "auto", padding: 0, border: "none"}}
                  margin={0}
                  horizontalPosition="left"
                  contentNode={
                    <ListView
                      style={{ width: 80 }}
                      listSource={[{
                        itemNode: "2x",
                        onClick: () => {
                          onChangePlaybackRate(2);
                          this.toggleShowPlaybackChoose(false);
                        }
                      }, {
                        itemNode: "1.5x",
                        onClick: () => {
                          onChangePlaybackRate(1.5);
                          this.toggleShowPlaybackChoose(false);
                        }
                      }, {
                        itemNode: "1.25x",
                        onClick: () => {
                          onChangePlaybackRate(1.25);
                          this.toggleShowPlaybackChoose(false);
                        }
                      }, {
                        itemNode: "Normal",
                        onClick: () => {
                          onChangePlaybackRate(1);
                          this.toggleShowPlaybackChoose(false);
                        }
                      }, {
                        itemNode: "0.75x",
                        onClick: () => {
                          onChangePlaybackRate(0.75);
                          this.toggleShowPlaybackChoose(false);
                        }
                      }, {
                        itemNode: "0.5x",
                        onClick: () => {
                          onChangePlaybackRate(0.5);
                          this.toggleShowPlaybackChoose(false);
                        }
                      }]}
                    />
                }>
                  <div style={{ padding: 8, width: 120 }}>
                    <span>
                      Playback Rate
                    </span>
                    <Icon>
                      ScrollChevronRightLegacy
                    </Icon>
                  </div>
                  <FlyoutContent
                    margin={0}
                    style={{ width: 60,  padding: 0 }}
                    verticalPosition="top"
                    horizontalPosition="left"
                  >
                  </FlyoutContent>
                </Tooltip>
              </FlyoutContent>
            </Flyout>
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
      transition: "all .75s ease-in-out",
      ...style
    }),
    sliderContainer: {
      overflow: "hidden",
      position: "relative",
      height: 48
    },
    controlsGroup2: prepareStyles({
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    })
  };
}
