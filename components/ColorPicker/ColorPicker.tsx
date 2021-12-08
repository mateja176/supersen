import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Slider from '../Slider';
import tinycolor from 'tinycolor2';
import { ColorFormats } from 'tinycolor2';
import { Color, WithChannel } from '../../models/pixels';
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
    (r: ColorFormats.RGBA['r']) => {
      onChannelChange({ r });
    },
    [onChannelChange],
  );
  const handleGreenChange = React.useCallback(
    (g: ColorFormats.RGBA['g']) => {
      onChannelChange({ g });
    },
    [onChannelChange],
  );
  const handleBlueChange = React.useCallback(
    (b: ColorFormats.RGBA['b']) => {
      onChannelChange({ b });
    },
    [onChannelChange],
  );
  const handleAlphaChange = React.useCallback(
    (a: ColorFormats.RGBA['a']) => {
      onChannelChange({ a: a / 100 });
    },
    [onChannelChange],
  );

  const rgbColor: ColorFormats.RGBA = color.toRgb();

  return (
    <View {...props}>
      <View>
        <ColorSlider
          value={rgbColor.r}
          onValueChange={handleRedChange}
          knobColor="lightcoral"
          backgroundColor={[
            tinycolor({ ...rgbColor, r: 0 }).toRgbString(),
            tinycolor({ ...rgbColor, r: 255 }).toRgbString(),
          ]}
        />
        <View style={styles.sliderWrapper}>
          <ColorSlider
            value={rgbColor.g}
            onValueChange={handleGreenChange}
            knobColor="lightgreen"
            backgroundColor={[
              tinycolor({ ...rgbColor, g: 0 }).toRgbString(),
              tinycolor({ ...rgbColor, g: 255 }).toRgbString(),
            ]}
          />
        </View>
        <View style={styles.sliderWrapper}>
          <ColorSlider
            value={rgbColor.b}
            onValueChange={handleBlueChange}
            knobColor="lightblue"
            backgroundColor={[
              tinycolor({ ...rgbColor, b: 0 }).toRgbString(),
              tinycolor({ ...rgbColor, b: 255 }).toRgbString(),
            ]}
          />
        </View>
        <View style={styles.sliderWrapper}>
          <Slider
            max={100}
            value={rgbColor.a * 100}
            onValueChange={handleAlphaChange}
            knobColor="white"
            backgroundColor={[
              'transparent',
              /**
               * in order to the preserve ordinal alpha spectrum
               */
              tinycolor({
                r: rgbColor.r,
                g: rgbColor.g,
                b: rgbColor.b,
              }).toRgbString(),
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
