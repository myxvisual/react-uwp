import { useTheme } from './hooks/useTheme';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import PseudoClasses from './PseudoClasses';
import RevealEffect, { RevealEffectProps } from './RevealEffect';

export interface DataProps {
  label?: string;
  icon?: string;
  visited?: boolean;
  iconStyle?: React.CSSProperties;
  isTenFt?: boolean;
  showLabel?: boolean;
  revealConfig?: RevealEffectProps;
}
export interface SplitViewCommandProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const SplitViewCommand: React.FC<SplitViewCommandProps> = ({
  isTenFt = false,
  showLabel = true,
  style,
  className,
  label,
  icon,
  visited,
  iconStyle,
  revealConfig,
  ...attributes
}) => {
  const theme = useTheme();
  const styles = useMemo(() => getStyles(theme, { style, iconStyle, visited, isTenFt, showLabel }), [theme, style, iconStyle, visited, isTenFt, showLabel]);

  const rootCls = theme.prepareStyle({
    className: "split-view-command",
    style: styles.root,
    extendsClassName: className
  });
  const labelCls = theme.prepareStyle({
    className: "split-view-command-label",
    style: styles.label
  });

  return (
    <PseudoClasses {...rootCls}>
      <div {...attributes}>
        {(visited && !isTenFt) && <div style={styles.visitedBorder} />}
        <Icon style={styles.icon}>
          {icon}
        </Icon>
        {label && showLabel && (
          <div {...labelCls}>
            {label}
          </div>
        )}
        <RevealEffect {...revealConfig} effectRange="self" />
      </div>
    </PseudoClasses>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  visited?: boolean;
  isTenFt: boolean;
  showLabel: boolean;
}) => {
  const { style, iconStyle, visited, isTenFt, showLabel } = props;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      flex: "0 0 auto",
      fontSize: 14,
      color: theme.baseMediumHigh,
      border: `${theme.borderWidth}px solid transparent`,
      borderWidth: `${theme.borderWidth}px 0px`,
      background: isTenFt ? (visited ? theme.listAccentLow : "none") : "none",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      transition: "all .25s 0s ease-in-out",
      "&:hover": {
        background: isTenFt ? theme.accent : theme.baseLow
      },
      ...style
    }),
    visitedBorder: {
      width: 0,
      borderLeft: `4px solid ${theme.accent}`,
      height: "50%",
      left: 0,
      top: "25%",
      position: "absolute"
    } as React.CSSProperties,
    icon: prefixStyle({
      cursor: "default",
      flex: "0 0 auto",
      width: 48,
      height: 48,
      lineHeight: "48px",
      color: isTenFt ? undefined : (visited ? theme.accent : theme.baseHigh),
      fontSize: 16,
      ...iconStyle
    }),
    label: {
      color: isTenFt ? undefined : (visited ? theme.accent : theme.baseHigh),
      cursor: "default",
      opacity: showLabel ? 1 : 0,
      transition: "opacity .25s"
    }
  };
};


SplitViewCommand.displayName = "SplitViewCommand";

export default SplitViewCommand;
