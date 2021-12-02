import React from 'react';
import { RGBColor } from 'react-color';
import { View, ViewProps } from 'react-native';

export interface PixelProps extends ViewProps {
  color: RGBColor;
}

const Pixel: React.FC<PixelProps> = (props) => {
  return (
    <View
      style={{
        marginRight: '5%',
        marginBottom: '5%',
        width: '20%',
        paddingTop: '20%',
        backgroundColor: `rgba(${props.color.r}, ${props.color.g}, ${props.color.b}, ${props.color.a})`,
      }}
    />
  );
};

export default Pixel;
