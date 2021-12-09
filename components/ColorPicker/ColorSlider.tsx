import React from 'react';
import { StyleSheet, View } from 'react-native';
import { UsePan1DProps } from '../../hooks/usePan/models';
import usePan1D from '../../hooks/usePan/usePan1D';
import Slider, { SliderProps } from '../Slider/Slider';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
});

const max = 255;

export interface ColorSliderProps
  extends Pick<UsePan1DProps, 'onChange'>,
    Omit<SliderProps<number>, 'max'> {}

const ColorSlider: React.FC<ColorSliderProps> = ({ onChange, ...props }) => {
  const panStore = usePan1D({
    value: props.value,
    max,
    onChange,
  });

  return (
    <View style={styles.wrapper}>
      <Slider {...props} {...panStore} max={max} height={4} />
    </View>
  );
};

export default ColorSlider;
