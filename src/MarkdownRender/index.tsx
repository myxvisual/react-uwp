import * as React from "react";
import * as PropTypes from "prop-types";

import prismOkaidiaCSS from "./prismOkaidiaCSS";
import prismCoyCSS from "./prismCoyCSS";
import * as MarkdownIt from "markdown-it";

export function getMd() {
  return new MarkdownIt({
    html: true,
    linkify: true,
    breaks: true
  });
}

export interface DataProps {
  /**
   * The Markdown string.
   */
  text?: string;
  /**
   * Use Custom Markdown CSSText.
   */
  CSSText?: string;
  md?: MarkdownIt;
}

export interface MarkdownRenderProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class MarkdownRender extends React.Component<MarkdownRenderProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentDidMount() {
    this.updateThemeStyle();
  }

  componentDidUpdate() {
    this.updateThemeStyle();
  }

  getMd = () => {
    const { md } = this.props;
    if (md) {
      return md;
    } else {
      return getMd();
    }
  }

  updateThemeStyle = () => {
    const { CSSText: newCSSText } = this.props;
    const { theme } = this.context;
    const CSSText = getMarkdownCSSText(theme, this.getClassName()) + `\n${theme.isDarkTheme ? prismOkaidiaCSS : prismCoyCSS}` + newCSSText || "";
    theme.styleManager.addCSSText(CSSText);
  }

  getClassName = () => {
    const { theme } = this.context;
    return `react-uwp-markdown-${theme.themeName}`;
  }

  render() {
    const { text, className, ...attributes } = this.props;
    const { theme } = this.context;

    const md = this.getMd();
    const html = md.render(text);
    return (
      <div>
        <div
          {...attributes}
          className={`${this.getClassName()} ${className || ""}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }
}

export default MarkdownRender;

export function getMarkdownCSSText(theme: ReactUWP.ThemeType, className: string, fontSize = 14) {
return (
`.${className} {
  color: ${theme.baseMediumHigh};
  font-family: ${theme.fonts.sansSerifFonts.split(", ").map((font: string) => `"${font}"`).join(", ")};
  font-size: ${fontSize}px;
}

.${className} img {
  max-width: 100%;
  margin: 8px auto;
}

.${className} div {
  letter-spacing: 0px;
  margin: 0;
  padding: 0 32px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}

.${className} h1, .${className} h2, .${className} h3, .${className} h4, .${className} h5, .${className} h6 {
  line-height: 1.8;
  font-weight: 300;
  margin: 16px 0 4px;
  color: ${theme.baseHigh};
}

.${className} p {
  margin: 12px 0;
  line-height: 1.6;
}

.${className} strong {
  color: ${theme.baseHigh};
}

.${className} a {
  font-size: inherit;
  color: ${theme.accent};
  text-decoration: none;
  transition: all .25s;
}

.${className} a:hover {
  text-decoration: underline;
}

.${className} h1 {
  line-height: 2;
  font-size: 24px;
  border-bottom: 2px solid ${theme.listAccentMedium};
}

.${className} h2 {
  line-height: 2;
  font-size: 20px;
  border-bottom: 2px solid ${theme.listAccentMedium};
}


.${className} h3 {
  font-size: 18px;
}

.${className} h4 {
  font-size: 16px;
}

.${className} h5 {
  font-size: 15px;
}

.${className} h6 {
  font-size: 14px;
}

.${className} hr {
  margin: 8px 0;
  border: 0;
  width: 100%;
  border-top: 1px solid ${theme.listAccentLow};
}

.${className} ol > li {
  margin-left: 12px;
}

.${className} li {
  line-height: 1.5;
}

.${className} blockquote {
  border-left: 4px solid ${theme.listAccentLow};
  padding-left: 15px;
  margin: 20px 0px 35px;
}

.${className} .language-math {
  color: ${theme.baseHigh};
}

.${className} .language-math pre {
  margin: 6px 0 6px;
  padding: 10px;
  width: 100%;
}

.${className} pre {
  font-family: ${theme.fonts.sansSerifFonts.split(", ").map((font: string) => `"${font}"`).join(", ")};
  background: none;
  border: 1px solid ${theme.listLow};
  border-left: 4px solid ${theme.listAccentMedium};
  border-radius: 0;
  padding: 12px;
  margin: 10px 0;
  width: 100%;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.${className} code {
  font-family: ${theme.fonts.sansSerifFonts.split(", ").map((font: string) => `"${font}"`).join(", ")};
  background: ${theme.listLow};
  font-size: inherit;
  color: ${theme.accent};
  padding: 0px 4px;
  font-weight: inherit;
}

.${className} p > code, .${className} h1 > code, .${className} h2 > code, .${className} h3 > code, .${className} h4 > code, .${className} h5 > code, .${className} h6 > code {
  background: ${theme.listLow};
}

code[class*="language-"], pre[class*="language-"] {
  ${theme.isDarkTheme ? (
    "background: none;"
  ) : (
    ""
  )}
  text-shadow: none;
  box-shadow: none;
}

.${className} table {
  width: 100%;
}

.${className} table, .${className} td, .${className} th {
  border-collapse: collapse;
  border: 1px solid ${theme.altHigh};
  padding: 10px;
  / ** word-break: break-all; **/
}

.${className} table tbody {
  background: ${theme.baseLow};
}

.${className} table tr:nth-child(1n) {
  background: ${theme.altMedium};
}

.${className} table tr:nth-child(2n) {
  background: ${theme.altMediumHigh};
}

.${className} th {
  vertical-align: middle;
  border-collapse: collapse;
  padding: 12px;
  color: #fff;
  background: ${theme[theme.isDarkTheme ? "accentDarker1" : "accentLighter1"]};
  border: 1px solid ${theme.altHigh};
}

.${className} input[type="checkbox"] {
  width: 18px;
  height: 18px;
  vertical-align: middle;
  opacity: .5;
  pointer-events: none;
}

.${className} li > label {
  pointer-events: none;
}

.${className} ul {
  margin: 10px 20px;
}
 .${className} .token.operator, .${className} .token.entity, .${className} .token.url, .${className} .token.variable {
   background: none;
 }
`
); }
