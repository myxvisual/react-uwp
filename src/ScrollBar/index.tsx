import * as React from "react";

export interface DataProps {
  scrollBarStyle?: React.CSSProperties;
  trackStyle?: React.CSSProperties;
  thumbStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  showVerticalBar?: boolean;
  showHorizontalBar?: boolean;
  autoHide?: boolean;
  scrollSpeed?: number;
  iconNode?: any;
}

export interface ScrollBarProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ScrollBarState {
  mouseDowning?: boolean;
}

export default class ScrollBar extends React.Component<ScrollBarProps, ScrollBarState> {
  static defaultProps: ScrollBarProps = {
    children: <div style={{ background: "linear-gradient(0deg, red 0%, blue 100%)", width: 400, height: 800 }}>ScrollBar</div>,
    showHorizontalBar: false,
    showVerticalBar: true,
    scrollBarStyle: {
      width: 10,
      height: "100%",
      background: "#f1f1f1"
    },
    thumbStyle: {
      width: 80,
      background: "#969696"
    },
    iconStyle: {
      background: "#b1b1b1"
    },
    scrollSpeed: 250
  };

  state: ScrollBarState = {
    mouseDowning: false
  };
  loopIconMouseDownTimeOut: any = null;
  translateX: number = 0;
  translateY: number = 0;

  refs: {
    view?: HTMLDivElement;
    thumb?: HTMLDivElement;
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {};

  removeListeners = () => {};

  topIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
    this.scrollTopByStep(true);
    this.state.mouseDowning = true;
  }

  topIconMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    this.state.mouseDowning = true;
    this.iconMouseDown(true);
  }

  bottomIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
    this.scrollTopByStep(false);
    this.state.mouseDowning = true;
  }

  bottomIconMouseDown = () => {
    this.state.mouseDowning = true;
    this.iconMouseDown(false);
  }

  iconMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    clearTimeout(this.loopIconMouseDownTimeOut);
    this.state.mouseDowning = false;
  }

  scrollTopByStep = (toTop: boolean) => {
    const { style } = this.refs.view;
    const newTranslateY = this.translateY + (toTop ? 40 : -40);
    this.translateY = toTop ? (newTranslateY > 0 ? 0 : newTranslateY) : newTranslateY;
    style.transform = `translate3d(0px, ${this.translateY}px, 0px)`;
  }

  iconMouseDown = (toTop: boolean) => {
    this.loopIconMouseDownTimeOut = setTimeout(() => {
      this.scrollTopByStep(toTop);
      if (this.state.mouseDowning) this.iconMouseDown(toTop);
    }, this.props.scrollSpeed / 10);
  }

  render() {
    const {
      showHorizontalBar,
      showVerticalBar,
      scrollBarStyle,
      trackStyle,
      thumbStyle,
      iconStyle,
      scrollSpeed,
      iconNode,
      children,
      autoHide,
      ...attributes
    } = this.props;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <div style={styles.view} ref="view">
          {children}
        </div>
        {showHorizontalBar && (
          <div
            style={{
              ...styles.horizontal,
              height: styles.horizontal.width,
              width: styles.horizontal.height
            }}
          >
            <div style={{ ...styles.icon, top: 0, left: 0 }} />
            <div style={{ ...styles.thumb }} />
            <div style={{ ...styles.icon, top: 0, right: 0 }} />
          </div>
        )}
        {showVerticalBar && (
          <div style={styles.vertical}>
            <div
              onMouseDown={this.topIconMouseDown}
              onMouseUp={this.iconMouseUp}
              onClick={this.topIconClick}
              style={{ ...styles.icon, left: 0, top: 0 }}
            />
            <div style={{ ...styles.thumb, height: styles.thumb.width, width: styles.thumb.height }} />
            <div
              onClick={this.bottomIconClick}
              onMouseDown={this.bottomIconMouseDown}
              onMouseUp={this.iconMouseUp}
              style={{ ...styles.icon, left: 0, bottom: 0 }}
            />
          </div>
        )}
      </div>
    );
  }
}

function getStyles(scrollBar: ScrollBar): {
  root?: React.CSSProperties;
  horizontal?: React.CSSProperties;
  vertical?: React.CSSProperties;
  thumb?: React.CSSProperties;
  view?: React.CSSProperties;
  icon?: React.CSSProperties;
} {
  const { props: { style, scrollBarStyle, trackStyle, thumbStyle, iconStyle, scrollSpeed } } = scrollBar;

  return {
    root: {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      height: "100%",
      ...style
    },
    view: {
      WebkitOverflowScrolling: "touch",
      width: "100%",
      height: "100%",
      transition: `all ${scrollSpeed}ms 0s linear`,
      transform: `translate3d(0px, 0px, 0px)`
    },
    horizontal: {
      ...scrollBarStyle,
      position: "absolute",
      bottom: 0,
      left: 0,
      ...trackStyle,
      paddingLeft: scrollBarStyle.width,
      paddingRight: scrollBarStyle.width
    },
    vertical: {
      ...scrollBarStyle,
      position: "absolute",
      top: 0,
      right: 0,
      ...trackStyle,
      paddingTop: scrollBarStyle.width,
      paddingBottom: scrollBarStyle.width
    },
    thumb: {
      position: "absolute",
      ...scrollBarStyle,
      ...thumbStyle
    },
    icon: {
      zIndex: 1,
      position: "absolute",
      transition: "all .25s 0s ease-in-out",
      ...iconStyle,
      width: scrollBarStyle.width,
      height: scrollBarStyle.width
    }
  };
}
