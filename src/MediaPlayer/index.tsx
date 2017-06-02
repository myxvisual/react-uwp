import * as React from "react";
import * as PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

import * as RPlayer from "react-player";

import Control from "./Control";

const ReactPlayer = RPlayer as any;

export interface DataProps {
  width?: number;
  height?: number;
  url?: string;
  playing?: boolean;
  loop?: boolean;
  controls?: boolean;
  volume?: number;
  playbackRate?: number;
  progressFrequency?: number;
  soundcloudConfig?: {
    clientId: string,
    showArtwork: boolean
  };
  youtubeConfig?: {
    playerVars: Object,
    preload: boolean
  };
  vimeoConfig?: {
    iframeParams: Object,
    preload: boolean
  };
  fileConfig?: {
    attributes: Object
  };
  onReady?: React.ReactEventHandler<HTMLDivElement>;
  onStart?: React.ReactEventHandler<HTMLDivElement>;
  onPlay?: React.ReactEventHandler<HTMLDivElement>;
  onPause?: React.ReactEventHandler<HTMLDivElement>;
  onBuffer?: React.ReactEventHandler<HTMLDivElement>;
  onEnded?: React.ReactEventHandler<HTMLDivElement>;
  onError?: React.ReactEventHandler<HTMLDivElement>;
  onDuration?: React.ReactEventHandler<HTMLDivElement>;
  onProgress?: React.ReactEventHandler<HTMLDivElement>;

  showControl?: boolean;
}

export interface Attributes {
  [key: string]: any;
}
export interface MediaPlayerProps extends DataProps, Attributes {}

export interface MediaPlayerState {
  currShowControl?: boolean;
  currPlaying?: boolean;
  currVolume?: number;
  currPlayed?: number;
  currLoaded?: number;
  currPlaybackRate?: number;
  fullScreenMode?: boolean;
  duration?: number;
  played?: number;
  loaded?: number;
}

const emptyFunc = () => {};
export class MediaPlayer extends React.Component<MediaPlayerProps, MediaPlayerState> {
  static defaultProps: MediaPlayerProps = {
    width: 640,
    height: 360,
    loop: false,
    showControl: true,
    playing: false,
    volume: 0.8,
    playbackRate: 1.0,
    onTouchStart: emptyFunc,
    onMouseEnter: emptyFunc,
    onMouseLeave: emptyFunc,
    onMouseMove: emptyFunc
  };

  getProps2State = (props: MediaPlayerProps): MediaPlayerState => ({
    currShowControl: props.showControl,
    currPlaying: props.playing,
    currVolume: props.volume,
    currPlaybackRate: props.playbackRate
  })

  state: MediaPlayerState = Object.assign({
    currShowControl: false,
    currPlaying: false,
    currVolume: 0.8,
    currPlayed: 0,
    currLoaded: 0,
    currPlaybackRate: 1.0
  }, this.getProps2State(this.props));

  componentWillReceiveProps(nextProps: MediaPlayerProps) {
    this.setState(
      Object.assign(this.state, this.getProps2State(nextProps))
    );
  }

  rootElm: HTMLDivElement;
  showControlTimer: any = null;
  mouseMoveTimer: any = null;
  reactPlayer: any;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown, false);

    document.addEventListener("webkitfullscreenchange", this.exitFullScreen, false);
    document.addEventListener("mozfullscreenchange", this.exitFullScreen, false);
    document.addEventListener("fullscreenchange", this.exitFullScreen, false);
    document.addEventListener("MSFullscreenChange", this.exitFullScreen, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);

    document.removeEventListener("webkitfullscreenchange", this.exitFullScreen, false);
    document.removeEventListener("mozfullscreenchange", this.exitFullScreen, false);
    document.removeEventListener("fullscreenchange", this.exitFullScreen, false);
    document.removeEventListener("MSFullscreenChange", this.exitFullScreen, false);
  }

  componentWillUpdate() {
    clearTimeout(this.showControlTimer);
  }

  handleMouseEnter = (e?: React.MouseEvent<HTMLDivElement>) => {
    clearTimeout(this.showControlTimer);
    this.toggleShowControl(true);
    this.props.onMouseEnter(e);
  }

  handleMouseLeave = (e?: React.MouseEvent<HTMLDivElement>) => {
    this.showControlTimer = setTimeout(() => {
      this.toggleShowControl(false);
    }, 3500);
    this.props.onMouseLeave(e);
  }

  handleMouseMove = (e?: React.MouseEvent<HTMLDivElement>) => {
    clearTimeout(this.mouseMoveTimer);
    clearTimeout(this.showControlTimer);
    this.mouseMoveTimer = setTimeout(() => {
      this.toggleShowControl(true);
    }, 200);
    this.showControlTimer = setTimeout(() => {
      this.toggleShowControl(false);
    }, 3500);
    this.props.onMouseMove(e);
  }

  handleTouchStart = (e?: React.TouchEvent<HTMLDivElement>) => {
    this.toggleShowControl(true);
    this.props.onTouchStart(e);
  }

  toggleShowControl = (currShowControl?: any) => {
    if (typeof currShowControl === "boolean") {
      if (currShowControl !== this.state.currShowControl) {
        this.setState({ currShowControl });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        currShowControl: !prevState.currShowControl
      }));
    }
  }

  togglePlaying = (currPlaying?: any) => {
    if (typeof currPlaying === "boolean") {
      if (currPlaying !== this.state.currPlaying) {
        this.setState({ currPlaying });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        currPlaying: !prevState.currPlaying
      }));
    }
  }

  handleFullScreenAction = () => {
    if (this.state.fullScreenMode) {
      this.existFullscreen();
    }
    const rootElm: any = findDOMNode(this.reactPlayer).children[0];
    if (rootElm.requestFullscreen) {
      rootElm.requestFullscreen();
    } else if (rootElm.msRequestFullscreen) {
      rootElm.msRequestFullscreen();
    } else if (rootElm.mozRequestFullScreen) {
      rootElm.mozRequestFullScreen();
    } else if (rootElm.webkitRequestFullscreen) {
      rootElm.webkitRequestFullscreen();
    }
    this.setState({ currShowControl: true });
  }

  existFullscreen = () => {
    let document: any = window.document;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 13 || e.keyCode === 27) {
      this.existFullscreen();
    }
  }

  exitFullScreen = () => {
    let document: any = window.document;
    const haveFullScreenElm = document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null;
    if (haveFullScreenElm) {
      this.setState((prevState, prevProps) => ({ fullScreenMode: !this.state.fullScreenMode }));
    }
  }
  handleEnded = () => {
    this.setState({ currPlaying: false });
  }

  render() {
    const {
      width,
      height,
      url,
      playing,
      loop,
      controls,
      volume,
      playbackRate,
      progressFrequency,
      soundcloudConfig,
      youtubeConfig,
      vimeoConfig,
      fileConfig,
      onReady,
      onStart,
      onPlay,
      onPause,
      onBuffer,
      onEnded,
      onError,
      onDuration,
      onProgress,

      showControl,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const {
      currShowControl,
      currPlaying,
      currVolume,
      currPlayed,
      currLoaded,
      currPlaybackRate,
      duration,
      played,
      fullScreenMode
    } = this.state;

    return (
      <div
        ref={rootElm => this.rootElm = rootElm}
        {...attributes}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={this.handleTouchStart}
        style={styles.root}
      >
        <ReactPlayer
          {...{
            width,
            height,
            url,
            playing,
            loop,
            controls,
            volume,
            playbackRate,
            progressFrequency,
            soundcloudConfig,
            youtubeConfig,
            vimeoConfig,
            fileConfig,
            onReady,
            onStart,
            onPlay,
            onPause,
            onBuffer,
            onEnded,
            onError,
            onDuration,
            onProgress
          }}
          onEnded={this.handleEnded}
          onPlay={() => this.setState({ currPlaying: true })}
          onPause={() => this.setState({ currPlaying: false })}
          ref={(reactPlayer: any) => this.reactPlayer = reactPlayer}
          volume={currVolume}
          playing={currPlaying}
          playbackRate={currPlaybackRate}
          onProgress={(state: any) => this.setState({ played: state.played })}
          onDuration={(duration: number) => this.setState({ duration })}
        />
        <Control
          duration={duration}
          played={played}
          style={{
            opacity: currShowControl ? 1 : 0,
            zIndex: 2147483647,
            position: fullScreenMode ? "fixed" : "absolute"
          }}
          fullScreenAction={this.handleFullScreenAction}
          playing={currPlaying}
          playOrPauseAction={() => this.setState((prevState, prevProps) => ({ currPlaying: !prevState.currPlaying }))}
          volume={currVolume}
          onChangeVolume={currVolume => {
            this.setState({ currVolume });
          }}
          onChangePlaybackRate={currPlaybackRate => {
            this.setState({ currPlaybackRate });
          }}
          onChangeSeek={seek => this.reactPlayer.seekTo(seek)}
        />
      </div>
    );
  }
}

function getStyles(mock: MediaPlayer): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style },
    state: { fullScreenMode }
  } = mock;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles(fullScreenMode ? {
      pointerEvents: "all",
      position: "fixed",
      display: "inline-block",
      width: "100%",
      height: "100%",
      fontSize: 14,
      color: theme.baseHigh,
      background: theme.altHigh
    } : {
      pointerEvents: "all",
      position: "relative",
      display: "inline-block",
      fontSize: 14,
      color: theme.baseHigh,
      background: theme.altHigh,
      ...style
    })
  };
}

export default MediaPlayer;
