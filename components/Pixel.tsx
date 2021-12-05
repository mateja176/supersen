import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from 'react-native';
import { CheckBox } from 'react-native-web';
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

export interface PixelProps extends ViewProps {
  pixel: IPixel;
  onToggle: () => void;
}

const Pixel: React.FC<PixelProps> = ({ pixel, onToggle, ...props }) => {
  return (
    <TouchableWithoutFeedback onPress={onToggle}>
      <View
        {...props}
        style={[
          styles.pixel,
          {
            backgroundColor: `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`,
          },
        ]}
      >
        <CheckBox style={styles.checkBox} value={pixel.selected} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Pixel;
