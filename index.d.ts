declare module 'react-native-web' {
  export * from 'react-native';
  export type CheckBoxProps = import('react-native').ViewProps & {
    color?: ColorValue;
    disabled?: boolean;
    onValueChange?: (e: boolean) => void;
    value?: boolean;
  };
  export const CheckBox: import('react').FC<CheckBoxProps>;
}
declare module '@env' {
  export const INITIAL_HSV: string | undefined;
  export const API: string | undefined;
  export const PIXELS_Y: string | undefined;
  export const PIXELS_X: string | undefined;
  export const BOARDS: string | undefined;
  export const SHOULD_ALTERNATE: string | undefined;
}
