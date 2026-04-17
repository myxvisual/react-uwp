import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { codes } from 'keycode';
import AddBlurEvent from './utils/AddBlurEvent';
import RenderToBody from './RenderToBody';

export interface DataProps {
  defaultShow?: boolean;
  isControlled?: boolean;
  contentStyle?: React.CSSProperties;
  contentEnterStyle?: React.CSSProperties;
  contentLeaveStyle?: React.CSSProperties;
  onCloseDialog?: () => void;
}
export interface DialogProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const Dialog: React.FC<DialogProps> = ({
  contentEnterStyle = { transform: "scale(1)" },
  contentLeaveStyle = { transform: "scale(0)" },
  defaultShow,
  contentStyle,
  isControlled,
  onCloseDialog,
  style,
  className,
  children,
  ...attributes
}, context: { theme: ReactUWP.ThemeType }) => {
  const [showDialog, setShowDialog] = useState(defaultShow);
  const addBlurEvent = useRef(new AddBlurEvent()).current;
  const rootElm = useRef<HTMLDivElement>(null);
  const renderToBodyRef = useRef<RenderToBody>(null);
  const { theme } = context;

  // 受控处理defaultShow
  useEffect(() => {
    if (defaultShow !== showDialog) {
      setShowDialog(defaultShow);
    }
  }, [defaultShow]);

  // 点击外部关闭事件
  useEffect(() => {
    addBlurEvent.setConfig({
      addListener: showDialog,
      clickIncludeElm: renderToBodyRef.current?.rootElm as HTMLElement,
      blurCallback: () => {
        if (isControlled) return;
        setShowDialog(false);
        onCloseDialog?.();
      },
      blurKeyCodes: [codes.esc]
    });
    return () => addBlurEvent.cleanEvent();
  }, [showDialog, isControlled, onCloseDialog]);

  const toggleShow = (show?: boolean) => {
    if (show !== undefined) {
      setShowDialog(show);
    }
  };

  const styles = getStyles(theme, {
    style,
    contentStyle,
    contentEnterStyle,
    contentLeaveStyle,
    showDialog
  });
  const classes = theme.prepareStyles({ className: "dialog", styles });

  return (
    <RenderToBody
      {...attributes}
      style={classes.root.style}
      ref={renderToBodyRef}
      className={theme.classNames(classes.root.className, className)}
    >
      <div ref={rootElm} {...classes.content}>
        {children}
      </div>
    </RenderToBody>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  contentEnterStyle: React.CSSProperties;
  contentLeaveStyle: React.CSSProperties;
  showDialog?: boolean;
}) => {
  const { style, contentStyle, contentEnterStyle, contentLeaveStyle, showDialog } = props;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      transition: "all .25s",
      position: "fixed",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      zIndex: theme.zIndex.contentDialog,
      ...style,
      pointerEvents: showDialog ? "all" : "none",
      opacity: showDialog ? 1 : 0
    }),
    content: prefixStyle({
      display: "inline-block",
      transition: "all .25s",
      ...contentStyle,
      ...(showDialog ? contentEnterStyle : contentLeaveStyle)
    })
  };
};

Dialog.contextTypes = {
  theme: PropTypes.object
};

export default Dialog;
