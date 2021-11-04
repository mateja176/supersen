import { INITIAL_COLOR } from '@env';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { RGBColor, SketchPicker, SketchPickerProps } from 'react-color';
import { StyleSheet, View } from 'react-native';
import Pixel from './components/Pixel';

if (!INITIAL_COLOR) {
  throw new Error('INITIAL_COLOR not defined');
}

const [r, g, b] = INITIAL_COLOR.split(',').map(Number);

const initialAlpha = 255;
const initialColor: Required<RGBColor> = {
  r: r ?? 255,
  g: g ?? 255,
  b: b ?? 255,
  a: initialAlpha,
};
export default function App(): React.ReactElement {
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [color, setColor] = useState(initialColor);

  const handleChange: SketchPickerProps['onChange'] = (colorResult) => {
    setCurrentColor({
      ...colorResult.rgb,
      a: colorResult.rgb.a ?? initialAlpha,
    });
  };
  const handleChangeComplete: SketchPickerProps['onChangeComplete'] = (
    colorResult,
  ) => {
    setColor({ ...colorResult.rgb, a: colorResult.rgb.a ?? initialAlpha });
  };
  return (
    <View style={styles.container}>
      <Pixel color={color} />

      <SketchPicker
        color={currentColor}
        onChange={handleChange}
        onChangeComplete={handleChangeComplete}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
