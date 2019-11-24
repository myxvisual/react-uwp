import * as React from "react";
import * as PropTypes from "prop-types";

import MarkdownRender from "react-uwp/MarkdownRender";
import CodeExample from "components/CodeExample";

import * as readmeDoc1 from "!raw!./README1.md";
import * as readmeDoc2 from "!raw!./README2.md";
import SimpleExample from "./SimpleExample";
import * as SimpleExampleCode from "!raw!./SimpleExample";
import { getTheme } from "react-uwp";

export interface DataProps {}

export interface AcrylicProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class Acrylic extends React.Component<AcrylicProps> {
  static defaultProps: AcrylicProps = {
    style: {
      padding: 20
    }
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      ...attributes
    } = this.props;
    const { theme } = this.context;

    return (
      <div {...attributes}>
        <MarkdownRender text={readmeDoc1 as any} />
        <CodeExample
          title="Simple Examples"
          code={SimpleExampleCode as any}
          useSingleTheme
          newTheme={getTheme({
            themeName: theme.themeName,
            useFluentDesign: true,
            desktopBackgroundImage: require("assets/images/blurBackground/viktor-jakovlev-LL4gcqlNvPU-unsplash.jpg")
          })}
        >
          <SimpleExample />
        </CodeExample>
        <MarkdownRender text={readmeDoc2 as any} />
      </div>
    );
  }
}
