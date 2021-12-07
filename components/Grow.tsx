import React from 'react';
import { Animated, LayoutRectangle, StyleSheet, ViewProps } from 'react-native';

const styles = StyleSheet.create({
  grow: {
    overflow: 'hidden',
  },
});

export interface GrowProps extends ViewProps {
  layoutRef: React.MutableRefObject<LayoutRectangle | null>;
  visible: boolean;
  duration?: number;
}

const Grow: React.FC<GrowProps> = ({
  visible,
  duration = 300,
  style,
  layoutRef,
  ...props
}) => {
  const animatedHeight = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (layoutRef.current) {
      Animated.timing(animatedHeight, {
        toValue: visible ? layoutRef.current.height : 0,
        duration,
        useNativeDriver: false,
      }).start();
    }
  }, [animatedHeight, duration, layoutRef, visible]);

  return (
    <Animated.View
      {...props}
      style={[style, styles.grow, { height: animatedHeight }]}
    />
  );
};

export default Grow;
