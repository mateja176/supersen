import React from 'react';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
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
    | 'onPress'
    | 'accessible'
    | 'accessibilityLabel'
    | 'accessibilityRole'
    | 'accessibilityActions'
  > {
  checked: boolean;
  onChange?: React.Dispatch<boolean>;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  style,
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
        style as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        styles.checkbox,
        { backgroundColor: theme.colors.bg.white },
      ]}
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
