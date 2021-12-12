import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import useTheme from '../hooks/theme';

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
  },
  children: {
    flexGrow: 1,
    borderStyle: 'solid',
  },
});

export interface ButtonGroupProps extends ViewProps {}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  return (
    <View {...props} style={[styles.buttonGroup, style]}>
      {React.Children.map(children, (child, i) => (
        <View
          style={[
            styles.children,
            { borderColor: theme.colors.bg.white },
            i !== React.Children.count(children) - 1
              ? { borderRightWidth: 1 }
              : {},
          ]}
        >
          {child}
        </View>
      ))}
    </View>
  );
};

export default ButtonGroup;
