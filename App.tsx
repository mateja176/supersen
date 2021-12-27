import { Amplify } from 'aws-amplify';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Route, Routes } from 'react-router-native';
import config from './aws-exports';
import Dashboard from './components/Dashboard';
import Pixels from './components/Pixels';
import Layout from './Layout';
import Provider from './Provider';

Amplify.configure(config);

export default function App(): React.ReactElement {
  return (
    <Provider>
      <StatusBar style="light" />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/device/:ip" element={<Pixels />} />
        </Routes>
      </Layout>
    </Provider>
  );
}
