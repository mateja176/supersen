import React from 'react';
import { GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { NumberPair, UsePan2DProps, UsePan2DStore } from './models';
import usePan from './usePan';
import { descaleCoord2D, limitCoord, scaleCoord2D } from './utils';

const initialValue: NumberPair = [0, 0];
const usePan2D = ({
  value,
  max,
  layout,
  onChange,
}: UsePan2DProps): UsePan2DStore => {
  const scalePosition = React.useCallback(
    (position: NumberPair) => {
      return layout
        ? scaleCoord2D(position, max, [layout.width, layout.height])
        : initialValue;
    },
    [layout, max],
  );

  const position = React.useMemo(() => {
    return layout
      ? descaleCoord2D(value, max, [layout.width, layout.height])
      : initialValue;
  }, [layout, max, value]);

  const onGestureStateChange = React.useCallback(
    (
      e: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ): NumberPair => {
      return layout
        ? [
            limitCoord(gestureState.moveX, layout.x, layout.width) - layout.x,
            limitCoord(gestureState.moveY, layout.y, layout.height) - layout.y,
          ]
        : initialValue;
    },
    [layout],
  );

  const panStore = usePan({
    onChange,
    onGestureStateChange,
    scalePosition,
  });

  const handlePress = (e: GestureResponderEvent) => {
    if (layout) {
      onChange(
        scalePosition([
          e.nativeEvent.pageX - layout.x,
          e.nativeEvent.pageY - layout.y,
        ]),
      );
    }
  };

  return {
    ...panStore,
    position,
    scalePosition,
    onPress: handlePress,
  };
};

export default usePan2D;
