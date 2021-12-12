import React from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { isError, useMutation } from 'react-query';
import usePixels from '../hooks/pixels';
import useTheme from '../hooks/theme';
import { IPixel } from '../models/pixels';
import { pixelsX } from '../services/env';
import * as services from '../services/pixels';
import { initialColor } from '../utils/pixels';
import ButtonGroup from './ButtonGroup';
import ColorPicker from './ColorPicker/ColorPicker';
import IconButton from './IconButton';
import Pixel from './Pixel';

const initialPixelsAndStatus: { deselected: boolean; pixels: IPixel[] } = {
  deselected: true,
  pixels: [],
};

const buttonGroupHeight = 32;
const colorPickerWrapperHeight = 284;

const colorPickerContentHorizontalPaddingPct = 4;
const colorPickerContentVerticalPadding = 10;
const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  pixels: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  colorPickerWrapper: {
    position: 'absolute',
    width: '100%',
    height: colorPickerWrapperHeight,
    paddingLeft: `${colorPickerContentHorizontalPaddingPct}%`,
    paddingRight: `${colorPickerContentHorizontalPaddingPct}%`,
    paddingTop: colorPickerContentVerticalPadding,
    paddingBottom: colorPickerContentVerticalPadding,
  },
});

export interface PixelsProps {}

const Pixels: React.FC<PixelsProps> = (props) => {
  const dimensions = useWindowDimensions();

  const { theme } = useTheme();

  const setPixelsMutation = useMutation(services.setPixels, {
    onSuccess: () => {
      Toast.show('Pixels Updated!', {
        backgroundColor: theme.colors.bg.success,
        duration: Toast.durations.SHORT,
      });
    },
  });
  const handleError = (error: unknown) => {
    Toast.show(
      `Update Failed: ${isError(error) ? error.message : 'Unknown reason'}`,
      {
        backgroundColor: theme.colors.bg.danger,
        duration: Toast.durations.SHORT,
      },
    );
  };
  React.useEffect(() => {
    setPixelsMutation.mutateAsync(pixels).catch(handleError);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const handlePress = () => {
    setPixelsMutation.mutateAsync(pixels).catch(handleError);
  };

  const colorPickerContentLayout = React.useMemo(() => {
    const colorPickerContentHorizontalPadding =
      (dimensions.width * colorPickerContentHorizontalPaddingPct) / 100;

    return {
      x: colorPickerContentHorizontalPadding,
      y:
        dimensions.height -
        buttonGroupHeight -
        colorPickerWrapperHeight +
        colorPickerContentVerticalPadding,
      width: dimensions.width - 2 * colorPickerContentHorizontalPadding,
      height: colorPickerWrapperHeight,
    };
  }, [dimensions.height, dimensions.width]);
  const colorPickerWrapperTranslateY = React.useRef(
    new Animated.Value(0),
  ).current;
  const [colorPickerVisible, setColorPickerVisible] = React.useState(false);
  const setColorPickerVisibleAndAnimate = React.useCallback(
    (action: React.SetStateAction<boolean>) => {
      setColorPickerVisible((visible) => {
        const newVisible =
          typeof action === 'function' ? action(visible) : action;

        const toValue = newVisible ? -colorPickerWrapperHeight : 0;
        Animated.timing(colorPickerWrapperTranslateY, {
          toValue,
          duration: 300,
          useNativeDriver: false,
        }).start();

        return newVisible;
      });
    },
    [colorPickerWrapperTranslateY],
  );
  const toggleColorPicker = () => {
    setColorPickerVisibleAndAnimate((visible) => {
      return !visible;
    });
  };

  const [rangeSelectIndex, setRangeSelectIndex] = React.useState<number | null>(
    null,
  );
  const {
    pixels,
    currentColor,
    setPixels,
    selectRange,
    setSelected,
    setColor,
    setHue,
    setSaturationAndLightnessChange,
  } = usePixels();
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
          setColorPickerVisibleAndAnimate(false);
        }

        return pixelsAndStatus.pixels;
      });
    },
    [setColorPickerVisibleAndAnimate, setPixels],
  );

  const { allSelected, noneSelected } = React.useMemo(() => {
    const selectedCount = pixels.reduce(
      (selectedCount1, pixel) =>
        pixel.selected ? selectedCount1 + 1 : selectedCount1,
      0,
    );
    return {
      allSelected: selectedCount === pixels.length,
      noneSelected: selectedCount === 0,
    };
  }, [pixels]);

  const selectAll = () => {
    setSelected(true);
    setColorPickerVisibleAndAnimate(true);
  };
  const deselectAll = () => {
    setSelected(false);
    setColorPickerVisibleAndAnimate(false);
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          height: dimensions.height,
        },
      ]}
    >
      <ScrollView contentContainerStyle={styles.pixels} scrollEnabled>
        {pixels.map((pixel, i) => {
          const isRangeSelectIndex = i === rangeSelectIndex;

          return (
            <Pixel
              key={i}
              pixel={pixel}
              isRangeSelectIndex={isRangeSelectIndex}
              style={{
                marginRight: '4%',
                marginLeft: i % pixelsX === 0 ? '4%' : 0,
                marginTop: '4%',
                marginBottom: i > pixels.length - 5 ? 300 : 0,
              }}
              onPress={() => {
                if (rangeSelectIndex === null) {
                  handleToggle(i);
                } else {
                  selectRange(
                    Math.min(i, rangeSelectIndex),
                    Math.max(i, rangeSelectIndex),
                  );
                  setRangeSelectIndex(null);
                }
              }}
              onLongPress={() => {
                if (isRangeSelectIndex) {
                  setRangeSelectIndex(null);
                } else {
                  setRangeSelectIndex(i);
                }
              }}
            />
          );
        })}
      </ScrollView>

      <Animated.View
        style={[
          styles.colorPickerWrapper,
          {
            bottom: buttonGroupHeight - colorPickerWrapperHeight,
            transform: [
              {
                translateY: colorPickerWrapperTranslateY,
              },
            ],
            backgroundColor: theme.colors.bg.white,
          },
        ]}
      >
        <ColorPicker
          color={currentColor ?? initialColor}
          layout={colorPickerContentLayout}
          onChange={setColor}
          onHueChange={setHue}
          onSaturationAndLightnessChange={setSaturationAndLightnessChange}
        />
      </Animated.View>

      <ButtonGroup>
        <IconButton
          onPress={deselectAll}
          disabled={noneSelected}
          iconName="close"
          backgroundColor={theme.colors.bg.dark}
        >
          Deselect All
        </IconButton>
        <IconButton
          onPress={selectAll}
          disabled={allSelected}
          iconName="checkmark"
          backgroundColor={theme.colors.bg.success}
        >
          Select All
        </IconButton>
        <IconButton
          onPress={toggleColorPicker}
          disabled={!currentColor}
          iconName={colorPickerVisible ? 'eye-off' : 'eye'}
          backgroundColor={
            colorPickerVisible
              ? theme.colors.bg.secondary
              : theme.colors.bg.info
          }
        >
          Color
        </IconButton>
        <IconButton
          onPress={handlePress}
          disabled={setPixelsMutation.isLoading}
          iconName={
            setPixelsMutation.isLoading ? 'timer-outline' : 'arrow-forward'
          }
        >
          Submit
        </IconButton>
      </ButtonGroup>
    </View>
  );
};

export default Pixels;
