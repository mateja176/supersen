import React from 'react';
import { StyleSheet, useWindowDimensions, View, ViewProps } from 'react-native';

const styles = StyleSheet.create({
  layout: {},
});

export interface LayoutProps extends ViewProps {}

const Layout: React.FC<LayoutProps> = ({ style, ...props }) => {
  const dimensions = useWindowDimensions();
  return (
    <View
      {...props}
      style={[styles.layout, { height: dimensions.height }, style]}
    />
  );
};

export default Layout;
