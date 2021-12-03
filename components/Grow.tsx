import React from 'react';
import { Animated, StyleSheet, ViewProps } from 'react-native';

const styles = StyleSheet.create({
  grow: {
    overflow: 'hidden',
  },
});

export interface GrowProps extends ViewProps {
  height: number;
  visible: boolean;
  duration?: number;
}

const Grow: React.FC<GrowProps> = ({
  height,
  visible,
  duration = 300,
  style,
  ...props
}) => {
  const animatedHeight = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: visible ? height : 0,
      duration,
      useNativeDriver: false,
    }).start();
  }, [animatedHeight, duration, height, visible]);

  return (
    <Animated.View
      {...props}
      style={[style, styles.grow, { height: animatedHeight }]}
    />
  );
};

export default Grow;
