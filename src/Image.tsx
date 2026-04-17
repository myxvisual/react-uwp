import * as React from "react";
import { useContext, useState, useCallback } from "react";
const ReactLazyLoad = require("react-lazyload").default;

import Icon from "./Icon";

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
  placeholder?: any;
}

export type ImageProps = DataProps & React.HTMLAttributes<HTMLDivElement>;

const Image: React.FC<ImageProps> = (props) => {
  const {
    useLazyLoad = false,
    useDivContainer = false,
    once = true,
    offset = 0,
    scroll = true,
    overflow = false,
    throttle = 60,
    resize,
    debounce,
    style,
    placeholder,
    src,
    height,
    ...attributes
  } = props;

  const theme = useContext<ReactUWP.ThemeType>({ theme: {} } as any);
  const [showEmptyImage, setShowEmptyImage] = useState(false);

  const errorHandler = useCallback(() => {
    setShowEmptyImage(true);
  }, []);

  const cls = getCls(theme, props);
  const currPlaceholder = placeholder || <Placeholder style={style} {...attributes} />;

  const ImageOrDiv = () => (
    useDivContainer ? (
      <div {...(attributes as React.HTMLAttributes<HTMLDivElement>)} style={cls.baseStyle} />
    ) : (
      <img {...(attributes as any)} src={src} style={cls.baseStyle} onError={errorHandler} />
    )
  );

  if (!src || showEmptyImage) {
    return useLazyLoad ? currPlaceholder : null;
  }

  if (useLazyLoad) {
    return (
      <ReactLazyLoad
        once={once}
        scroll={scroll}
        offset={offset}
        overflow={overflow}
        resize={resize}
        debounce={debounce}
        throttle={throttle}
        height={height}
        placeholder={currPlaceholder}
      >
        <ImageOrDiv />
      </ReactLazyLoad>
    );
  }

  return <ImageOrDiv />;
};

export default Image;

// Placeholder component
const Placeholder: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const { style, ...attributes } = props;
  const theme = useContext<ReactUWP.ThemeType>({ theme: {} } as any);
  const cls = getPlaceholderCls(theme, style);
  return (
    <div {...attributes} style={cls.wrapper}>
      <Icon style={cls.icon} hoverStyle={{}}>&#xEB9F;</Icon>
    </div>
  );
};

// ------------------------------
// Style generation functions (bottom of file)
// ------------------------------
const getCls = (theme: ReactUWP.ThemeType, props: ImageProps) => {
  const { style, src } = props;
  return {
    baseStyle: theme.prefixStyle({
      background: `url(${src}) no-repeat center center / cover`,
      display: "inline-block",
      verticalAlign: "middle",
      ...style
    })
  };
};

const getPlaceholderCls = (theme: ReactUWP.ThemeType, style?: React.CSSProperties) => {
  return {
    wrapper: theme.prefixStyle({
      background: theme.chromeMedium,
      padding: 20,
      display: "inline-block",
      verticalAlign: "middle",
      cursor: "default",
      ...style
    }),
    icon: theme.prefixStyle({
      color: theme.baseMedium,
      fontSize: 80,
      verticalAlign: "middle",
      display: "block"
    })
  };
};
