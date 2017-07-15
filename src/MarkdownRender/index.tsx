import * as React from "react";
import * as PropTypes from "prop-types";

import * as Prism from "prismjs";
import "prismjs/components/prism-jsx.min.js";
import * as marked from "marked";
import prismOkaidiaCSS from "./prismOkaidiaCSS";
import prismCoyCSS from "./prismCoyCSS";

export interface DataProps {
  /**
   * The Markdown string.
   */
  text?: string;
  /**
   * Use Custom Markdown CSS style in dark theme mode.
   */
  darkThemeCSSString?: string;
  /**
   * Use Custom Markdown CSS style in light theme mode.
   */
  lightThemeCSSString?: string;
}

export interface MarkdownRenderProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class MarkdownRender extends React.Component<MarkdownRenderProps> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  componentWillMount() {
    marked.setOptions({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight(code, lang) {
        try {
          switch (lang) {
            case "jsx": {
              require("prismjs/components/prism-jsx.min.js");
              break;
            }
            case "bash": {
              require("prismjs/components/prism-bash.min.js");
              break;
            }
            case "css": {
              require("prismjs/components/prism-css.min.js");
              break;
            }
            default: {
              break;
            }
          }
          return Prism.highlight(code, Prism.languages[lang]);
        } catch (err) {}
      }
    });
  }

  componentDidMount() {
    this.updateThemeStyle();
  }

  componentDidUpdate() {
    this.updateThemeStyle();
  }

  updateThemeStyle = () => {
    const { darkThemeCSSString, lightThemeCSSString } = this.props;
    const { theme } = this.context;
    let markdownStyleString: any;
    if (theme.isDarkTheme) {
      markdownStyleString = darkThemeCSSString || prismOkaidiaCSS;
    } else {
      markdownStyleString = lightThemeCSSString || prismCoyCSS;
    }

    const CSSText = getCSSText(theme, `react-uwp-markdown`) + "\n" + markdownStyleString;
    theme.styleManager.addCSSTextWithUpdate(CSSText);
  }

  render() {
    const { text, className, ...attributes } = this.props;
    const { theme } = this.context;

    return (
      <div>
        <div
          {...attributes}
          className={`react-uwp-markdown ${className || ""}`}
          dangerouslySetInnerHTML={{ __html: marked(text) }}
        />
      </div>
    );
  }
}

export default MarkdownRender;

function getCSSText(theme: ReactUWP.ThemeType, className: string) {
return (
`.${className} {
  /** background: ${theme.chromeMedium}; **/
  color: ${theme.baseMediumHigh};
  font-family: ${theme.fonts.sansSerifFonts.split(", ").map((font: string) => `"${font}"`).join(", ")};
}

.${className} img {
  display: block;
  max-width: 100%;
  margin: 0 auto;
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

.${className} a, .${className} h1, .${className} h2, .${className} h3, .${className} h4, .${className} h5, .${className} h6 {
  line-height: 1.4;
  font-weight: 300;
  margin: 16px 0 4px;
  color: ${theme.baseHigh};
}

.${className} p {
  line-height: 1.6;
  font-size: 14px;
}

.${className} strong {
  color: ${theme.baseHigh};
  font-size: 16px;
}

.${className} a {
  font-size: inherit;
  color: ${theme.accent};
  font-weight: lighter;
  text-decoration: none;
  transition: all .25s;
}

.${className} a:hover {
  text-decoration: underline;
}

.${className} h1, {
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
  margin: 4px 0;
  border: 0;
  width: 100%;
  border-top: 2px solid ${theme.listAccentMedium};
}

.${className} ol > li {
  margin-left: 12px;
}

.${className} li {
  font-size: 14px;
  line-height: 1.5;
}

.${className} blockquote {
  border-left: 2px solid ${theme.listAccentLow};
  padding-left: 15px;
  margin: 20px 0px 35px;
}

.${className} .language-math {
  font-size: 24px;
  color: ${theme.baseHigh};
}

.${className} .language-math pre {
  margin: 6px 0 6px;
  padding: 10px;
  width: 100%;
}

.${className} pre {
  font-family: ${theme.fonts.sansSerifFonts.split(", ").map((font: string) => `"${font}"`).join(", ")};
  background: none !important;
  border: 1px solid ${theme.listLow};
  border-left: 4px solid ${theme.listAccentMedium} !important;
  border-radius: 0 !important;
  padding: 12px;
  margin: 10px 0;
  font-size: 14px;
  width: 100%;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.${className} code {
  font-family: ${theme.fonts.sansSerifFonts.split(", ").map((font: string) => `"${font}"`).join(", ")};
  font-size: inherit;
  color: ${theme.accent};
  padding: 0px 4px;
  font-weight: inherit;
}

.${className} p > code, .${className} h1 > code, .${className} h2 > code, .${className} h3 > code, .${className} h4 > code, .${className} h5 > code, .${className} h6 > code {
  background: ${theme.useFluentDesign ? theme.altMediumLow : theme.altMedium};
}

code[class*="language-"], pre[class*="language-"] {
  ${theme.isDarkTheme ? (
    "background: none !important;"
  ) : (
    ""
  )}
  text-shadow: none !important;
  box-shadow: none !important;
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
