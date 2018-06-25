import * as React from "react";
import * as PropTypes from "prop-types";
import { findDOMNode } from "react-dom";

import * as RPlayer from "react-player";

import Control from "./Control";

const ReactPlayer = RPlayer.default as any;

export interface DataProps {
  /**
   * Set MediaPlayer display mode.
   */
  displayMode?: "default" | "minimum" | "reset";
  /**
   * Control show the MediaPlayer controls.
   */
  showControl?: boolean;
  /**
   * The url of a video or song to play.
   */
  url?: string;
  /**
   * Sets the width of the player.
   */
  width?: number;
  /**
   * Sets the height of the player.
   */
  height?: number;
  /**
   * Set to `true` or `false` to pause or play the media.
   */
  playing?: boolean;
  /**
   * Set to `true` or `false` to loop the media.
   */
  loop?: boolean;
  /**
   * Set to `true` or `false` to display native player controls<br />*Note: Vimeo player controls are not configurable and will always display*
   */
  controls?: boolean;
  /**
   * Sets the volume of the appropriate player.
   */
  volume?: number;
  /**
   * Sets the playback rate of the appropriate player.
   */
  playbackRate?: number;
  /**
   * The time between `onProgress` callbacks, in milliseconds.
   */
  progressFrequency?: number;
  /**
   * Configuration object for the SoundCloud player.<br />Set `clientId` to your own SoundCloud app [client Id](https://soundcloud.com/you/apps).<br />Set `showArtwork` to `false` to not load any artwork to display.
   */
  soundcloudConfig?: {
    clientId: string,
    showArtwork: boolean
  };
  /**
   * Configuration object for the YouTube player.<br />Set `playerVars` to override the [default player vars](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5).<br />Set `preload` for [preloading](#preloading).
   */
  youtubeConfig?: {
    playerVars: Object,
    preload: boolean
  };
  /**
   * Configuration object for the Vidme player.<br />Set `format` to use a certain quality of video, when available.
   */
  vimeoConfig?: {
    iframeParams: Object,
    preload: boolean
  };
  /**
   * Configuration object for the file player.<br />Set `attributes` to apply [element attributes](https://developer.mozilla.org/en/docs/Web/HTML/Element/video#Attributes).
   */
  fileConfig?: {
    attributes: Object
  };
  /**
   * Called when media is loaded and ready to play. If `playing` is set to `true`, media will play immediately.
   */
  onReady?: React.ReactEventHandler<HTMLDivElement>;
  /**
   * Called when media starts playing.
   */
  onStart?: React.ReactEventHandler<HTMLDivElement>;
  /**
   * Called when media starts or resumes playing after pausing or buffering.
   */
  onPlay?: React.ReactEventHandler<HTMLDivElement>;
  /**
   * Called when media is paused.
   */
  onPause?: React.ReactEventHandler<HTMLDivElement>;
  /**
   * Called when media starts buffering.
   */
  onBuffer?: React.ReactEventHandler<HTMLDivElement>;
  /**
   * Called when media finishes playing.
   */
  onEnded?: React.ReactEventHandler<HTMLDivElement>;
  /**
   * Called when an error occurs whilst attempting to play media.
   */
  onError?: React.ReactEventHandler<HTMLDivElement>;
  /**
   * Callback containing duration of the media, in seconds.
   */
  onDuration?: React.ReactEventHandler<HTMLDivElement>;
  /**
   * Callback containing progress `played`, `loaded` (fraction), `playedSeconds` and `loadedSeconds`.
   */
  onProgress?: React.ReactEventHandler<HTMLDivElement>;

  className?: string;
  style?: React.CSSProperties;
  onTouchStart?: React.ReactEventHandler<HTMLDivElement>;
  onMouseEnter?: React.ReactEventHandler<HTMLDivElement>;
  onMouseLeave?: React.ReactEventHandler<HTMLDivElement>;
  onMouseMove?: React.ReactEventHandler<HTMLDivElement>;
}

export interface MediaPlayerProps extends DataProps {}

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
    displayMode: "default",
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
  endTimer: any = null;
  reactPlayer: any;

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentDidMount() {
    document.documentElement.addEventListener("keydown", this.handleKeyDown, false);

    document.documentElement.addEventListener("webkitfullscreenchange", this.exitFullScreen, false);
    document.documentElement.addEventListener("mozfullscreenchange", this.exitFullScreen, false);
    document.documentElement.addEventListener("fullscreenchange", this.exitFullScreen, false);
    document.documentElement.addEventListener("MSFullscreenChange", this.exitFullScreen, false);
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener("keydown", this.handleKeyDown, false);

    document.documentElement.removeEventListener("webkitfullscreenchange", this.exitFullScreen, false);
    document.documentElement.removeEventListener("mozfullscreenchange", this.exitFullScreen, false);
    document.documentElement.removeEventListener("fullscreenchange", this.exitFullScreen, false);
    document.documentElement.removeEventListener("MSFullscreenChange", this.exitFullScreen, false);

    clearTimeout(this.mouseMoveTimer);
    clearTimeout(this.showControlTimer);
    clearTimeout(this.endTimer);
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
    const rootElm: any = (findDOMNode(this.reactPlayer) as Element).children[0];
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
    this.endTimer = setTimeout(() => {
      this.setState({
        currPlaying: false,
        currShowControl: true,
        played: 0
      });
    }, 1000);
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
      displayMode,
      className,
      ...attributes
    } = this.props;
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
    const { theme } = this.context;
    const styles = getStyles(this);
    const styleClasses = theme.prepareStyle({
      className: "media-player",
      style: styles.root,
      extendsClassName: className
    });

    return (
      <div
        ref={rootElm => this.rootElm = rootElm}
        {...attributes}
        onMouseEnter={this.handleMouseEnter}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={this.handleTouchStart}
        {...styleClasses}
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
          displayMode={displayMode}
          style={{
            opacity: currShowControl ? 1 : 0,
            zIndex: fullScreenMode ? theme.zIndex.mediaPlayer : void 0,
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
          skipBackAction={() => {
            const currPlayed = played - 0.01;
            this.setState({ played: currPlayed });
            this.reactPlayer.seekTo(currPlayed);
          }}
          skipForwardAction={() => {
            const currPlayed = played + 0.03;
            this.setState({ played: currPlayed });
            this.reactPlayer.seekTo(currPlayed);
          }}
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
  const { prefixStyle } = theme;

  return {
    root: prefixStyle(fullScreenMode ? {
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
