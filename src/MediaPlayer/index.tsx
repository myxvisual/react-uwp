import * as React from "react";
import * as PropTypes from "prop-types";

import * as RPlayer from "react-player";

import Control from "./Control";

const ReactPlayer = RPlayer as any;

export interface DataProps {
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
}

export interface MediaPlayerProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface MediaPlayerState {}

export class MediaPlayer extends React.Component<MediaPlayerProps, MediaPlayerState> {
  static defaultProps: MediaPlayerProps = {};

  state: MediaPlayerState = {};
  reactPlayer: any;

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
        <ReactPlayer
          ref={(reactPlayer: any) => this.reactPlayer = reactPlayer}
          url="https://www.youtube.com/watch?v=d46Azg3Pm4c"
          playing={false}
        />
        <Control />
      </div>
    );
  }
}

function getStyles(mock: MediaPlayer): {
  root?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = mock;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
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
