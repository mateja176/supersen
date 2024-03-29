import React from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  LayoutRectangle,
  PanResponderGestureState,
  PanResponderInstance,
  View,
} from 'react-native';

export interface WithLayout {
  layout: LayoutRectangle | null;
}
export interface WithLayoutRef {
  layoutRef: React.MutableRefObject<LayoutRectangle | null>;
}

export type NumberPair = [number, number];

export interface PanProps<Position> {
  value: Position;
  max: Position;
  onChange: React.Dispatch<Position>;
}
export type GenericPosition = number | [number, number];
export interface UsePanProps<Position extends GenericPosition>
  extends Pick<PanProps<Position>, 'onChange'> {
  onGestureStateChange: (
    e: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => Position;
  scalePosition: (position: Position) => Position;
  onLayout?: (setPosition: React.Dispatch<Position>) => void;
}
export type UsePan1DProps = PanProps<number>;
export type UsePan2DProps = PanProps<NumberPair> & WithLayout;

export interface UsePanStore {
  panResponder: PanResponderInstance;
  onLayout: (e: LayoutChangeEvent) => void;
}

export interface PanStore<Position> extends UsePanStore {
  scalePosition: (position: Position) => Position;
  onPress: React.Dispatch<GestureResponderEvent>;
}
export type UsePan1DStore = PanStore<number> & {
  position: number;
} & WithLayoutRef & {
    surfaceRef: React.MutableRefObject<View | null>;
  };
export type UsePan2DStore = PanStore<NumberPair> & { position: NumberPair };
