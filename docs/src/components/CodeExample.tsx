import * as React from "react";
import * as ReactDOM from "react-dom";
import * as PropTypes from "prop-types";

import Icon from "react-uwp/Icon";
import Tooltip from "react-uwp/Tooltip";
import MarkdownRender from "react-uwp/MarkdownRender";

import DoubleThemeRender from "./DoubleThemeRender";

export interface DataProps {
  useSingleTheme?: boolean;
  code?: string;
  description?: string;
  doubleThemeStyle?: React.CSSProperties;
  useChromeColor?: boolean;
  direction?: "row" | "column";
  newTheme?: ReactUWP.ThemeType;
}

export interface CodeExampleProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CodeExampleState {
  showCode?: boolean;
}

export default class CodeExample extends React.Component<CodeExampleProps, CodeExampleState> {
  state: CodeExampleState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  mdRender: MarkdownRender;
  toggleShowCode = (showCode?: any) => {
    const el = ReactDOM.findDOMNode(this.mdRender) as HTMLDivElement;
    if (el) {
      const codeEl = el.children[0] as HTMLDivElement;
      const contentEl = codeEl.children[0] as HTMLDivElement;
      const height = `${contentEl.clientHeight + 20}px`;
      if (codeEl.style.height !== height) {
        codeEl.style.height = height;
      } else {
        codeEl.style.height = "0px";
      }
    }
    if (typeof showCode === "boolean") {
      if (showCode !== this.state.showCode) {
        this.setState({ showCode });
      }
    } else {
      this.setState((prevState, prevProps) => ({
        showCode: !prevState.showCode
      }));
    }
  }

  render() {
    const {
      title,
      code,
      description,
      children,
      doubleThemeStyle,
      useChromeColor,
      direction,
      useSingleTheme,
      newTheme,
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const classes = theme.prepareStyles({ styles, className: "CodeExample" });
    const { showCode } = this.state;
    const codeText = `\`\`\`jsx
${code}
\`\`\``;

    return (
      <div
        {...attributes}
        {...classes.root}
      >
        <div style={{ width: "100%", border: `1px solid ${theme.accent}` }}>
          <div onClick={this.toggleShowCode} {...classes.title}>
            <p>{title}</p>
            <Tooltip
              style={{ width: 150 }}
              content={showCode ? "Hide Source Code" : "Show Source Code"}
              verticalPosition="bottom"
              horizontalPosition="left"
            >
              <Icon style={styles.icon}>
                {"\uE011"}
              </Icon>
            </Tooltip>
          </div>
          {codeText && <MarkdownRender ref={mdRender => this.mdRender = mdRender} {...classes.code} text={codeText} />}
          <DoubleThemeRender
            useChromeColor={useChromeColor}
            themeStyle={{
              ...doubleThemeStyle,
              width: direction === "column" ? "100%" : "50%"
            }}
            useSingleTheme={useSingleTheme}
            direction={direction}
            newTheme={newTheme}
          >
            {children}
          </DoubleThemeRender>
        </div>
        {description && <MarkdownRender {...classes.desc} text={description} />}
      </div>
    );
  }
}

function getStyles(codeExample: CodeExample): {
  root?: React.CSSProperties;
  title?: React.CSSProperties;
  code?: React.CSSProperties;
  desc?: React.CSSProperties;
  icon?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style },
    state: { showCode }
  } = codeExample;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      fontSize: 14,
      color: theme.baseMediumHigh,
      margin: "36px 0",
      ...style
    }),
    title: prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      fontSize: 14,
      color: "#fff",
      background: theme.accent,
      cursor: "pointer",
      padding: "4px 8px",
      lineHeight: 1,
      ...style
    }),
    code: prefixStyle({
      overflow: "hidden",
      height: 0,
      width: "100%",
      transition: "height .25s 0s",
      padding: "0px 4px",
      ...style
    }),
    desc: prefixStyle({
      boxSizing: "border-box",
      margin: "8px 0",
      padding: "4px 0",
      ...style
    }),
    icon: prefixStyle({
      transform: `rotateZ(${showCode ? "-180deg" : "0deg"})`,
      color: "inherit",
      cursor: "pointer",
      transition: "all .25s"
    })
  };
}
