import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  LayoutChangeEvent,
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

export interface SliderProps
  extends Pick<ViewStyle, 'height'>,
    Pick<React.CSSProperties, 'color'> {
  value: number;
  max: number;
  onChange: React.Dispatch<number>;
  knobColor: React.CSSProperties['color'];
  backgroundColor?:
    | React.CSSProperties['color']
    | Array<NonNullable<React.CSSProperties['color']>>;
}

const Slider: React.FC<SliderProps> = ({
  height = 4,
  backgroundColor = '#eee',
  max = 100,
  ...props
}) => {
  const theme = useTheme();

  const { knobColor = 'lightsteelblue', color = 'lightsteelblue' } = props;

  const isChangingRef = React.useRef(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const layoutRef = React.useRef<LayoutRectangle | null>(null);
  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    layoutRef.current = nativeEvent.layout;
    const position = (props.value * nativeEvent.layout.width) / max;
    setPosition(position);
  };
  const [position, setPosition] = React.useState(0);
  const scale = React.useCallback(
    (currentPosition: number) => {
      /**
       * scaled / max = position / width
       */
      const scaled = Math.round(
        (currentPosition * max) / (layoutRef.current?.width ?? 0),
      );
      return scaled;
    },
    [max],
  );
  const limitToLayout = React.useCallback((currentPosition: number) => {
    return layoutRef.current?.left && layoutRef.current?.width
      ? Math.min(
          layoutRef.current?.left + layoutRef.current?.width,
          Math.max(layoutRef.current?.left, currentPosition),
        )
      : currentPosition;
  }, []);
  React.useEffect(() => {
    if (!isChangingRef.current) {
      setPosition((props.value * (layoutRef.current?.width ?? 0)) / max);
    }
  }, [max, props.value]);
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
        const newCenterPosition =
          limitToLayout(gestureState.x0 + gestureState.dx) -
          (layoutRef.current?.left ?? 0);
        const scaled = scale(newCenterPosition);
        setPosition(newCenterPosition);
        handleValueChange(scaled);
      },
      onPanResponderRelease: (e, gestureState) => {
        const scaled = scale(
          limitToLayout(gestureState.x0 + gestureState.dx) -
            (layoutRef.current?.left ?? 0),
        );

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
      <View style={styles.sliderWrapper} onLayout={handleLayout}>
        {Array.isArray(backgroundColor) ? (
          <LinearGradient colors={backgroundColor} end={linearGradientEnd}>
            <View style={[styles.track, { height }]} />
          </LinearGradient>
        ) : (
          <View style={[styles.track, { height, backgroundColor }]} />
        )}
        {props.color && (
          <View
            style={[
              styles.fill,
              { height, backgroundColor: color, width: position },
            ]}
          />
        )}
        <View
          {...panResponder.panHandlers}
          style={[
            styles.knob,
            {
              borderColor: theme.colors.bg.secondary,
              backgroundColor: knobColor ?? color,
              left: position - halfKnobSize,
            },
          ]}
        />
      </View>
      <Text style={styles.label}>{scale(position)}</Text>
    </View>
  );
};

export default Slider;
