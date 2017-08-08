import * as React from "react";
import * as PropTypes from "prop-types";

import MarkdownRender from "react-uwp/MarkdownRender";

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
  renderOtherTypes?: string[];
}

export interface ComponentDescriptionProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export default class ComponentDescription extends React.Component<ComponentDescriptionProps> {
  static defaultProps: ComponentDescriptionProps = {
  };

  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

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
    const text = initializerText.replace(/\:\s*(.*)\,?\n?\r?$/gmi, (match, p1) => {
      if (p1[p1.length - 1] === ",") {
        p1 = p1.slice(0, p1.length - 1);
      }
      return `: \'${p1}\',`;
    });
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
          if (!dataProps) break;

          for (let docEntry of dataProps) {
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

  getTypeDoc = (typeName: string) => {
    const { docEntry } = this.props;
    const membersSize = docEntry.members.length;
    let interfaceType: DocEntry[] = [];

    for (let i = 0; i < membersSize; i++) {
      let findInterface = false;

      if (docEntry.members[i].name === typeName) {
        interfaceType = docEntry.members[i].members;
        findInterface = true;
      }

      if (findInterface) break;
    }
    return interfaceType;
  }

  members2MarkdownText = (members: DocEntry[], getProps = false) => {
    if (!members) return "";

    const { theme } = this.context;
    const planeText = members.map(({ name, type, isRequired, initializerText, documentation }) => ([
      name,
      `<p style="color: ${theme.accent};">${type.replace(/\|/g, " or ")}</p>`,
      ...(getProps ? [`<p style="color: ${theme.baseHigh};">${initializerText || ""}</p>`] : []),
      ...(getProps ? [`<p style="color: ${theme.baseMedium};">${Boolean(isRequired)}</p>`] : []),
      `<p style="color: ${theme.baseMedium};">${documentation || ""}</p>`
    ].join(" | "))).join("\n");
    return getProps ? `
Name | Type | Default | Required | Description
--- | --- | --- | --- | ---
${planeText}
` : `
Name | Type | Description
--- | --- | ---
${planeText}
`;
  }

  render() {
    const {
      docEntry,
      renderOtherTypes,
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
        <p style={styles.head}>Props</p>
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
        {renderOtherTypes && renderOtherTypes.map((otherType, index) => (
          <div key={`${index}`}>
            <p style={styles.head}>{otherType}</p>
            <MarkdownRender text={this.members2MarkdownText(this.getTypeDoc(otherType), true)} />
          </div>
        ))}
        <p style={styles.head}>Members</p>
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
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      fontSize: 14,
      color: theme.baseMediumHigh,
      ...style
    }),
    head: {
      fontWeight: 500,
      margin: "16px 0",
      fontSize: 22,
      lineHeight: 1.5,
      color: theme.baseHigh
    }
  };
}
