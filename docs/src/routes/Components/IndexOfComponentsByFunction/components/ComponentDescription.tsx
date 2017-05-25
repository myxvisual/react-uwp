import * as React from "react";

import MarkdownRender from "../../../../components/MarkdownRender";
import DoubleThemeRender from "../../../../components/DoubleThemeRender";

export interface DataProps {
  description?: string;
  themeStyle?: React.CSSProperties;
  direction?: "column" | "row";
  isChromeMode?: boolean;
}

export interface ComponentDescriptionProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class ComponentDescription extends React.Component<ComponentDescriptionProps, void> {
  static defaultProps: ComponentDescriptionProps = {
    style: { margin: "10px 0" }
  };

  render() {
    const {
      description,
      children,
      themeStyle,
      direction,
      isChromeMode,
      ...attributes
    } = this.props;
    return (children ? (
      <div {...attributes}>
        <MarkdownRender text={description} />
        <DoubleThemeRender
          useBorder={!isChromeMode}
          useChromeColor={isChromeMode}
          direction={direction}
          style={{
            margin: "10px 0",
            width: "100%"
          }}
          themeStyle={{
            width: "100%",
            padding: "20px 0",
            minHeight: void 0,
            ...themeStyle
          }}
        >
          {children}
        </DoubleThemeRender>
      </div>
    ) : (
        <MarkdownRender
          {...attributes}
          text={description}
        />
    ));
  }
}
