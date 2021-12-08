import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import React from 'react';
import {
  LayoutRectangle,
  PanResponder,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import useTheme from '../hooks/theme';
import { throttle } from '../services/services';

const halfKnobSize = 10;
const knobSize = 2 * halfKnobSize;
const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  sliderWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    marginRight: halfKnobSize,
  },
  track: {
    position: 'relative',
  },
  fill: {
    position: 'absolute',
  },
  knob: {
    position: 'absolute',
    borderRadius: 50,
    width: knobSize,
    height: knobSize,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  label: {
    /**
     * triple digit support
     */
    width: 25,
    marginLeft: 5,
    textAlign: 'right',
  },
});

const linearGradientEnd = { x: 0.1, y: 0.2 };

const onStartShouldSetPanResponder = () => true;
const onStartShouldSetPanResponderCapture = () => true;
const onMoveShouldSetPanResponder = () => true;
const onMoveShouldSetPanResponderCapture = () => true;
const onPanResponderTerminationRequest = () => false;

export interface SliderProps extends Pick<ViewStyle, 'height'> {
  value: number;
  max: number;
  onChange: React.Dispatch<number>;
  knobColor: ViewStyle['backgroundColor'];
  backgroundColor: ViewStyle['backgroundColor'] | LinearGradientProps['colors'];
  color?: ViewStyle['backgroundColor'];
}

const Slider: React.FC<SliderProps> = ({ height = 4, ...props }) => {
  const { theme } = useTheme();

  const isChangingRef = React.useRef(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const trackRef = React.useRef<View | null>(null);
  const layoutRef = React.useRef<LayoutRectangle | null>(null);
  const handleLayout = () => {
    trackRef.current?.measureInWindow((x, y, width, height) => {
      const layout: LayoutRectangle = { x, y, width, height };
      layoutRef.current = layout;
      const position = (props.value * layout.width) / props.max;
      setPosition(position);
    });
  };
  const [position, setPosition] = React.useState(0);
  const scale = React.useCallback(
    (currentPosition: number) => {
      /**
       * scaled / max = position / width
       */
      const scaled = layoutRef.current
        ? Math.round((currentPosition * props.max) / layoutRef.current.width)
        : 0;
      return scaled;
    },
    [props.max],
  );
  const limitToLayout = React.useCallback((currentPosition: number) => {
    return layoutRef.current?.x && layoutRef.current?.width
      ? Math.min(
          layoutRef.current?.x + layoutRef.current.width,
          Math.max(layoutRef.current?.x, currentPosition),
        )
      : currentPosition;
  }, []);
  React.useEffect(() => {
    if (!isChangingRef.current && layoutRef.current) {
      setPosition((props.value * layoutRef.current.width) / props.max);
    }
  }, [props.max, props.value]);
  const handleValueChange = React.useMemo(
    () =>
      throttle({
        timeoutRef,
        delay: 500,
        callback: props.onChange,
      }),
    [props.onChange],
  );

  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder,
      onStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponder,
      onMoveShouldSetPanResponderCapture,

      onPanResponderGrant: () => {
        isChangingRef.current = true;
      },
      onPanResponderMove: (e, gestureState) => {
        const newCenterPosition = layoutRef.current
          ? limitToLayout(gestureState.x0 + gestureState.dx) -
            layoutRef.current.x
          : 0;
        const scaled = scale(newCenterPosition);
        setPosition(newCenterPosition);
        handleValueChange(scaled);
      },
      onPanResponderRelease: (e, gestureState) => {
        const scaled = layoutRef.current
          ? scale(
              limitToLayout(gestureState.x0 + gestureState.dx) -
                layoutRef.current.x,
            )
          : 0;

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        isChangingRef.current = false;
        props.onChange(scaled);
      },
      onPanResponderTerminationRequest,
    }),
  ).current;

  return (
    <View style={styles.wrapper}>
      <View ref={trackRef} style={styles.sliderWrapper} onLayout={handleLayout}>
        {Array.isArray(props.backgroundColor) ? (
          <LinearGradient
            colors={props.backgroundColor}
            end={linearGradientEnd}
          >
            <View style={[styles.track, { height }]} />
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.track,
              { height, backgroundColor: props.backgroundColor },
            ]}
          />
        )}
        {props.color && (
          <View
            style={[
              styles.fill,
              { height, backgroundColor: props.color, width: position },
            ]}
          />
        )}
        <View
          {...panResponder.panHandlers}
          style={[
            styles.knob,
            {
              borderColor: theme.colors.bg.secondary,
              backgroundColor: props.knobColor,
              left: position - halfKnobSize,
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
          accessibilityValue={{ min: 0, max: props.max, now: props.value }}
        />
      </View>
      <Text style={styles.label}>{scale(position)}</Text>
    </View>
  );
};

export default Slider;
