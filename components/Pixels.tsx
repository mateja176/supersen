import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SketchPicker, SketchPickerProps } from 'react-color';
import { Button, StyleSheet, View } from 'react-native';
import Toast from 'react-native-root-toast';
import { isError, useMutation } from 'react-query';
import usePixels from '../hooks/pixels';
import useTheme from '../hooks/theme';
import * as services from '../services/pixels';
import { pixelsRange } from '../utils/pixels';
import Pixel from './Pixel';

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

  const setPixelsMutation = useMutation(services.setPixels, {
    onSuccess: () => {
      Toast.show('Pixels Updated!', {
        backgroundColor: theme.colors.success,
        duration: Toast.durations.SHORT,
      });
    },
  });

  const { pixels, toggleSelected, setRgbColor } = usePixels();

  React.useEffect(() => {
    setPixelsMutation.mutateAsync(pixels).catch(handleError);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentColor = pixels.find(({ selected }) => selected);

  const handleChange: SketchPickerProps['onChange'] = ({ rgb }) => {
    setRgbColor(rgb);
  };
  const handleChangeComplete: SketchPickerProps['onChangeComplete'] = ({
    rgb,
  }) => {
    setRgbColor(rgb);
  };
  const handlePress = () => {
    setPixelsMutation.mutateAsync(pixels).catch(handleError);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pixels}>
        {pixelsRange.map((xRange) => {
          return xRange.map((i) => {
            return (
              <Pixel
                key={i}
                pixel={pixels[i]}
                onToggle={() => toggleSelected(i)}
              />
            );
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
