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
import useTheme from '../hooks/theme';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
});

export type IconName = React.ComponentProps<typeof Ionicons>['name'];
export type Children = string | React.ReactElement;
export type WithContent =
  | {
      iconName: IconName;
      children: Children;
    }
  | {
      iconName?: IconName;
      children: Children;
    }
  | {
      iconName: IconName;
      children?: Children;
      accessibilityLabel: string;
    };
export type ButtonProps = Omit<
  PressableProps,
  'style' | 'children' | 'accessible'
> &
  WithContent & {
    style?: StyleProp<ViewStyle>;
    backgroundColor?: string;
    disabledColor?: string;
    color?: string;
    loading?: boolean;
  };

const Button: React.FC<ButtonProps> = ({
  children,
  accessibilityLabel,
  iconName,
  style,
  color,
  backgroundColor,
  disabledColor,
  loading,
  ...props
}) => {
  const { theme } = useTheme();

  const disabled = props.disabled || loading;

  const textColor = color ?? theme.colors.text.white;

  const backgroundColorOrDefault = backgroundColor ?? theme.colors.bg.primary;

  return (
    <Pressable
      {...props}
      style={[
        {
          backgroundColor: disabled
            ? disabledColor ?? theme.colors.bg.secondary
            : backgroundColorOrDefault,
        },
        style,
      ]}
      disabled={disabled}
      accessible
      accessibilityLabel={
        typeof children === 'string' ? children : accessibilityLabel
      }
    >
      <View style={styles.wrapper}>
        {iconName && <Ionicons name={iconName} color={textColor} />}
        {children &&
          (typeof children === 'string' ? (
            <Text
              style={[
                {
                  color: textColor,
                  ...(iconName ? { marginLeft: 8 } : {}),
                },
              ]}
            >
              {children}
            </Text>
          ) : (
            children
          ))}
      </View>
    </Pressable>
  );
};

export default Button;
