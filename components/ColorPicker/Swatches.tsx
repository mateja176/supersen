import React from 'react';
import {
  Pressable,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import tinycolor from 'tinycolor2';
import useTheme from '../../hooks/theme';
import { Color } from '../../models/pixels';

const swatchColors = [
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
  'white',
].map((swatch) => tinycolor(swatch));

const swatchRadius = 4;

const shadowOffsetSize = 6;
type ShadowOffset = NonNullable<ViewStyle['shadowOffset']>;
const shadowOffset: ShadowOffset = {
  width: shadowOffsetSize,
  height: shadowOffsetSize,
};
const invertedShadowOffset: ShadowOffset = {
  width: -shadowOffsetSize,
  height: -shadowOffsetSize,
};
const getShadowProps = (offset: ShadowOffset) => ({
  shadowRadius: swatchRadius,
  offset,
  elevation: 6,
});

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingLeft: 6,
  },
  swatch: {
    height: 20,
    width: 20,
    borderRadius: swatchRadius,
    borderWidth: 1,
    borderStyle: 'solid',
    marginRight: 6,
    marginVertical: 6,
  },
});

export interface SwatchesProps extends ScrollViewProps {
  onChange: React.Dispatch<Color>;
}

const Swatches: React.FC<SwatchesProps> = ({
  onChange,
  contentContainerStyle,
  ...props
}) => {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      {...props}
      contentContainerStyle={[styles.wrapper, contentContainerStyle]}
    >
      {swatchColors.map((swatchColor) => {
        const swatchHex = swatchColor.toHexString();
        // * using currentColor is a performance bottleneck
        const isSelected = false;
        const shadowColor = tinycolor(swatchHex).darken(55).toHexString();
        return (
          <Pressable
            key={swatchHex}
            onPress={() => {
              onChange(tinycolor(swatchColor));
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
                  backgroundColor: swatchHex,
                },
                isSelected
                  ? {
                      ...getShadowProps(shadowOffset),
                      shadowColor,
                    }
                  : {},
              ]}
            >
              {/* patches multiple shadow support */}
              <View
                style={
                  isSelected
                    ? {
                        ...getShadowProps(invertedShadowOffset),
                        shadowColor,
                      }
                    : {}
                }
              />
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default React.memo(Swatches);
