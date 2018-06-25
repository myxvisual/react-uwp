import * as React from "react";
import * as PropTypes from "prop-types";

const ReactLazyLoad = require("react-lazyload").default;

import Icon from "../Icon";

export interface DataProps {
  /**
   * Toggle LazyLoad mode open, powerful base on [react-lazyload](https://github.com/jasonslyvia/react-lazyload).
   */
  useLazyLoad?: boolean;
  /**
   * Use Div backgroundImage.
   */
  useDivContainer?: boolean;
  /**
   * Once the lazy loaded component is loaded, do not detect scroll/resize event anymore. Useful for images or simple components.
   */
  once?: boolean;
  /**
   * Say if you want to preload a component even if it's 100px below the viewport (user have to scroll 100px more to see this component), you can set `offset` props to `100`. On the other hand, if you want to delay loading a component even if it's top edge has already appeared at viewport, set `offset` to negative number.
   */
  offset?: number | number[];
  /**
   * Listen and react to scroll event.
   */
  scroll?: boolean;
  /**
   * Respond to `resize` event, set it to `true` if you do need LazyLoad listen resize event.
   */
  resize?: boolean;
  /**
   * If lazy loading components inside a overflow container, set this to `true`. Also make sure a `position` property other than `static` has been set to your overflow container.
   */
  overflow?: boolean;
  /**
   * By default, LazyLoad will have all event handlers debounced in 300ms for better performance. You can disable this by setting `debounce` to `false`, or change debounce time by setting a number value.
   */
  debounce?: boolean | number;
  /**
   * If you prefer `throttle` rather than `debounce`, you can set this props to `true` or provide a specific number.
   */
  throttle?: boolean | number;
  src?: string;
  height?: string | number;
}

export interface ImageProps extends React.HTMLAttributes<HTMLDivElement>, DataProps {
  placeholder?: any;
}

export interface ImageState {
  showEmptyImage?: boolean;
}

class Placeholder extends React.Component<React.HTMLAttributes<HTMLImageElement>> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { style, ...attributes } = this.props;
    const { theme } = this.context;
    return (
      <div
        {...attributes as any}
        style={theme.prefixStyle({
          background: theme.chromeMedium,
          padding: 20,
          display: "inline-block",
          verticalAlign: "middle",
          cursor: "default",
          ...style
        })}
      >
        <Icon
          style={{
            color: theme.baseMedium,
            fontSize: 80,
            verticalAlign: "middle",
            display: "block"
          }}
          hoverStyle={{}}
        >
          &#xEB9F;
        </Icon>
      </div>
    );
  }
}

export class Image extends React.Component<ImageProps, ImageState> {
  static defaultProps: ImageProps = {
    useLazyLoad: false,
    useDivContainer: false,
    once: true,
    offset: 0,
    scroll: true,
    overflow: false,
    throttle: 60
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  state: ImageState = {
    showEmptyImage: false
  };

  errorHandler = (e: any) => this.setState({ showEmptyImage: true });

  render() {
    const {
      useLazyLoad,
      useDivContainer,
      once, scroll, offset, overflow, resize, debounce, throttle,
      style,
      placeholder,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const currPlaceholder = (placeholder || <Placeholder style={style} {...attributes as any} />) as any;
    const baseStyle: React.CSSProperties = theme.prefixStyle({
        background: `url(${attributes.src}) no-repeat center center / cover`,
      display: "inline-block",
      verticalAlign: "middle",
      ...style
    });

    const ImageOrDiv = () => (useDivContainer ?
      <div
        {...attributes as React.HTMLAttributes<HTMLDivElement>}
        style={baseStyle}
      />
      : <img {...attributes as any} style={baseStyle} onError={this.errorHandler} />
    );

    if (!attributes.src || this.state.showEmptyImage) {
      return useLazyLoad ? currPlaceholder : null;
    }

    if (useLazyLoad) {
      return (
        <ReactLazyLoad
          {...{
            once,
            scroll,
            offset,
            overflow,
            resize,
            debounce,
            throttle
          }}
          height={attributes.height}
          placeholder={currPlaceholder}
        >
          <ImageOrDiv />
        </ReactLazyLoad>
      );
    }

    return <ImageOrDiv />;
  }
}


export default Image;
