import React from 'react';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';

const useLayout = (): {
  layoutRef: React.MutableRefObject<LayoutRectangle | null>;
  onLayout: (layoutChangeEvent: LayoutChangeEvent) => void;
} => {
  const layoutRef = React.useRef<LayoutRectangle | null>(null);
  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    layoutRef.current = nativeEvent.layout;
  };

  return { layoutRef, onLayout };
};

export default useLayout;
