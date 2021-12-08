import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
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
    'style' | 'children' | 'accessible' | 'accessibilityLabel'
  > {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  children?: string;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  color?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  iconName,
  style,
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
        style,
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
