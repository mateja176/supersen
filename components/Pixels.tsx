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
import { Link, useParams } from 'react-router-native';
import useTheme from '../hooks/theme';
import usePixels from '../hooks/usePixels';
import { IPixel } from '../models/pixels';
import { pixelsX } from '../services/env';
import * as services from '../services/pixels';
import { initialColor } from '../utils/pixels';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import ColorPicker from './ColorPicker/ColorPicker';
import Pixel from './Pixel';

const initialPixels: IPixel[] = [];

const buttonGroupHeight = 32;
const colorPickerWrapperHeight = 284;

const colorPickerContentHorizontalPaddingPct = 4;
const colorPickerContentVerticalPadding = 10;
const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
  },
  pixels: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  colorPickerWrapper: {
    position: 'absolute',
    width: '100%',
    height: colorPickerWrapperHeight,
    paddingHorizontal: `${colorPickerContentHorizontalPaddingPct}%`,
    paddingVertical: colorPickerContentVerticalPadding,
  },
});

export interface PixelsProps {}

const Pixels: React.FC<PixelsProps> = (props) => {
  const dimensions = useWindowDimensions();

  const { theme } = useTheme();

  const { ip } = useParams<'ip'>();

  const pixelsMutation = useMutation(services.mutatePixels, {
    onSuccess: () => {
      Toast.show('Pixels updated!', {
        backgroundColor: theme.colors.bg.success,
        duration: Toast.durations.SHORT,
      });
    },
  });
  const handleError = React.useCallback(
    (error: unknown) => {
      Toast.show(
        `Update failed: ${isError(error) ? error.message : 'Unknown reason'}`,
        {
          backgroundColor: theme.colors.bg.danger,
          duration: Toast.durations.SHORT,
        },
      );
    },
    [theme.colors.bg.danger],
  );
  React.useEffect(() => {
    if (ip) {
      pixelsMutation.mutateAsync({ ip, pixels }).catch(handleError);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const handlePress = () => {
    if (ip) {
      pixelsMutation.mutateAsync({ ip, pixels }).catch(handleError);
    }
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
  const [, setColorPickerVisible] = React.useState(false);
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
    invertSelection,
    setColor,
    setHue,
    setSaturationAndLightnessChange,
  } = usePixels();
  const selectedCount = React.useMemo(() => {
    return pixels.reduce(
      (selectedCount1, pixel) =>
        pixel.selected ? selectedCount1 + 1 : selectedCount1,
      0,
    );
  }, [pixels]);
  const handleToggle = React.useCallback(
    (i: number) => {
      return setPixels((pixels) => {
        return pixels.map((pixel, i1) => {
          if (i === i1) {
            if (selectedCount < 2) {
              setColorPickerVisibleAndAnimate(!pixel.selected);
            }
            return {
              ...pixel,
              selected: !pixel.selected,
            };
          } else {
            return pixel;
          }
        }, initialPixels);
      });
    },
    [selectedCount, setColorPickerVisibleAndAnimate, setPixels],
  );

  const selectAll = () => {
    setSelected(true);
    setColorPickerVisibleAndAnimate(true);
  };
  const deselectAll = () => {
    setSelected(false);
    setColorPickerVisibleAndAnimate(false);
  };
  const handleInvert = () => {
    if (selectedCount === pixels.length) {
      setColorPickerVisibleAndAnimate(false);
    }
    invertSelection();
  };

  return (
    <View style={styles.wrapper}>
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
        <Link to="/">
          <Button
            iconName="arrow-back-outline"
            backgroundColor={theme.colors.bg.dark}
            disabledColor={theme.colors.bg.dark}
            disabled
            color={theme.colors.text.white}
            accessibilityLabel="Back to dashboard"
          />
        </Link>
        <Button
          onPress={handleInvert}
          iconName="contrast-outline"
          backgroundColor={theme.colors.bg.light}
          color={theme.colors.text.dark}
          accessibilityLabel="Invert selection"
        />
        <Button
          onPress={deselectAll}
          disabled={selectedCount === 0}
          iconName="close"
          backgroundColor={theme.colors.bg.danger}
          accessibilityLabel="Deselect all"
        />
        <Button
          onPress={selectAll}
          disabled={selectedCount === pixels.length}
          iconName="checkmark"
          backgroundColor={theme.colors.bg.primary}
          accessibilityLabel="Select all"
        />
        <Button
          onPress={toggleColorPicker}
          disabled={!currentColor}
          iconName="color-palette-outline"
          backgroundColor={theme.colors.bg.info}
          accessibilityLabel="Toggle color palette"
        />
        <Button
          onPress={handlePress}
          disabled={pixelsMutation.isLoading}
          backgroundColor={theme.colors.bg.success}
          iconName={
            pixelsMutation.isLoading ? 'timer-outline' : 'arrow-forward'
          }
          accessibilityLabel="Upload changes"
        />
      </ButtonGroup>
    </View>
  );
};

export default Pixels;
