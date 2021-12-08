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
import useLayout from '../hooks/useLayout';
import { IPixel } from '../models/pixels';
import { pixelsX } from '../services/env';
import * as services from '../services/pixels';
import { initialColor, pixelsRange } from '../utils/pixels';
import ButtonGroup from './ButtonGroup';
import ColorPicker from './ColorPicker/ColorPicker';
import IconButton from './IconButton';
import Pixel from './Pixel';

const initialPixelsAndStatus: { deselected: boolean; pixels: IPixel[] } = {
  deselected: true,
  pixels: [],
};

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
    paddingLeft: '4%',
    paddingRight: '4%',
    paddingTop: 10,
    paddingBottom: 10,
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

  const buttonGroupLayout = useLayout();
  const colorPickerWrapperLayout = useLayout();
  const colorPickerWrapperTranslateY = React.useRef(
    new Animated.Value(0),
  ).current;
  const [colorPickerVisible, setColorPickerVisible] = React.useState(false);
  const setColorPickerVisibleAndAnimate = React.useCallback(
    (action: React.SetStateAction<boolean>) => {
      setColorPickerVisible((visible) => {
        const newVisible =
          typeof action === 'function' ? action(visible) : action;

        if (colorPickerWrapperLayout.layoutRef.current) {
          const toValue = newVisible
            ? -colorPickerWrapperLayout.layoutRef.current.height
            : 0;
          Animated.timing(colorPickerWrapperTranslateY, {
            toValue,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }

        return newVisible;
      });
    },
    [colorPickerWrapperLayout, colorPickerWrapperTranslateY],
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
    setChannel,
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
        {pixelsRange.map((i) => {
          const isRangeSelectIndex = i === rangeSelectIndex;

          return (
            <Pixel
              key={i}
              pixel={pixels[i]}
              isRangeSelectIndex={isRangeSelectIndex}
              style={{
                marginRight: '4%',
                marginLeft: i % pixelsX === 0 ? '4%' : 0,
                marginTop: i < pixelsX ? '4%' : 0,
                marginBottom: '4%',
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
            bottom:
              buttonGroupLayout.layoutRef.current &&
              colorPickerWrapperLayout.layoutRef.current
                ? buttonGroupLayout.layoutRef.current.height -
                  colorPickerWrapperLayout.layoutRef.current.height
                : -dimensions.height,
            transform: [
              {
                translateY: colorPickerWrapperTranslateY,
              },
            ],
            backgroundColor: theme.colors.bg.white,
          },
        ]}
        onLayout={colorPickerWrapperLayout.onLayout}
      >
        <ColorPicker
          color={currentColor ?? initialColor}
          onChange={setColor}
          onChannelChange={setChannel}
        />
      </Animated.View>

      <ButtonGroup onLayout={buttonGroupLayout.onLayout}>
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
