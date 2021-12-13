import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import useTheme from '../hooks/theme';
import { IPixel } from '../models/pixels';
import CheckBox from './Checkbox';

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

export interface PixelProps
  extends Omit<
    PressableProps,
    | 'style'
    | 'accessible'
    | 'accessibilityLabel'
    | 'accessibilityHint'
    | 'accessibilityRole'
    | 'accessibilityActions'
  > {
  pixel: IPixel;
  isRangeSelectIndex: boolean;
  onPress: () => void;
  onLongPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const Pixel: React.FC<PixelProps> = ({
  pixel,
  isRangeSelectIndex,
  onPress,
  onLongPress,
  style,
  ...props
}) => {
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
        styles.pixel,
        {
          ...(isRangeSelectIndex ? { borderWidth: 0 } : {}),
          ...outlineStyle,
          borderColor: theme.colors.bg.secondary,
          backgroundColor: pixel.color.toHexString(),
        },
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
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

export default Pixel;
