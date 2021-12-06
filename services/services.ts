import React from 'react';

export const throttle = <Params extends unknown[]>({
  timeoutRef,
  delay,
  callback,
}: {
  timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  delay: number;
  callback: (...params: Params) => void;
}): ((...params: Params) => void) => {
  return (...params) => {
    if (timeoutRef.current === null) {
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        callback(...params);
      }, delay);
    }
  };
};
