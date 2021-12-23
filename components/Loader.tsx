import React from 'react';
import { Animated, Easing, StyleSheet, View, ViewProps } from 'react-native';
import useTheme from '../hooks/theme';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dot: {
    minWidth: '1rem',
    minHeight: '1rem',
    borderRadius: 50,
  },
});

export interface LoaderProps extends ViewProps {
  backgroundColor?: string;
}

const Loader: React.FC<LoaderProps> = ({
  backgroundColor,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const scale0 = React.useRef(new Animated.Value(1));
  const scale1 = React.useRef(new Animated.Value(1));
  const scale2 = React.useRef(new Animated.Value(1));
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale0.current, {
          duration: 100,
          toValue: 1.5,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(scale0.current, {
          duration: 100,
          toValue: 0.5,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(scale0.current, {
          duration: 100,
          toValue: 1,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(scale1.current, {
          duration: 100,
          toValue: 1.5,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(scale1.current, {
          duration: 100,
          toValue: 0.5,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(scale1.current, {
          duration: 100,
          toValue: 1,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(scale2.current, {
          duration: 100,
          toValue: 1.5,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(scale2.current, {
          duration: 100,
          toValue: 1.5,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(scale2.current, {
          duration: 100,
          toValue: 1,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);
  return (
    <View {...props} style={[style, styles.wrapper]}>
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: backgroundColor ?? theme.colors.bg.dark,
            marginRight: 10,
            transform: [
              {
                scale: scale0.current as unknown as number,
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: backgroundColor ?? theme.colors.bg.dark,
            marginRight: 10,
            transform: [
              {
                scale: scale1.current as unknown as number,
              },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          {
            backgroundColor: backgroundColor ?? theme.colors.bg.dark,
            transform: [
              {
                scale: scale2.current as unknown as number,
              },
            ],
          },
        ]}
      />
    </View>
  );
};

export default Loader;
