import * as React from "react";
import * as PropTypes from "prop-types";

import ReactLazyLoad from "react-lazyload";
import { DataProps as ReactLazyloadProps } from "react-lazyload";

import Icon from "../Icon";

export interface DataProps {
  isLazyLoad?: boolean;
  useDivContainer?: boolean;
}

export interface ImageProps extends DataProps, ReactLazyloadProps, React.HTMLAttributes<HTMLDivElement> {}

export interface ImageState {
  showEmptyImage?: boolean;
}

class Placeholder extends React.Component<React.HTMLAttributes<HTMLImageElement>, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const { ...attributes } = this.props;
    const { theme } = this.context;
    return (
      <div {...attributes as any} style={{ background: theme.chromeMedium }}>
        <Icon
          style={{
            color: theme.baseMedium,
            fontSize: 80
          }}
          hoverStyle={{}}
        >
          &#xEB9F;
        </Icon>
      </div>
    );
  }
}

export default class Image extends React.Component<ImageProps, ImageState> {
  static defaultProps: ImageProps = {
    isLazyLoad: true,
    useDivContainer: false,
    once: false,
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
      isLazyLoad, useDivContainer,
      once, scroll, offset, overflow, resize, debounce, throttle,
      ...attributes
    } = this.props;
    const placeholder = (attributes.placeholder || <Placeholder {...attributes as any} />) as any;

    const ImageOrDiv = () => (useDivContainer
      ?
      <div
        {...attributes as React.HTMLAttributes<HTMLDivElement>}
        style={{
          background: `url(${attributes.src}) no-repeat center center / cover`,
          ...attributes.style
        }}
      />
      : <img {...attributes as any} onError={this.errorHandler} />
    );

    if (!attributes.src || this.state.showEmptyImage) {
      return isLazyLoad ? placeholder : null;
    }

    if (isLazyLoad) {
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
          placeholder={placeholder}
        >
          <ImageOrDiv />
        </ReactLazyLoad>
      );
    }

    return <ImageOrDiv />;
  }
}
