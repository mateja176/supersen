import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
} from 'react-native';
import useTheme from '../hooks/theme';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  text: {
    marginLeft: 8,
    textTransform: 'uppercase',
  },
});

export interface IconButtonProps
  extends Omit<TouchableHighlightProps, 'children'> {
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
  style,
  ...props
}) => {
  const theme = useTheme();

  const textColor = color ?? theme.colors.text.white;

  return (
    <TouchableHighlight
      style={[
        {
          height: '100%',
          backgroundColor: backgroundColor ?? theme.colors.bg.primary,
          opacity: props.disabled ? 0.5 : 1,
        },
        style,
      ]}
      {...props}
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
    </TouchableHighlight>
  );
};

export default IconButton;
