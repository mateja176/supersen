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
import { boardRange } from '../utils/pixels';
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
const initialColors: Color[] = boardRange.flatMap((xRange) =>
  xRange.map(() => initialColor),
);

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  pixels: {
    paddingTop: '5%',
    paddingLeft: '5%',
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  buttonWrapper: {
    marginTop: '1rem',
  },
});

export interface PixelsProps {}

const Pixels: React.FC<PixelsProps> = (props) => {
  const theme = useTheme();

  const handleError = (error: unknown) => {
    Toast.show(
      `Update Failed: ${isError(error) ? error.message : 'Unknown reason'}`,
      {
        backgroundColor: theme.colors.danger,
        duration: Toast.durations.SHORT,
      },
    );
  };

  const setPixelsMutation = useMutation(setPixels, {
    onSuccess: () => {
      Toast.show('Pixels Updated!', {
        backgroundColor: theme.colors.success,
        duration: Toast.durations.SHORT,
      });
    },
  });

  const [currentColor, setCurrentColor] = useState(initialColor);
  const [colors, setColors] = useState(initialColors);

  React.useEffect(() => {
    setPixelsMutation.mutateAsync(colors).catch(handleError);
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
    setColors([
      {
        ...colorResult.rgb,
        a: (colorResult.rgb.a ?? initialAlpha) || minimalAlpha,
      },
    ]);
  };
  const handlePress = () => {
    setPixelsMutation.mutateAsync(colors).catch(handleError);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pixels}>
        {boardRange.map((xRange) => {
          return xRange.map((i) => {
            return <Pixel key={i} color={colors[i]} />;
          });
        })}
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
