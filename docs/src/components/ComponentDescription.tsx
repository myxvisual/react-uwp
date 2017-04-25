import * as React from "react";

import ThemeType from "react-uwp/src/styles/ThemeType";
import MarkdownRender from "./MarkdownRender";

export interface DocEntry {
  fileName?: string;
  name?: string;
  type?: string;
  constructors?: DocEntry[];
  isRequired?: boolean;
  documentation?: string;
  exports?: DocEntry[];
  parameters?: DocEntry[];
  returnType?: string;
  comment?: string;
  members?: DocEntry[];
  extends?: DocEntry[] | string[];
  initializerText?: string;
}
export interface DataProps {
  docEntry?: DocEntry;
}

export interface ComponentDescriptionProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class ComponentDescription extends React.PureComponent<ComponentDescriptionProps, void> {
  static defaultProps: ComponentDescriptionProps = {
  };

  static contextTypes = { theme: React.PropTypes.object };
  context: { theme: ThemeType };

  getDefaultExportName = () => {
    const { docEntry } = this.props;
    const exportsSize = docEntry.exports.length;
    let defaultName: any = "";

    for (let i = 0; i < exportsSize; i ++) {
      if (docEntry.exports[i].name === "default") {
        defaultName = docEntry.exports[i].extends[0];
        break;
      }
    }
    return defaultName;
  }

  initializerTextParser = (initializerText?: string) => {
    const text = initializerText.split(",").map(str => {
      return str.replace(/\:\s*(.*)$/gmi, (match, p1) => {
        return `: \'${p1}\'`;
      });
    }).join(",");
    let data: any = null;
    try {
      data = eval(`(function() { return ${text} })()`);
    } catch (err) {}
    return data;
  }

  getMembersAndDataProps = () => {
    const { docEntry } = this.props;
    const membersSize = docEntry.members.length;
    const defaultName = this.getDefaultExportName();
    let componentMembers: DocEntry[] = [];
    let componentExports: DocEntry[] = [];
    let dataProps: DocEntry[] = [];

    for (let i = 0; i < membersSize; i++) {
      let finedMembers = false;
      let finedDataProps = false;

      if (docEntry.members[i].name === defaultName) {
        componentMembers = docEntry.members[i].members;
        componentExports = docEntry.members[i].exports;
        finedMembers = true;
      }

      if (docEntry.members[i].name === "DataProps") {
        dataProps = docEntry.members[i].members;
        finedDataProps = true;
      }

      if (finedMembers && finedDataProps) break;
    }

    const componentExportsSize = componentExports.length;
    for (let i = 0; i < componentExportsSize; i++) {
      if (componentExports[i].name === "defaultProps") {
        const data = this.initializerTextParser(componentExports[i].initializerText);

        for (const key in data) {
          let haveHTMLAttributes = true;

          for (let docEntry of dataProps) {
            if (key === "onChangeValue") {
            }
            if (key === docEntry.name) {
              docEntry.initializerText = data[key];
              haveHTMLAttributes = false;
              break;
            }
          }

          if (haveHTMLAttributes) {
            const newDocEntry: any = dataProps;
            newDocEntry.push({
              name: key,
              type: `HTMLAttributes.${key}`,
              initializerText: data[key]
            });
          }
        }
        break;
      }
    }

    return {
      componentMembers,
      dataProps
    };
  }

  members2MarkdownText = (members: DocEntry[], getInitializerText = false) => {
    const { theme } = this.context;
    const planeText = members.map(({ name, type, isRequired, initializerText, documentation }) => ([
      name,
      `<p style="color: ${theme.accent};">${type.replace(/\|/g, " or ")}</p>`,
      `<p style="color: ${theme.baseHigh};">${initializerText && getInitializerText ? initializerText : ""}</p>`,
      `<p style="color: ${theme.baseMedium};">${Boolean(isRequired)}</p>`,
      `<p style="color: ${theme.baseMedium};">${documentation || ""}</p>`
    ].join(" | "))).join("\n");
    return `
Name | Type | default | Required | Description
--- | --- | --- | --- | ---
${planeText}
`;
  }

  render() {
    const {
      docEntry, // tslint:disable-line:no-unused-variable
      ...attributes
    } = this.props;
    const { componentMembers, dataProps } = this.getMembersAndDataProps();
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div
        {...attributes}
        style={styles.root}
      >
        <h5 style={styles.head}>Props</h5>
        <MarkdownRender text={this.members2MarkdownText(dataProps, true)} />
        <p
          style={{
            borderLeft: `2px solid ${theme.accent}`,
            paddingLeft: 8,
            margin: "8px 0"
          }}
        >
          Other Props is HTMLAttributes will are applied to the root element.
        </p>
        <h5 style={styles.head}>Members</h5>
        <MarkdownRender text={this.members2MarkdownText(componentMembers)} />
      </div>
    );
  }
}

function getStyles(componentDescription: ComponentDescription): {
  root?: React.CSSProperties;
  head?: React.CSSProperties;
} {
  const {
    context: { theme },
    props: { style }
  } = componentDescription;
  const { prepareStyles } = theme;

  return {
    root: prepareStyles({
      fontSize: 14,
      color: theme.baseMediumHigh,
      ...style
    }),
    head: {
      margin: "16px 0",
      fontSize: 22,
      lineHeight: 1.5,
      color: theme.baseHigh
    },
  };
}
