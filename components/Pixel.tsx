import React from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { CheckBox } from 'react-native-web';
import useTheme from '../hooks/theme';
import { IPixel } from '../models/pixels';

const styles = StyleSheet.create({
  pixel: {
    width: '20%',
    paddingTop: '20%',
    position: 'relative',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  checkBox: {
    top: '5%',
    right: '5%',
    position: 'absolute',
  },
});

export interface PixelProps
  extends Omit<
      PressableProps,
      | 'accessible'
      | 'accessibilityLabel'
      | 'accessibilityHint'
      | 'accessibilityRole'
      | 'accessibilityActions'
    >,
    Pick<
      ViewStyle,
      'marginLeft' | 'marginRight' | 'marginTop' | 'marginBottom'
    > {
  pixel: IPixel;
  isRangeSelectIndex: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const Pixel: React.FC<PixelProps> = ({
  pixel,
  isRangeSelectIndex,
  onPress,
  onLongPress,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
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
          marginLeft,
          marginRight,
          marginTop,
          marginBottom,
          ...(isRangeSelectIndex ? { borderWidth: 0 } : {}),
          ...outlineStyle,
          borderColor: theme.colors.bg.secondary,
          backgroundColor: `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`,
        },
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
      <CheckBox style={styles.checkBox} value={pixel.selected} />
    </Pressable>
  );
};

export default Pixel;
