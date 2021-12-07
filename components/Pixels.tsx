import React from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { isError, useMutation } from 'react-query';
import usePixels from '../hooks/pixels';
import useTheme from '../hooks/theme';
import useLayout from '../hooks/useLayout';
import { IPixel } from '../models/pixels';
import * as services from '../services/pixels';
import { initialColor, pixelsRange } from '../utils/pixels';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import ColorPicker from './ColorPicker/ColorPicker';
import Grow from './Grow';
import IconButton from './IconButton';
import Pixel from './Pixel';

const initialPixelsAndStatus: { deselected: boolean; pixels: IPixel[] } = {
  deselected: true,
  pixels: [],
};

const styles = StyleSheet.create({
  pixels: {
    position: 'relative',
    paddingTop: '5%',
    paddingLeft: '5%',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  grow: {
    width: '95%',
    position: 'sticky' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    bottom: 0,
    alignItems: 'center',
  },
  colorPickerWrapper: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export interface PixelsProps {}

const Pixels: React.FC<PixelsProps> = (props) => {
  const dimensions = useWindowDimensions();

  const theme = useTheme();

  const handleError = (error: unknown) => {
    Toast.show(
      `Update Failed: ${isError(error) ? error.message : 'Unknown reason'}`,
      {
        backgroundColor: theme.colors.bg.danger,
        duration: Toast.durations.SHORT,
      },
    );
  };

  const setPixelsMutation = useMutation(services.setPixels, {
    onSuccess: () => {
      Toast.show('Pixels Updated!', {
        backgroundColor: theme.colors.bg.success,
        duration: Toast.durations.SHORT,
      });
    },
  });

  const [colorPickerVisible, setColorPickerVisible] = React.useState(false);
  const toggleColorPicker = () => {
    setColorPickerVisible((visible) => !visible);
  };
  const { layoutRef, onLayout } = useLayout();

  const { pixels, currentColor, setPixels, setColor, setChannel } = usePixels();

  const handleToggle = React.useCallback(
    (i: number) => {
      return setPixels((pixels) => {
        const pixelsAndStatus = pixels.reduce(
          (pixelsAndStatus1, pixel, index) => {
            const togglePixel = i === index;
            return {
              pixels: pixelsAndStatus1.pixels.concat(
                togglePixel
                  ? {
                      ...pixel,
                      selected: !pixel.selected,
                    }
                  : pixel,
              ),
              deselected:
                pixelsAndStatus1.deselected &&
                (togglePixel ? pixel.selected : !pixel.selected),
            };
          },
          initialPixelsAndStatus,
        );

        if (pixelsAndStatus.deselected) {
          setColorPickerVisible(false);
        }

        return pixelsAndStatus.pixels;
      });
    },
    [setPixels],
  );

  React.useEffect(() => {
    setPixelsMutation.mutateAsync(pixels).catch(handleError);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePress = () => {
    setPixelsMutation.mutateAsync(pixels).catch(handleError);
  };

  return (
    <View
      style={{
        height: dimensions.height,
      }}
    >
      <ScrollView contentContainerStyle={styles.pixels} scrollEnabled>
        {pixelsRange.map((i) => {
          return (
            <Pixel key={i} pixel={pixels[i]} onToggle={() => handleToggle(i)} />
          );
        })}
        <Grow
          style={styles.grow}
          layoutRef={layoutRef}
          visible={colorPickerVisible}
        >
          <View
            style={[
              styles.colorPickerWrapper,
              {
                backgroundColor: theme.colors.bg.white,
              },
            ]}
            onLayout={onLayout}
          >
            <ColorPicker
              color={currentColor ?? initialColor}
              onChange={setColor}
              onChannelChange={setChannel}
            />
          </View>
        </Grow>
      </ScrollView>

      <ButtonGroup>
        <IconButton
          onPress={toggleColorPicker}
          iconName={colorPickerVisible ? 'eye-off' : 'eye'}
          backgroundColor={
            colorPickerVisible
              ? theme.colors.bg.secondary
              : theme.colors.bg.success
          }
          disabled={!currentColor}
        >
          Color
        </IconButton>
        <Button
          disabled={setPixelsMutation.isLoading}
          onPress={handlePress}
          title="Submit"
        />
      </ButtonGroup>
    </View>
  );
};

export default Pixels;
