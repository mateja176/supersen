import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import useTheme from '../hooks/theme';
import { IPixel } from '../models/pixels';
import { boards, pixelsX, pixelsY } from '../services/env';
import CheckBox from './Checkbox';

const pixelsCount = pixelsX * pixelsY * boards;

const styles = StyleSheet.create({
  pixel: {
    width: '20%',
    paddingTop: '20%',
    position: 'relative',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  checkBox: {
    top: 8,
    right: 8,
    position: 'absolute',
  },
});

export interface PixelProps {
  index: number;
  rangeSelectIndex: number | null;
  pixel: IPixel;
  onPress: (index: number, rangeSelectIndex: number | null) => void;
  onLongPress: (index: number, isRangeSelectIndex: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

const Pixel: React.FC<PixelProps> = ({
  index,
  rangeSelectIndex,
  pixel,
  onPress,
  onLongPress,
  style,
  ...props
}) => {
  const isRangeSelectIndex = index === rangeSelectIndex;

  const handlePress = () => {
    onPress(index, rangeSelectIndex);
  };
  const handleLongPress = () => {
    onLongPress(index, isRangeSelectIndex);
  };

  const { theme } = useTheme();

  const outlineStyle = {
    outlineWidth: isRangeSelectIndex ? 2 : 0,
    outlineColor: theme.colors.bg.success,
    outlineStyle: 'solid',
  };

  return (
    <Pressable
      {...props}
      style={[
        style,
        styles.pixel,
        {
          ...(isRangeSelectIndex ? { borderWidth: 0 } : {}),
          ...outlineStyle,
          borderColor: theme.colors.bg.secondary,
          backgroundColor: pixel.color.toHexString(),
          marginLeft: index % pixelsX === 0 ? '4%' : 0,
          marginBottom: index > pixelsCount - 5 ? 300 : 0,
        },
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      accessible
      accessibilityLabel="Pixel"
      accessibilityHint="Defines the color of the pixel on the device"
      accessibilityRole="button"
      accessibilityActions={[
        { name: 'activate', label: 'Select the pixel to change its color' },
        {
          name: 'longpress',
          label: 'Use the pixel as an anchor for range selection',
        },
      ]}
    >
      <CheckBox style={styles.checkBox} checked={pixel.selected} />
    </Pressable>
  );
};

export default React.memo(Pixel);
