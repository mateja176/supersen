import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-native';
import useTheme from '../hooks/theme';

const styles = StyleSheet.create({
  text: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});

export interface LinkProps extends RouterLinkProps {
  color?: string;
  children: string | React.ReactElement;
}

const Link: React.FC<LinkProps> = ({
  disabled,
  color,
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();

  const textColor = color ?? theme.colors.text.dark;

  return (
    <RouterLink {...props} style={[disabled ? { opacity: 0.6 } : {}, style]}>
      {typeof children === 'string' ? (
        <Text
          style={[
            styles.text,
            { textDecorationColor: textColor, color: textColor },
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </RouterLink>
  );
};

export default Link;
