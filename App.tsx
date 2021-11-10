import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SketchPicker, SketchPickerProps } from 'react-color';
import { StyleSheet, View } from 'react-native';
import Pixel from './components/Pixel';
import { Color } from './models/pixels';
import { color } from './services/env';
import { setPixels } from './services/pixels';
import { pixelsRange } from './utils/pixels';

const [r, g, b] = color;

const initialAlpha = 255;
const initialColor: Color = {
  r,
  g,
  b,
  a: initialAlpha,
};
export default function App(): React.ReactElement {
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [color, setColor] = useState(initialColor);

  React.useEffect(() => {
    setPixels(pixelsRange.map(() => color));
  }, []);

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
