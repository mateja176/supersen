import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Color, WithChannel } from '../../models/pixels';
import Slider from '../Slider';
import ColorSlider from './ColorSlider';
import Swatches from './Swatches';

const styles = StyleSheet.create({
  swatchesWrapper: {
    marginTop: 10,
  },
  sliderWrapper: {
    marginTop: 10,
  },
});

export interface ColorPickerProps extends ViewProps {
  color: Color;
  onChange: (color: Color) => void;
  onChannelChange: (color: WithChannel) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  onChannelChange,
  ...props
}) => {
  const handleRedChange = React.useCallback(
    (r: Color['r']) => {
      onChannelChange({ r });
    },
    [onChannelChange],
  );
  const handleGreenChange = React.useCallback(
    (g: Color['g']) => {
      onChannelChange({ g });
    },
    [onChannelChange],
  );
  const handleBlueChange = React.useCallback(
    (b: Color['b']) => {
      onChannelChange({ b });
    },
    [onChannelChange],
  );
  const handleAlphaChange = React.useCallback(
    (a: Color['a']) => {
      onChannelChange({ a: a / 100 });
    },
    [onChannelChange],
  );

  return (
    <View {...props}>
      <View>
        <ColorSlider
          value={color.r}
          onChange={handleRedChange}
          knobColor="lightcoral"
          backgroundColor={[
            `rgb(${0}, ${color.g}, ${color.b})`,
            `rgb(${255}, ${color.g}, ${color.b})`,
          ]}
        />
        <View style={styles.sliderWrapper}>
          <ColorSlider
            value={color.g}
            onChange={handleGreenChange}
            knobColor="lightgreen"
            backgroundColor={[
              `rgb(${color.r}, ${0}, ${color.b})`,
              `rgb(${color.r}, ${255}, ${color.b})`,
            ]}
          />
        </View>
        <View style={styles.sliderWrapper}>
          <ColorSlider
            value={color.b}
            onChange={handleBlueChange}
            knobColor="lightblue"
            backgroundColor={[
              `rgb(${color.r}, ${color.g}, ${0})`,
              `rgb(${color.r}, ${color.g}, ${255})`,
            ]}
          />
        </View>
        <View style={styles.sliderWrapper}>
          <Slider
            max={100}
            value={color.a * 100}
            onChange={handleAlphaChange}
            knobColor="white"
            backgroundColor={[
              'transparent',
              `rgb(${color.r}, ${color.g}, ${color.b})`,
            ]}
          />
        </View>
      </View>

      <View style={styles.swatchesWrapper}>
        <Swatches onChange={onChange} />
      </View>
    </View>
  );
};

export default ColorPicker;
