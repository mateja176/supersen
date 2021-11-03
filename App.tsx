import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Picker, StyleSheet, Text, View } from 'react-native';
import { Color, RGBColor, SketchPicker, SketchPickerProps } from 'react-color';
import Pixel from './components/Pixel';

const initialAlpha = 255;
const initialColor: Required<RGBColor> = {
  r: 255,
  g: 0,
  b: 0,
  a: initialAlpha,
};
export default function App() {
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
