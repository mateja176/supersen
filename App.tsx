import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Pixels from './components/Pixels';
import Provider from './Provider';

export default function App(): React.ReactElement {
  return (
    <Provider>
      <StatusBar style="auto" />

      <Pixels />
    </Provider>
  );
}
