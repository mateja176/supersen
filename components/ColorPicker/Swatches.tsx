import React from 'react';
import {
  Pressable,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';
import tinycolor from 'tinycolor2';
import useTheme from '../../hooks/theme';
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
    borderStyle: 'solid',
    marginRight: 4,
  },
});

export interface SwatchesProps extends ScrollViewProps {
  onChange: (color: Color) => void;
}

const Swatches: React.FC<SwatchesProps> = ({ onChange, ...props }) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      {...props}
      contentContainerStyle={[props.contentContainerStyle, styles.wrapper]}
    >
      {swatches.map((swatch) => (
        <Pressable
          key={swatch}
          onPress={() => {
            onChange(tinycolor(swatch).toRgb());
          }}
          accessible
          accessibilityLabel="Swatch"
          accessibilityHint="Part of predefined color palette"
          accessibilityRole="button"
          accessibilityActions={[
            { name: 'activate', label: 'Set color to swatch color' },
          ]}
        >
          <View
            style={[
              styles.swatch,
              {
                borderColor: theme.colors.bg.secondary,
                backgroundColor: swatch,
              },
            ]}
          />
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default Swatches;
