import React from 'react';
import { PanResponder } from 'react-native';
import { throttle } from '../../services/services';
import { GenericPosition, UsePanProps, UsePanStore } from './models';

const onStartShouldSetPanResponder = () => true;
const onStartShouldSetPanResponderCapture = () => true;
const onMoveShouldSetPanResponder = () => true;
const onMoveShouldSetPanResponderCapture = () => true;
const onPanResponderTerminationRequest = () => false;

const usePan = <Position extends GenericPosition>({
  descaledPosition,
  onChange,
  onGestureStateChange,
  scalePosition,
  onLayout,
}: UsePanProps<Position>): UsePanStore<Position> => {
  const isChangingRef = React.useRef(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [position, setPosition] = React.useState<Position>(descaledPosition);
  React.useEffect(() => {
    if (!isChangingRef.current) {
      setPosition(descaledPosition);
    }
  }, [descaledPosition]);
  const handleChange = React.useMemo(
    () =>
      throttle({
        timeoutRef,
        delay: 500,
        callback: onChange,
      }),
    [onChange],
  );

  const handlePanResponderGrant = React.useCallback(() => {
    isChangingRef.current = true;
  }, []);
  const handlePanResponderMove = React.useCallback(
    (e, gestureState) => {
      const newPosition = onGestureStateChange(e, gestureState);
      setPosition(newPosition);
      handleChange(scalePosition(newPosition));
    },
    [handleChange, onGestureStateChange, scalePosition],
  );
  const handlePanResponderRelease = React.useCallback(
    (e, gestureState) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      isChangingRef.current = false;

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

  const handleLayout = () => {
    onLayout?.(setPosition);
  };

  return {
    position,
    panResponder,
    onLayout: handleLayout,
  };
};

export default usePan;
