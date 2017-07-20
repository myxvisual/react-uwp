import * as React from "react";
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
}

export interface CodeExampleProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export interface CodeExampleState {
  showCode?: boolean;
}

export default class CodeExample extends React.Component<CodeExampleProps, CodeExampleState> {
  state: CodeExampleState = {};

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  toggleShowCode = (showCode?: any) => {
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
      ...attributes
    } = this.props;
    const { theme } = this.context;
    const styles = getStyles(this);
    const { showCode } = this.state;
    const codeText = `\`\`\`jsx
${code}
\`\`\``;

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <div style={{ width: "100%", border: `1px solid ${theme.accent}` }}>
          <div onClick={this.toggleShowCode} style={styles.title}>
            <p style={{ fontSize: 15 }}>{title}</p>
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
          {codeText && <MarkdownRender style={styles.code} text={codeText} />}
          <DoubleThemeRender
            useChromeColor={useChromeColor}
            themeStyle={{
              ...doubleThemeStyle,
              width: direction === "column" ? "100%" : "50%"
            }}
            useSingleTheme={useSingleTheme}
            direction={direction}
          >
            {children}
          </DoubleThemeRender>
        </div>
        {description && <MarkdownRender style={styles.desc} text={description} />}
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
      fontSize: 18,
      color: "#fff",
      background: theme.accent,
      cursor: "pointer",
      padding: "10px 8px",
      ...style
    }),
    code: prefixStyle({
      maxHeight: showCode ? 400 : 0,
      overflow: "auto",
      width: "100%",
      transition: "max-height .25s 0s",
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
