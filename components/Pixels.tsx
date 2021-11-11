import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SketchPicker, SketchPickerProps } from 'react-color';
import { Button, StyleSheet, View } from 'react-native';
import Toast from 'react-native-root-toast';
import { isError, useMutation } from 'react-query';
import useTheme from '../hooks/theme';
import { Color } from '../models/pixels';
import { color } from '../services/env';
import { setPixels } from '../services/pixels';
import { pixelsRange } from '../utils/pixels';
import Pixel from './Pixel';

const [r, g, b] = color;

const minimalAlpha = 0.01;
const initialAlpha = 1;
const initialColor: Color = {
  r,
  g,
  b,
  a: initialAlpha,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pixels: {
    marginBottom: 20,
  },
  buttonWrapper: {
    marginTop: 20,
  },
});

export interface PixelsProps {}

const Pixels: React.FC<PixelsProps> = (props) => {
  const theme = useTheme();

  const setPixelsMutation = useMutation(setPixels, {
    onSuccess: () => {
      Toast.show('Pixels Updated!', {
        backgroundColor: theme.colors.success,
        duration: Toast.durations.SHORT,
      });
    },
    onError: (error) => {
      Toast.show(
        `Update Failed: ${isError(error) ? error.message : 'Unknown reason'}`,
        {
          backgroundColor: theme.colors.danger,
          duration: Toast.durations.SHORT,
        },
      );
    },
  });

  const [currentColor, setCurrentColor] = useState(initialColor);
  const [color, setColor] = useState(initialColor);

  React.useEffect(() => {
    setPixelsMutation.mutateAsync(pixelsRange.map(() => color));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange: SketchPickerProps['onChange'] = (colorResult) => {
    setCurrentColor({
      ...colorResult.rgb,
      a: (colorResult.rgb.a ?? initialAlpha) || minimalAlpha,
    });
  };
  const handleChangeComplete: SketchPickerProps['onChangeComplete'] = (
    colorResult,
  ) => {
    setColor({
      ...colorResult.rgb,
      a: (colorResult.rgb.a ?? initialAlpha) || minimalAlpha,
    });
  };
  const handlePress = () => {
    setPixelsMutation.mutateAsync([color]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pixels}>
        <Pixel color={color} />
      </View>
      <SketchPicker
        color={currentColor}
        onChange={handleChange}
        onChangeComplete={handleChangeComplete}
      />
      <StatusBar style="auto" />
      <View style={styles.buttonWrapper}>
        <Button
          disabled={setPixelsMutation.isLoading}
          onPress={handlePress}
          title="Submit"
        />
      </View>
    </View>
  );
};

export default Pixels;
