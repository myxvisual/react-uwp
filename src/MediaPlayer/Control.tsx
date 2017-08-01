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
  displayMode?: "default" | "minimum" | "reset";
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
    displayMode: "default",
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
      displayMode,
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
      className,
      ...attributes
    } = this.props;
    const { showPlaybackChoose, showVolumeSlider } = this.state;
    const { theme } = this.context;

    played = played || 0;
    duration = duration || 0;
    const playedValue = played * duration;
    const isDefaultMode = displayMode === "default";
    const inlineStyles = getStyles(this);
    const styles = theme.prepareStyles({
      className: "media-player-control",
      styles: inlineStyles
    });

    const playButton = <IconButton onClick={playOrPauseAction}>{playing ? "Pause" : "Play"}</IconButton>;
    const playSlider = (
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
    );
    const volumeButton = (
      <Flyout>
        <IconButton onClick={this.toggleShowVolumeSlider}>
          Volume
        </IconButton>
        <FlyoutContent
          style={theme.prefixStyle({
            width: isDefaultMode ? void 0 : 30
          })}
          isControlled
          show={showVolumeSlider}
          verticalPosition="top"
          horizontalPosition="right"
        >
          <Slider
            displayMode={isDefaultMode ? "horizon" : "vertical"}
            style={{
              width: isDefaultMode ? 240 : 24,
              height: isDefaultMode ? 24 : 120
            }}
            onChangeValue={onChangeVolume}
            initValue={volume}
          />
        </FlyoutContent>
      </Flyout>
    );
    const subtitleButton = (
      <Tooltip content="Subtitles">
        <IconButton>Subtitles</IconButton>
      </Tooltip>
    );
    const moreLegacyButton = (
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
            style={{ height: "auto", padding: 0, border: "none" }}
            margin={0}
            horizontalPosition="left"
            background={theme.chromeLow}
            contentNode={
              <ListView
                background={theme.chromeLow}
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
    );

    return isDefaultMode ? (
      <div
        {...attributes}
        className={theme.classNames(styles.root.className, className)}
        style={styles.root.style}
      >
        <div {...styles.sliderContainer}>
          {playSlider}
          <span style={{ marginLeft: 16 }}>{this.second2HHMMSS(playedValue)}</span>
          <span style={{ float: "right", marginRight: 16 }}>{this.second2HHMMSS(duration)}</span>
        </div>
        <div {...styles.controlsGroup}>
          <div>
            {volumeButton}
            {subtitleButton}
          </div>
          <div>
            <Tooltip content="Skip Back" background={theme.chromeLow}>
              <IconButton onClick={skipBackAction as any}>SkipBack10</IconButton>
            </Tooltip>
            {playButton}
            <Tooltip content="Skip Forward" background={theme.chromeLow}>
              <IconButton onClick={skipForwardAction as any}>SkipForward30</IconButton>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Full Screen" background={theme.chromeLow}>
              <IconButton onClick={fullScreenAction}>FullScreen</IconButton>
            </Tooltip>
            {moreLegacyButton}
          </div>
        </div>
      </div>
    ) : (
      <div {...styles.controlsGroup}>
        {playButton}
        {playSlider}
        {volumeButton}
        {displayMode === "reset" ? subtitleButton : null}
        {moreLegacyButton}
      </div>
    );
  }
}

function getStyles(mock: Control): {
  root?: React.CSSProperties;
  sliderContainer?: React.CSSProperties;
  controlsGroup?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { displayMode, style }
  } = mock;
  const { prefixStyle } = theme;
  const rootStyle: React.CSSProperties = {
    fontSize: 14,
    color: theme.baseHigh,
    height: 96,
    width: "100%",
    position: "absolute",
    left: 0,
    bottom: 0,
    backgroundImage: `linear-gradient(transparent, ${theme.altMedium})`,
    transition: "all .75s",
    ...style
  };

  return {
    root: prefixStyle(rootStyle),
    sliderContainer: {
      overflow: "hidden",
      position: "relative",
      height: 48
    },
    controlsGroup: prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      ...(displayMode !== "default" ? {
        background: theme.altHigh
      } : void 0),
      height: 48
    })
  };
}
