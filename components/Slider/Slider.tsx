import React from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponderInstance,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import useTheme from '../../hooks/theme';
import { NumberPair } from '../../hooks/usePan/models';

const halfKnobSize = 10;
const knobSize = 2 * halfKnobSize;
const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  knob: {
    position: 'absolute',
    borderRadius: 50,
    width: knobSize,
    height: knobSize,
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
  },
  innerKnob: {
    borderRadius: 50,
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
  },
});

export interface SliderProps<Position extends number | NumberPair>
  extends Pick<ViewStyle, 'height' | 'width' | 'backgroundColor'> {
  value: Position;
  max: Position;
  position: Position;
  panResponder: PanResponderInstance;
  onPress: React.Dispatch<GestureResponderEvent>;
  children: React.ReactElement;
  surfaceRef?: React.MutableRefObject<View | null>;
  onLayout?: React.Dispatch<LayoutChangeEvent>;
  style?: StyleProp<ViewStyle>;
  wrapperStyle?: ViewStyle;
}

const Slider = <Position extends number | NumberPair>({
  value,
  max,
  position,
  surfaceRef,
  panResponder,
  onLayout,
  onPress,
  style,
  children,
  height = '100%',
  width = '100%',
  backgroundColor,
  wrapperStyle,
}: SliderProps<Position>): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        wrapperStyle,
        styles.wrapper,
        typeof value === 'number' ? { justifyContent: 'center' } : {},
      ]}
    >
      <Pressable
        ref={surfaceRef}
        onLayout={onLayout}
        onPress={onPress}
        style={[style, { width, height, backgroundColor }]}
      >
        {children}
      </Pressable>
      <View
        {...panResponder.panHandlers}
        style={[
          styles.knob,
          {
            borderColor: theme.colors.bg.white,
          },
          typeof position === 'number'
            ? {
                left: position - halfKnobSize,
              }
            : {
                left: position[0] - halfKnobSize,
                top: position[1] - halfKnobSize,
              },
        ]}
        accessible
        accessibilityLabel="Slider knob"
        accessibilityHint="Move the knob to adjust the slider value"
        accessibilityRole="adjustable"
        accessibilityActions={[
          { name: 'increment', label: 'Increment slider value' },
          { name: 'decrement', label: 'Decrements slider value' },
        ]}
        accessibilityValue={{
          min: 0,
          max: typeof max === 'number' ? max : max[0],
          now: typeof value === 'number' ? value : value[0],
        }}
      >
        <View
          style={[styles.innerKnob, { borderColor: theme.colors.bg.dark }]}
        />
      </View>
    </View>
  );
};

export default React.memo(Slider);
