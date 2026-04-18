import { useTheme } from './hooks/useTheme';
import React, { useState, useEffect, useMemo } from 'react';
import Icon from './Icon';

export interface DataProps {
  defaultRating?: number;
  maxRating?: number;
  icon?: string;
  iconStyle?: React.CSSProperties;
  iconRatedStyle?: React.CSSProperties;
  onChangeRating?: (rating?: number) => void;
  label?: string;
  isReadOnly?: boolean;
  iconPadding?: number;
}
export interface RatingControlProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const RatingControl: React.FC<RatingControlProps> = ({
  defaultRating = 2.5,
  maxRating = 5,
  icon = "FavoriteStarFill",
  onChangeRating,
  iconPadding = 10,
  iconStyle,
  iconRatedStyle,
  label,
  isReadOnly,
  style,
  className,
  ...attributes
}) => {
  const theme = useTheme();
  const [currRating, setCurrRating] = useState(defaultRating);

  // 受控处理
  useEffect(() => {
    if (defaultRating !== currRating) {
      setCurrRating(defaultRating);
    }
  }, [defaultRating]);

  const handleRationClick = (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
    if (isReadOnly) return;
    const lastIndex = maxRating - 1;
    const clientRect = e.currentTarget.getBoundingClientRect();
    const left = e.clientX - clientRect.left;
    let offset = left / (index === lastIndex ? clientRect.width : clientRect.width - iconPadding);
    offset = Math.min(1, offset);
    const newRating = index + offset;
    setCurrRating(newRating);
    onChangeRating?.(newRating);
  };

  const fontSize = iconStyle ? (+Number(iconStyle.fontSize) || 24) : 24;
  const lastIndex = maxRating - 1;
  const offset = Math.floor(currRating) * (fontSize + iconPadding) + (currRating % 1) * fontSize;

  const styles = useMemo(() => getStyles(theme, style), [theme, style]);
  const cls = theme.prepareStyles({ className: "rating-control", styles });

  const renderRatings = (notRated = true) => (
    <div
      style={theme.prefixStyle({
        ...(notRated ? cls.group.style : cls.groupMask.style),
        ...(!notRated && {
          clipPath: `polygon(0% 0%, ${offset}px 0%, ${offset}px 100%, 0% 100%)`,
        } as React.CSSProperties)
      })}
      className={notRated ? cls.group.className : cls.groupMask.className}
    >
      {Array(maxRating).fill(0).map((_, index) => (
        <Icon
          key={index}
          style={{
            fontSize: 24,
            paddingRight: index === lastIndex ? 0 : iconPadding,
            ...iconStyle,
            ...(!notRated && iconRatedStyle)
          }}
          onClick={!isReadOnly ? e => handleRationClick(e, index) : undefined}
        >
          {icon}
        </Icon>
      ))}
    </div>
  );

  const normalRender = (
    <div
      {...attributes}
      style={cls.root.style}
      className={theme.classNames(cls.root.className, className)}
    >
      {renderRatings()}
      {renderRatings(false)}
    </div>
  );

  return label ? (
    <div style={{ display: "inline-block" }}>
      <div {...cls.labelWrapper}>
        {normalRender}
        <span>{label}</span>
      </div>
    </div>
  ) : normalRender;
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, style?: React.CSSProperties) => {
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      color: theme.baseMediumHigh,
      display: "inline-block",
      position: "relative",
      cursor: "default",
      ...style
    }),
    group: prefixStyle({
      display: "inline-block",
      transition: "all .25s"
    }),
    groupMask: prefixStyle({
      display: "inline-block",
      transition: "all .25s",
      color: theme.accent,
      position: "absolute",
      top: 0,
      left: 0
    }),
    labelWrapper: prefixStyle({
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    })
  };
};


export default RatingControl;
