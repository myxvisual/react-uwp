import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useEffect } from 'react';
import { findDOMNode } from 'react-dom';
import * as RPlayer from 'react-player';
import Control from './MediaPlayer.Control';

const ReactPlayer = RPlayer.default as any;

export interface DataProps {
  displayMode?: "default" | "minimum" | "reset";
  showControl?: boolean;
  url?: string;
  width?: number;
  height?: number;
  playing?: boolean;
  loop?: boolean;
  controls?: boolean;
  volume?: number;
  playbackRate?: number;
  progressFrequency?: number;
  soundcloudConfig?: { clientId: string; showArtwork: boolean };
  youtubeConfig?: { playerVars: Object; preload: boolean };
  vimeoConfig?: { iframeParams: Object; preload: boolean };
  fileConfig?: { attributes: Object };
  onReady?: React.ReactEventHandler<HTMLDivElement>;
  onStart?: React.ReactEventHandler<HTMLDivElement>;
  onPlay?: React.ReactEventHandler<HTMLDivElement>;
  onPause?: React.ReactEventHandler<HTMLDivElement>;
  onBuffer?: React.ReactEventHandler<HTMLDivElement>;
  onEnded?: React.ReactEventHandler<HTMLDivElement>;
  onError?: React.ReactEventHandler<HTMLDivElement>;
  onDuration?: React.ReactEventHandler<HTMLDivElement>;
  onProgress?: React.ReactEventHandler<HTMLDivElement>;
  className?: string;
  style?: React.CSSProperties;
  onTouchStart?: React.ReactEventHandler<HTMLDivElement>;
  onMouseEnter?: React.ReactEventHandler<HTMLDivElement>;
  onMouseLeave?: React.ReactEventHandler<HTMLDivElement>;
  onMouseMove?: React.ReactEventHandler<HTMLDivElement>;
}
export interface MediaPlayerProps extends DataProps {}

const MediaPlayer: React.FC<MediaPlayerProps> = ({
  displayMode = "default",
  width = 640,
  height = 360,
  loop = false,
  showControl = true,
  playing = false,
  volume = 0.8,
  playbackRate = 1.0,
  onTouchStart = () => {},
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  onMouseMove = () => {},
  url,
  controls,
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
  onEnded: propsOnEnded,
  onError,
  onDuration,
  onProgress,
  className,
  style,
  ...attributes
}) => {
  const theme = useTheme();
  const [currShowControl, setCurrShowControl] = useState(showControl);
  const [currPlaying, setCurrPlaying] = useState(playing);
  const [currVolume, setCurrVolume] = useState(volume);
  const [currPlayed, setCurrPlayed] = useState(0);
  const [currLoaded, setCurrLoaded] = useState(0);
  const [currPlaybackRate, setCurrPlaybackRate] = useState(playbackRate);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [played, setPlayed] = useState(0);

  const rootElm = useRef<HTMLDivElement>(null);
  const showControlTimer = useRef<NodeJS.Timeout | null>(null);
  const mouseMoveTimer = useRef<NodeJS.Timeout | null>(null);
  const endTimer = useRef<NodeJS.Timeout | null>(null);
  const reactPlayer = useRef<any>(null);

  // 同步props到state
  useEffect(() => {
    setCurrShowControl(showControl);
    setCurrPlaying(playing);
    setCurrVolume(volume);
    setCurrPlaybackRate(playbackRate);
  }, [showControl, playing, volume, playbackRate]);

  // 生命周期：挂载时添加事件监听
  useEffect(() => {
    document.documentElement.addEventListener("keydown", handleKeyDown, false);
    document.documentElement.addEventListener("webkitfullscreenchange", exitFullScreen, false);
    document.documentElement.addEventListener("mozfullscreenchange", exitFullScreen, false);
    document.documentElement.addEventListener("fullscreenchange", exitFullScreen, false);
    document.documentElement.addEventListener("MSFullscreenChange", exitFullScreen, false);

    return () => {
      document.documentElement.removeEventListener("keydown", handleKeyDown, false);
      document.documentElement.removeEventListener("webkitfullscreenchange", exitFullScreen, false);
      document.documentElement.removeEventListener("mozfullscreenchange", exitFullScreen, false);
      document.documentElement.removeEventListener("fullscreenchange", exitFullScreen, false);
      document.documentElement.removeEventListener("MSFullscreenChange", exitFullScreen, false);

      if (mouseMoveTimer.current) clearTimeout(mouseMoveTimer.current);
      if (showControlTimer.current) clearTimeout(showControlTimer.current);
      if (endTimer.current) clearTimeout(endTimer.current);
    };
  }, []);

  // 组件更新时清理showControl定时器
  useEffect(() => {
    if (showControlTimer.current) clearTimeout(showControlTimer.current);
  });

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showControlTimer.current) clearTimeout(showControlTimer.current);
    setCurrShowControl(true);
    onMouseEnter(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    showControlTimer.current = setTimeout(() => {
      setCurrShowControl(false);
    }, 3500);
    onMouseLeave(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mouseMoveTimer.current) clearTimeout(mouseMoveTimer.current);
    if (showControlTimer.current) clearTimeout(showControlTimer.current);
    mouseMoveTimer.current = setTimeout(() => {
      setCurrShowControl(true);
    }, 200);
    showControlTimer.current = setTimeout(() => {
      setCurrShowControl(false);
    }, 3500);
    onMouseMove(e);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setCurrShowControl(true);
    onTouchStart(e);
  };

  const togglePlaying = (value?: boolean) => {
    setCurrPlaying(prev => value ?? !prev);
  };

  const handleFullScreenAction = () => {
    if (fullScreenMode) {
      existFullscreen();
    }
    const playerElm = findDOMNode(reactPlayer.current) as Element;
    const rootElm: any = playerElm.children[0];
    if (rootElm.requestFullscreen) {
      rootElm.requestFullscreen();
    } else if (rootElm.msRequestFullscreen) {
      rootElm.msRequestFullscreen();
    } else if (rootElm.mozRequestFullScreen) {
      rootElm.mozRequestFullScreen();
    } else if (rootElm.webkitRequestFullscreen) {
      rootElm.webkitRequestFullscreen();
    }
    setCurrShowControl(true);
  };

  const existFullscreen = () => {
    const doc: any = window.document;
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 13 || e.keyCode === 27) {
      existFullscreen();
    }
  };

  const exitFullScreen = () => {
    const doc: any = window.document;
    const haveFullScreenElm = doc.webkitIsFullScreen || doc.mozFullScreen || doc.msFullscreenElement !== null;
    if (haveFullScreenElm) {
      setFullScreenMode(prev => !prev);
    }
  };

  const handleEnded = () => {
    endTimer.current = setTimeout(() => {
      setCurrPlaying(false);
      setCurrShowControl(true);
      setPlayed(0);
    }, 1000);
    propsOnEnded?.({} as any);
  };

  const styles = getStyles(theme, { style, fullScreenMode });
  const styleClasses = theme.prepareStyle({
    className: "media-player",
    style: styles.root,
    extendsClassName: className
  });

  return (
    <div
      ref={rootElm}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      style={styleClasses.style}
      className={styleClasses.className}
      {...attributes}
    >
      <ReactPlayer
        width={width}
        height={height}
        url={url}
        playing={currPlaying}
        loop={loop}
        controls={controls}
        volume={currVolume}
        playbackRate={currPlaybackRate}
        progressFrequency={progressFrequency}
        soundcloudConfig={soundcloudConfig}
        youtubeConfig={youtubeConfig}
        vimeoConfig={vimeoConfig}
        fileConfig={fileConfig}
        onReady={onReady}
        onStart={onStart}
        onPlay={e => { onPlay?.(e); setCurrPlaying(true); }}
        onPause={e => { onPause?.(e); setCurrPlaying(false); }}
        onBuffer={onBuffer}
        onEnded={handleEnded}
        onError={onError}
        onDuration={e => { onDuration?.(e); setDuration(e as unknown as number); }}
        onProgress={e => { 
          onProgress?.(e); 
          setPlayed((e as unknown as { played: number }).played);
        }}
        ref={reactPlayer}
      />
      <Control
        duration={duration}
        played={played}
        displayMode={displayMode}
        style={{
          opacity: currShowControl ? 1 : 0,
          zIndex: fullScreenMode ? theme.zIndex.mediaPlayer : undefined,
          position: fullScreenMode ? "fixed" : "absolute"
        }}
        fullScreenAction={handleFullScreenAction}
        playing={currPlaying}
        playOrPauseAction={() => setCurrPlaying(prev => !prev)}
        volume={currVolume}
        onChangeVolume={setCurrVolume}
        onChangePlaybackRate={setCurrPlaybackRate}
        onChangeSeek={seek => reactPlayer.current?.seekTo(seek)}
        skipBackAction={() => {
          const newPlayed = played - 0.01;
          setPlayed(newPlayed);
          reactPlayer.current?.seekTo(newPlayed);
        }}
        skipForwardAction={() => {
          const newPlayed = played + 0.03;
          setPlayed(newPlayed);
          reactPlayer.current?.seekTo(newPlayed);
        }}
      />
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
  fullScreenMode: boolean;
}) => {
  const { style, fullScreenMode } = props;
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
};


export default MediaPlayer;
