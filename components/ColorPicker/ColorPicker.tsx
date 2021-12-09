import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import tinycolor, { ColorFormats } from 'tinycolor2';
import { NumberPair, WithLayout } from '../../hooks/usePan/models';
import usePan1D from '../../hooks/usePan/usePan1D';
import usePan2D from '../../hooks/usePan/usePan2D';
import { Color, ColorWithOriginalInput } from '../../models/pixels';
import Slider from '../Slider/Slider';
import Swatches from './Swatches';

const saturationAndLightnessHeight = 200;

const maxHue = 359;
const maxSaturationAndLightness: NumberPair = [100, 100];

const hueGradientStart: LinearGradientProps['start'] = { x: 0, y: 0 };
const hueGradientEnd: LinearGradientProps['end'] = { x: 1, y: 1 };

const hueColors = [
  '#ff0000',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#ff00ff',
  '#ff0000',
];

const styles = StyleSheet.create({
  hueSlider: {
    marginTop: 20,
  },
  hueSliderBackground: {
    width: '100%',
    height: '100%',
  },
  swatchesLayout: {
    marginTop: 20,
  },
});

export interface ColorPickerProps extends ViewProps, WithLayout {
  color: Color;
  onChange: React.Dispatch<Color>;
  onHueChange: (hue: ColorFormats.HSV['h']) => void;
  onSaturationAndLightnessChange: (
    saturationAndLightness: [ColorFormats.HSV['s'], ColorFormats.HSV['v']],
  ) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  layout,
  onChange,
  onHueChange,
  onSaturationAndLightnessChange,
  ...props
}) => {
  const hsvColor = React.useMemo(() => {
    return color.toHsv();
  }, [color]);
  /**
   * when either saturation or value are 0
   * the hue gets mapped to 0
   */
  const originalHue = React.useMemo(() => {
    return (color as ColorWithOriginalInput)._originalInput.h ?? hsvColor.h;
  }, [color, hsvColor.h]);

  const saturationAndLightness: NumberPair = React.useMemo(
    () => [hsvColor.s * 100, 100 - hsvColor.v * 100],
    [hsvColor.s, hsvColor.v],
  );
  const handleSaturationAndLightnessChange: typeof onSaturationAndLightnessChange =
    React.useCallback(
      ([s, v]) => {
        // * use decimal format in order to support 1% otherwise it will be mapped to 1 or 100%
        onSaturationAndLightnessChange([s / 100, (100 - v) / 100]);
      },
      [onSaturationAndLightnessChange],
    );
  const saturationAndLightnessStore = usePan2D({
    value: saturationAndLightness,
    max: maxSaturationAndLightness,
    layout: React.useMemo(
      () => layout && { ...layout, height: saturationAndLightnessHeight },
      [layout],
    ),
    onChange: handleSaturationAndLightnessChange,
  });

  const hueStore = usePan1D({
    value: originalHue,
    max: maxHue,
    onChange: onHueChange,
  });

  const hueColor = tinycolor({
    h: hueStore.scaledPosition,
    s: 100,
    v: 100,
  }).toRgbString();

  return (
    <View {...props}>
      <View>
        <Slider
          {...saturationAndLightnessStore}
          value={saturationAndLightness}
          max={maxSaturationAndLightness}
          height={saturationAndLightnessHeight}
          backgroundColor={hueColor}
        >
          <Svg width="100%" height="100%">
            <Defs>
              <SvgLinearGradient id="g3">
                <Stop stopColor="#fff" />
                <Stop offset="1" stopColor="#fff" stopOpacity="0" />
              </SvgLinearGradient>
              <SvgLinearGradient id="g4" x1=".5" y1="1" x2=".5">
                <Stop stopColor="#000" />
                <Stop offset="1" stopColor="#000" stopOpacity="0" />
              </SvgLinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#g3)" />
            <Rect width="100%" height="100%" fill="url(#g4)" />
          </Svg>
        </Slider>
        <Slider
          {...hueStore}
          wrapperStyle={styles.hueSlider}
          value={originalHue}
          max={maxHue}
          height={4}
        >
          <LinearGradient
            style={styles.hueSliderBackground}
            colors={hueColors}
            start={hueGradientStart}
            end={hueGradientEnd}
          />
        </Slider>
      </View>

      <Swatches onChange={onChange} style={styles.swatchesLayout} />
    </View>
  );
};

export default ColorPicker;
