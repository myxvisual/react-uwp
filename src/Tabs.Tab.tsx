import { useTheme } from './hooks/useTheme';
import * as React from "react";
import * as PropTypes from "prop-types";

export interface DataProps {}

export interface TabProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

export class Tab extends React.Component<TabProps> {

  render() {
    const { children, style, ...attributes } = this.props;
    const { theme } = this.context;

    return (
      <div
        {...attributes}
        style={{
          display: "inline-block",
          verticalAlign: "middle",
          ...theme.prefixStyle(style)
        }}
      >
        {children}
      </div>
    );
  }
}

export default Tab;
