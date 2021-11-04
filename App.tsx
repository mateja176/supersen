import { INITIAL_COLOR } from '@env';
import { StatusBar } from 'expo-status-bar';
import { isRight } from 'fp-ts/lib/Either';
import React, { useState } from 'react';
import { RGBColor, SketchPicker, SketchPickerProps } from 'react-color';
import { StyleSheet, View } from 'react-native';
import Pixel from './components/Pixel';
import Color from './models/Color';

if (!INITIAL_COLOR) {
  throw new Error('INITIAL_COLOR not defined');
}
const maybeColor = Color.decode(JSON.parse(INITIAL_COLOR));
if (!isRight(maybeColor)) {
  throw new Error(
    'INITIAL_COLOR must be of type [u_int8_t, u_int8_t, u_int8_t]',
  );
}
const [r, g, b] = maybeColor.right;

const initialAlpha = 255;
const initialColor: Required<RGBColor> = {
  r,
  g,
  b,
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
