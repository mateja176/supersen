import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import useTheme from '../hooks/theme';

const styles = StyleSheet.create({
  checkbox: {
    minWidth: 15,
    minHeight: 15,
    width: '10%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  checkmark: {
    width: '80%',
    height: '40%',
    position: 'absolute',
    borderStyle: 'solid',
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    transform: [{ rotate: '-45deg' }],
  },
});

export interface CheckboxProps
  extends Omit<
    PressableProps,
    | 'style'
    | 'onPress'
    | 'accessible'
    | 'accessibilityLabel'
    | 'accessibilityRole'
    | 'accessibilityActions'
  > {
  checked: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onChange?: React.Dispatch<boolean>;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  disabled = false,
  style,
  onChange,
  ...props
}) => {
  const { theme } = useTheme();

  const handleChange = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };
  return (
    <Pressable
      {...props}
      style={[
        styles.checkbox,
        {
          backgroundColor: theme.colors.bg.white,
          borderColor: theme.colors.bg.secondary,
        },
        style,
      ]}
      disabled={!onChange}
      onPress={handleChange}
      accessible
      accessibilityLabel="Checkbox"
      accessibilityRole="checkbox"
      accessibilityActions={[
        { name: 'activate', label: 'Toggles checkbox state' },
      ]}
      accessibilityState={{ disabled, checked }}
    >
      {checked && (
        <View
          style={[styles.checkmark, { borderColor: theme.colors.bg.success }]}
        />
      )}
    </Pressable>
  );
};

export default Checkbox;
