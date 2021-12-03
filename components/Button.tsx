import React from 'react';
import { Button as RNButton, ButtonProps as ButtonProps1 } from 'react-native';
import useTheme from '../hooks/theme';

export interface ButtonProps extends ButtonProps1 {}

const Button: React.FC<ButtonProps> = ({ color, ...props }) => {
  const theme = useTheme();
  return <RNButton {...props} color={color ?? theme.colors.bg.primary} />;
};

export default Button;
