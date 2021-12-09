import React from 'react';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';

const useLayout = (): {
  layoutRef: React.MutableRefObject<LayoutRectangle | null>;
  onLayout: React.Dispatch<LayoutChangeEvent>;
} => {
  const layoutRef = React.useRef<LayoutRectangle | null>(null);
  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    layoutRef.current = nativeEvent.layout;
  };

  return { layoutRef, onLayout };
};

export default useLayout;
