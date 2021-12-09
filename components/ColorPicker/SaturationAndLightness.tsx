import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const saturationAndLightnessHeight = 200;
const styles = StyleSheet.create({
  wrapper: {
    height: saturationAndLightnessHeight,
    alignItems: 'center',
    position: 'relative',
  },
});

export interface SaturationAndLightnessProps
  extends ViewProps,
    Pick<ViewStyle, 'backgroundColor'> {}

const SaturationAndLightness: React.FC<SaturationAndLightnessProps> = ({
  backgroundColor,
  style,
  ...props
}) => {
  return (
    <View
      {...props}
      style={[
        style,
        styles.wrapper,
        {
          backgroundColor,
        },
      ]}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id="g3">
            <Stop stopColor="#fff" />
            <Stop offset="1" stopColor="#fff" stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="g4" x1=".5" y1="1" x2=".5">
            <Stop stopColor="#000" />
            <Stop offset="1" stopColor="#000" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#g3)" />
        <Rect width="100%" height="100%" fill="url(#g4)" />
      </Svg>
    </View>
  );
};

export default SaturationAndLightness;
