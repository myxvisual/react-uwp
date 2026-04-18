import { useTheme } from './hooks/useTheme';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SlideInOut from './Animate.SlideInOut';

export interface DataProps {}
export interface SemanticZoomProps extends DataProps, React.HTMLAttributes<HTMLDivElement> {}

const SemanticZoom: React.FC<SemanticZoomProps> = ({
  style,
  ...attributes
}) => {
  const theme = useTheme();
  const [showController, setShowController] = useState(false);

  const toggleShowController = (value?: boolean) => {
    setShowController(prev => value ?? !prev);
  };
  SemanticZoom.toggleShowController = toggleShowController;

  const styles = getStyles(theme, { style });

  return (
    <SlideInOut
      style={styles.root}
      {...attributes as any}
    >
      {showController ? (
        <div key="controller">
          SemanticZoomController
        </div>) : (
        <div key="view">
          SemanticZoomView
        </div>
      )}
    </SlideInOut>
  );
};

// ------------------------------
// Style generation function (bottom of file)
// ------------------------------
const getStyles = (theme: ReactUWP.ThemeType, props: {
  style?: React.CSSProperties;
}) => {
  const { style } = props;
  const { prefixStyle } = theme;

  return {
    root: prefixStyle({
      fontSize: 14,
      color: theme.baseMediumHigh,
      background: theme.altMediumHigh,
      ...style
    })
  };
};


export default SemanticZoom;
