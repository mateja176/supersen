import React from 'react';
import {
  GestureResponderEvent,
  LayoutRectangle,
  PanResponderGestureState,
  View,
} from 'react-native';
import { UsePan1DProps, UsePan1DStore } from './models';
import usePan from './usePan';
import { descaleCoord, limitCoord, scaleCoord } from './utils';

const initialValue = 0;
const usePan1D = ({ value, max, onChange }: UsePan1DProps): UsePan1DStore => {
  const surfaceRef = React.useRef<View | null>(null);
  const layoutRef = React.useRef<LayoutRectangle | null>(null);

  const scalePosition = React.useCallback(
    (position: number) => {
      return layoutRef.current
        ? scaleCoord(position, max, layoutRef.current.width)
        : initialValue;
    },
    [max],
  );

  const position = React.useMemo(() => {
    return layoutRef.current
      ? descaleCoord(value, max, layoutRef.current.width)
      : initialValue;
  }, [max, value]);

  const onGestureStateChange = React.useCallback(
    (e: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      return layoutRef.current
        ? limitCoord(
            gestureState.moveX,
            layoutRef.current.x,
            layoutRef.current.width,
          ) - layoutRef.current.x
        : initialValue;
    },
    [],
  );

  const handleLayout = (setPosition: React.Dispatch<number>) => {
    surfaceRef.current?.measureInWindow((x, y, width, height) => {
      const layout: LayoutRectangle = {
        x,
        y,
        width,
        height,
      };

      layoutRef.current = layout;

      setPosition(descaleCoord(value, max, layout.width));
    });
  };

  const panStore = usePan({
    onChange,
    onGestureStateChange,
    scalePosition,
    onLayout: handleLayout,
  });

  const handlePress = React.useCallback(
    (e: GestureResponderEvent) => {
      if (layoutRef.current) {
        onChange(scalePosition(e.nativeEvent.pageX - layoutRef.current.x));
      }
    },
    [onChange, scalePosition],
  );

  return {
    ...panStore,
    position,
    surfaceRef,
    layoutRef,
    scalePosition,
    onPress: handlePress,
  };
};

export default usePan1D;
