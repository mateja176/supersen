import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import tinycolor from 'tinycolor2';
import { Color } from '../../models/pixels';

const swatches = [
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgrey',
  'lightgreen',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'black',
  'white',
];

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  swatch: {
    height: 20,
    width: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'solid',
    marginRight: 4,
  },
});

export interface SwatchesProps {
  onChange: (color: Color) => void;
}

const Swatches: React.FC<SwatchesProps> = (props) => {
  return (
    <ScrollView horizontal contentContainerStyle={styles.wrapper}>
      {swatches.map((swatch) => (
        <Pressable
          key={swatch}
          onPress={() => {
            props.onChange(tinycolor(swatch).toRgb());
          }}
        >
          <View style={[styles.swatch, { backgroundColor: swatch }]} />
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default Swatches;
