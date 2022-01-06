import React from 'react';
import { PanResponder } from 'react-native';
import { GenericPosition, UsePanProps, UsePanStore } from './models';

const onStartShouldSetPanResponder = () => true;
const onStartShouldSetPanResponderCapture = () => true;
const onMoveShouldSetPanResponder = () => true;
const onMoveShouldSetPanResponderCapture = () => true;
const onPanResponderTerminationRequest = () => false;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const handlePanResponderGrant = () => {};

const usePan = <Position extends GenericPosition>({
  onChange,
  onGestureStateChange,
  scalePosition,
  onLayout,
}: UsePanProps<Position>): UsePanStore => {
  const handlePanResponderMove = React.useCallback(
    (e, gestureState) => {
      const newPosition = onGestureStateChange(e, gestureState);
      onChange(scalePosition(newPosition));
    },
    [onChange, onGestureStateChange, scalePosition],
  );
  const handlePanResponderRelease = React.useCallback(
    (e, gestureState) => {
      const newPosition = onGestureStateChange(e, gestureState);
      onChange(scalePosition(newPosition));
    },
    [onChange, onGestureStateChange, scalePosition],
  );
  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder,
      onStartShouldSetPanResponderCapture,
      onMoveShouldSetPanResponder,
      onMoveShouldSetPanResponderCapture,

      onPanResponderGrant: handlePanResponderGrant,
      onPanResponderMove: handlePanResponderMove,
      onPanResponderRelease: handlePanResponderRelease,
      onPanResponderTerminationRequest,
    }),
  ).current;

  const handleLayout = React.useCallback(() => {
    onLayout?.(onChange);
  }, [onChange, onLayout]);

  return {
    panResponder,
    onLayout: handleLayout,
  };
};

export default usePan;
