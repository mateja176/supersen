import { Ionicons, MaterialIcons } from '@expo/vector-icons';
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
  iconName:
    | {
        ion: React.ComponentProps<typeof Ionicons>['name'];
      }
    | {
        material: React.ComponentProps<typeof MaterialIcons>['name'];
      };
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
            ? theme.colors.bg.secondary
            : backgroundColorOrDefault,
        },
        style,
      ]}
    >
      <View style={styles.wrapper}>
        {'ion' in iconName ? (
          <Ionicons name={iconName.ion} color={textColor} />
        ) : (
          <MaterialIcons name={iconName.material} />
        )}
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
