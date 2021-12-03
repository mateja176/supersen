import React from 'react';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';

const useLayout = (): {
  layout: LayoutRectangle | null;
  onLayout: (layoutChangeEvent: LayoutChangeEvent) => void;
} => {
  const [layout, setLayout] = React.useState<LayoutRectangle | null>(null);
  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    setLayout(nativeEvent.layout);
  };

  return { layout, onLayout };
};

export default useLayout;
