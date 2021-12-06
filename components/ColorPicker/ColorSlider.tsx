import React from 'react';
import { StyleSheet, View } from 'react-native';
import Slider, { SliderProps } from '../Slider';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
});

export interface ColorSliderProps extends Omit<SliderProps, 'max'> {}

const ColorSlider: React.FC<ColorSliderProps> = ({ ...props }) => {
  return (
    <View style={styles.wrapper}>
      <Slider {...props} max={255} />
    </View>
  );
};

export default ColorSlider;
