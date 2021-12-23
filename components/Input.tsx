import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import useTheme from '../hooks/theme';

const styles = StyleSheet.create({
  label: {
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
});

export interface InputProps extends TextInputProps {
  label: string;
  errorMessage: string | false | undefined;
}

const Input: React.FC<InputProps> = ({
  label,
  errorMessage,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const color = errorMessage ? theme.colors.bg.danger : theme.colors.text.dark;
  return (
    <View>
      <Text style={[styles.label, { color }]}>{label}</Text>
      <TextInput
        {...props}
        style={[
          styles.input,
          {
            borderBottomColor: color,
          },
          style,
        ]}
        accessibilityLabel={label}
      />
      <Text
        style={{
          opacity: errorMessage ? 1 : 0,
          color: theme.colors.text.danger,
        }}
        accessibilityElementsHidden={!errorMessage}
      >
        {errorMessage || 'No error'}
      </Text>
    </View>
  );
};

export default Input;
