import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

const styles = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
  },
  children: {
    flexGrow: 1,
  },
});

export interface ButtonGroupProps extends ViewProps {}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <View {...props} style={[style, styles.buttonGroup]}>
      {React.Children.map(children, (child) => (
        <View style={styles.children}>{child}</View>
      ))}
    </View>
  );
};

export default ButtonGroup;
