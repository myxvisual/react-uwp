import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { codes } from 'keycode';
import RevealEffect, { RevealEffectProps } from './RevealEffect';
import AddBlurEvent from './utils/AddBlurEvent';
import AppBarButton from './AppBarButton';
import AppBarSeparator from './AppBarSeparator';
import ListView from './ListView';

export interface DataProps {
  contentStyle?: React.CSSProperties;
  content?: string;
  contentNode?: React.ReactNode;
  primaryCommands?: React.ReactElement<any>[];
  secondaryCommands?: React.ReactElement<any>[];
  labelPosition?: "right" | "bottom" | "collapsed";
  expanded?: boolean;
  flowDirection?: "row-reverse" | "row";
  isMinimal?: boolean;
  verticalPosition?: "top" | "bottom";
  background?: string;
  revealConfig?: RevealEffectProps;
}
export interface CommandBarProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const CommandBar: React.FC<CommandBarProps> = ({
  labelPosition = "bottom",
  verticalPosition = "top",
  expanded,
  content,
  contentStyle,
  contentNode,
  primaryCommands,
  secondaryCommands,
  flowDirection,
  isMinimal,
  background,
  revealConfig,
  style,
  className,
  ...attributes
}, context: { theme: ReactUWP.ThemeType }) => {
  const [currExpanded, setCurrExpanded] = useState(expanded);
  const rootElm = useRef<HTMLDivElement>(null);
  const addBlurEvent = useRef(new AddBlurEvent()).current;
  const { theme } = context;

  // 受控处理expanded
  useEffect(() => {
    if (expanded !== currExpanded) {
      setCurrExpanded(expanded);
    }
  }, [expanded]);

  // 点击外部关闭事件
  useEffect(() => {
    addBlurEvent.setConfig({
      addListener: currExpanded,
      clickExcludeElm: rootElm.current!,
      blurCallback: () => setCurrExpanded(false),
      blurKeyCodes: [codes.esc]
    });
    return () => addBlurEvent.cleanEvent();
  }, [currExpanded]);

  const toggleExpanded = (value?: boolean) => {
    setCurrExpanded(prev => value ?? !prev);
  };

  const defaultHeight = isMinimal ? 24 : 48;
  const styles = getStyles(theme, {
    style,
    flowDirection,
    labelPosition,
    content,
    contentNode,
    contentStyle,
    primaryCommands,
    isMinimal,
    verticalPosition,
    background,
    currExpanded
  });
  const classes = theme.prepareStyles({ className: "command-bar", styles });

  return (
    <div style={classes.wrapper.style} className={classes.wrapper.className} ref={rootElm}>
      <div 
        {...attributes} 
        style={classes.root.style} 
        className={theme.classNames(classes.root.className, className)}
      >
        {(content !== undefined || contentNode !== undefined) && (
          <div {...classes.content}>{content || contentNode}</div>
        )}
        <div {...classes.commands}>
          {!isMinimal || currExpanded ? (
            React.Children.toArray(primaryCommands).filter((child: any) => (
              child.type === AppBarButton || child.type === AppBarSeparator
            )).map((child: any, index: number) => (
              React.cloneElement(child, {
                labelPosition,
                revealConfig: { effectEnable: "disabled" },
                key: index,
                style: child.type === AppBarSeparator ? { height: 24 } : undefined
              })
            ))
          ) : null}
          <AppBarButton
            labelPosition="bottom"
            revealConfig={{ effectEnable: "disabled" }}
            style={styles.moreLegacy}
            iconStyle={{
              maxWidth: defaultHeight,
              height: defaultHeight,
              lineHeight: isMinimal ? (currExpanded ? "48px" : "24px") : "48px"
            }}
            icon="MoreLegacy"
            onClick={() => toggleExpanded()}
          />
          {secondaryCommands && (
            <ListView
              style={styles.secondaryCommands}
              listSource={secondaryCommands.map(itemNode => {
                if (itemNode.type === AppBarSeparator) {
                  itemNode = React.cloneElement(itemNode, { direction: "row" });
                  return { itemNode, disabled: true, style: { padding: "0 8px" } };
                }
                return { itemNode, onClick: () => toggleExpanded(false) };
              })}
            />
          )}
        </div>
        <RevealEffect observerTransition="height" {...revealConfig} />
      </div>
    </div>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
  flowDirection?: "row-reverse" | "row";
  labelPosition: "right" | "bottom" | "collapsed";
  content?: string;
  contentNode?: React.ReactNode;
  contentStyle?: React.CSSProperties;
  primaryCommands?: React.ReactElement<any>[];
  isMinimal?: boolean;
  verticalPosition: "top" | "bottom";
  background?: string;
  currExpanded?: boolean;
}) => {
  const {
    style,
    flowDirection,
    labelPosition,
    content,
    contentNode,
    contentStyle,
    primaryCommands,
    isMinimal,
    verticalPosition,
    background,
    currExpanded
  } = props;
  const { prefixStyle } = theme;
  const inBottom = verticalPosition !== "top";
  const notChangeHeight = labelPosition !== "bottom";
  const haveContent = content || contentNode;
  const transition = "all .125s ease-in-out";
  const isReverse = flowDirection === "row-reverse";
  const defaultHeight = isMinimal ? 24 : 48;
  const expandedHeight = 72;
  let changedHeight: number;
  if (isMinimal) {
    changedHeight = currExpanded ? (notChangeHeight ? 48 : 72) : defaultHeight;
  } else {
    changedHeight = (currExpanded && !notChangeHeight && primaryCommands) ? expandedHeight : defaultHeight;
  }
  return {
    wrapper: theme.prefixStyle({
      position: "relative",
      height: inBottom ? "auto" : defaultHeight,
      display: "block",
      zIndex: currExpanded ? theme.zIndex.commandBar : undefined,
      ...style
    }),
    root: prefixStyle({
      position: "relative",
      display: "flex",
      flexDirection: flowDirection || (haveContent ? "row" : "row-reverse"),
      alignItems: "flex-start",
      justifyContent: haveContent ? "space-between" : "flex-start",
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: background || (theme.useFluentDesign ? theme.listLow : theme.altHigh),
      height: changedHeight,
      transition
    }),
    content: prefixStyle({
      height: defaultHeight,
      lineHeight: `${defaultHeight}px`,
      paddingLeft: 10,
      paddingRight: 10,
      ...contentStyle
    }),
    commands: prefixStyle({
      display: "flex",
      flexDirection: flowDirection,
      alignItems: "flex-start",
      height: "100%"
    }),
    moreLegacy: theme.prefixStyle({
      height: changedHeight,
      transition
    }),
    secondaryCommands: {
      ...theme.acrylicTexture60.style,
      width: "auto",
      maxWidth: 240,
      zIndex: theme.zIndex.commandBar,
      position: "absolute",
      right: isReverse ? undefined : 0,
      left: isReverse ? 0 : undefined,
      top: inBottom ? undefined : changedHeight,
      bottom: inBottom ? changedHeight : undefined,
      transform: `translate3d(0, ${currExpanded ? 0 : -8}px, 0)`,
      opacity: currExpanded ? 1 : 0,
      pointerEvents: currExpanded ? "all" : "none"
    }
  };
};

CommandBar.contextTypes = {
  theme: PropTypes.object
};

export default CommandBar;
