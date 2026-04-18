import { useTheme } from './hooks/useTheme';
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { codes } from 'keycode';
import AddBlurEvent from './utils/AddBlurEvent';
import Button from './Button';
import IconButton from './IconButton';
import RenderToBody from './RenderToBody';

export interface DataProps {
  statusBarTitle?: string;
  showCloseButton?: boolean;
  title?: string;
  content?: string;
  contentNode?: React.ReactNode;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  defaultShow?: boolean;
  closeButtonAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  primaryButtonAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  secondaryButtonAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCloseDialog?: () => void;
  background?: string;
  padding?: number;
}
export interface ContentDialogProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const ContentDialog: React.FC<ContentDialogProps> = ({
  primaryButtonText = "Delete",
  secondaryButtonText = "Cancel",
  padding = 16,
  defaultShow,
  statusBarTitle,
  title,
  showCloseButton,
  content,
  contentNode,
  closeButtonAction,
  primaryButtonAction,
  secondaryButtonAction,
  onCloseDialog,
  background,
  style,
  className,
  ...attributes
}) => {
  const theme = useTheme();
  const [showDialog, setShowDialog] = useState(defaultShow);
  const addBlurEvent = useRef(new AddBlurEvent()).current;
  const rootElm = useRef<HTMLDivElement>(null);
  const iconButtonHoverStyle = { background: "#d00f2a", color: "#fff" };

  // 受控处理defaultShow
  useEffect(() => {
    setShowDialog(defaultShow);
  }, [defaultShow]);

  // 点击外部关闭事件
  useEffect(() => {
    addBlurEvent.setConfig({
      addListener: showDialog,
      clickExcludeElm: rootElm.current!,
      blurCallback: () => {
        setShowDialog(false);
        onCloseDialog?.();
      },
      blurKeyCodes: [codes.esc]
    });
    return () => addBlurEvent.cleanEvent();
  }, [showDialog, onCloseDialog]);

  const containerMouseEnterHandle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.border = `1px solid ${theme.accent}`;
  };

  const containerMouseLeaveHandle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.border = `1px solid ${theme.baseLow}`;
  };

  const closeDialog = () => {
    setShowDialog(false);
    onCloseDialog?.();
  };

  const styles = getStyles(theme, {
    style,
    background,
    padding,
    primaryButtonText,
    secondaryButtonText,
    showDialog
  });
  const classes = theme.prepareStyles({ className: "content-dialog", styles });

  return (
    <RenderToBody>
      <div
        {...attributes}
        style={classes.mask.style}
        className={theme.classNames(classes.mask.className, className)}
      >
        <div
          ref={rootElm}
          style={classes.container.style}
          className={classes.container.className}
          onMouseEnter={containerMouseEnterHandle}
          onMouseLeave={containerMouseLeaveHandle}
        >
          {statusBarTitle && <div style={classes.statusBar.style} className={classes.statusBar.className}>
            <p style={classes.statusBarTitle.style} className={classes.statusBarTitle.className}>
              {statusBarTitle}
            </p>
            {showCloseButton && (
              <IconButton
                onClick={e => closeButtonAction?.(e)}
                size={24}
                style={styles.iconButton}
                hoverStyle={iconButtonHoverStyle}
                activeStyle={iconButtonHoverStyle}
              >
                {"\uE894"}
              </IconButton>
            )}
          </div>}
          <div style={classes.titleWrapper.style} className={classes.titleWrapper.className}>
            {title && <h5 style={classes.title.style} className={classes.title.className}>{title}</h5>}
            {content && <p>{content}</p>}
          </div>
          {contentNode}
          <div style={classes.content.style} className={classes.content.className}>
            {(primaryButtonText || secondaryButtonText) && (
              <div style={classes.buttonGroup.style} className={classes.buttonGroup.className}>
                {primaryButtonText && (
                  <Button
                    onClick={e => {
                      primaryButtonAction?.(e);
                      closeDialog();
                    }}
                    style={styles.button}
                  >
                    {primaryButtonText}
                  </Button>
                )}
                {secondaryButtonText && (
                  <Button
                    onClick={e => {
                      secondaryButtonAction?.(e);
                      closeDialog();
                    }}
                    style={styles.button}
                  >
                    {secondaryButtonText}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </RenderToBody>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
  background?: string;
  padding: number;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  showDialog?: boolean;
}) => {
  const { style, padding, primaryButtonText, secondaryButtonText, showDialog } = props;
  const { prefixStyle } = theme;

  return {
    mask: prefixStyle({
      lineHeight: 1.6,
      margin: 0,
      padding: 0,
      zIndex: 2000,
      opacity: showDialog ? 1 : 0,
      pointerEvents: showDialog ? "all" : "none",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      fontSize: 14,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      color: theme.baseHigh,
      background: theme.altMediumHigh,
      transition: `all .25s ${showDialog ? 0 : 0.25}s ease-in-out`,
      ...style
    }),
    container: prefixStyle({
      ...theme.acrylicTexture80.style,
      border: `1px solid ${theme.baseLow}`,
      flex: "0 0 auto",
      width: "80%",
      maxWidth: 720,
      cursor: "default",
      transform: `scale(${showDialog ? 1 : 0})`,
      opacity: showDialog ? 1 : 0,
      transition: `all .25s ${showDialog ? 0.25 : 0}s ease-in-out`
    }),
    statusBar: prefixStyle({
      color: "#fff",
      background: theme.accent,
      height: 28,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: 18
    }),
    statusBarTitle: {
      fontSize: 12,
      lineHeight: "28px"
    },
    iconButton: prefixStyle({
      color: "#fff",
      display: "flex",
      alignSelf: "flex-start",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 10,
      width: 40,
      lineHeight: "28px",
      height: 28
    }),
    content: prefixStyle({
      boxSizing: "border-box",
      width: "100%",
      padding,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    titleWrapper: {
      padding,
      minHeight: 160
    },
    title: {
      fontWeight: 500,
      fontSize: 18,
      margin: 0
    },
    buttonGroup: prefixStyle({
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    }),
    button: {
      width: (primaryButtonText && secondaryButtonText) ? "calc(50% - 2px)" : "100%"
    }
  };
};


export default ContentDialog;
