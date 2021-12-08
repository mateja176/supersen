import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import tinycolor from 'tinycolor2';
import useTheme from '../hooks/theme';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  text: {
    marginLeft: 8,
  },
});

export interface IconButtonProps
  extends Omit<
    PressableProps,
    'children' | 'accessible' | 'accessibilityLabel'
  > {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  children?: string;
  color?: string;
  backgroundColor?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  iconName,
  color,
  backgroundColor,
  ...props
}) => {
  const { theme } = useTheme();

  const textColor = color ?? theme.colors.text.white;

  const backgroundColorOrDefault = backgroundColor ?? theme.colors.bg.primary;

  return (
    <Pressable
      {...props}
      accessible
      accessibilityLabel={children}
      style={[
        {
          backgroundColor: props.disabled
            ? tinycolor(backgroundColorOrDefault).darken(10).toString()
            : backgroundColorOrDefault,
        },
      ]}
    >
      <View style={styles.wrapper}>
        <Ionicons name={iconName} color={textColor} />
        {children && (
          <Text
            style={[
              styles.text,
              {
                color: textColor,
              },
            ]}
          >
            {children}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default IconButton;
