import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { CheckBox, PressableProps } from 'react-native-web';
import { IPixel } from '../models/pixels';

const styles = StyleSheet.create({
  pixel: {
    marginRight: '5%',
    marginBottom: '5%',
    width: '20%',
    paddingTop: '20%',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'solid',
  },
  checkBox: {
    top: '5%',
    right: '5%',
    position: 'absolute',
  },
});

export interface PixelProps extends PressableProps {
  pixel: IPixel;
  onToggle: () => void;
}

const Pixel: React.FC<PixelProps> = ({ pixel, onToggle, ...props }) => {
  return (
    <Pressable
      {...props}
      style={[
        styles.pixel,
        {
          backgroundColor: `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`,
        },
      ]}
      onPress={onToggle}
    >
      <CheckBox style={styles.checkBox} value={pixel.selected} />
    </Pressable>
  );
};

export default Pixel;
