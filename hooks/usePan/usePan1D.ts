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

  const descalePosition = React.useCallback(
    (position: number) => {
      return layoutRef.current
        ? descaleCoord(position, max, layoutRef.current.width)
        : initialValue;
    },
    [max],
  );

  const descaledPosition = React.useMemo(() => {
    return descalePosition(value);
  }, [descalePosition, value]);

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

  const handleLayout = (
    setPosition: React.Dispatch<React.SetStateAction<number>>,
  ) => {
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
    descaledPosition,
    onChange,
    onGestureStateChange,
    scalePosition,
    onLayout: handleLayout,
  });

  const scaledPosition = React.useMemo(
    () => scalePosition(panStore.position),
    [panStore.position, scalePosition],
  );

  const handlePress = (e: GestureResponderEvent) => {
    if (layoutRef.current) {
      onChange(scalePosition(e.nativeEvent.pageX - layoutRef.current.x));
    }
  };

  return {
    ...panStore,
    surfaceRef,
    layoutRef,
    scaledPosition,
    scalePosition,
    descalePosition,
    onPress: handlePress,
  };
};

export default usePan1D;
