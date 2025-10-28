import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlashMessage } from '../components/ui';
import { AppNavigator } from '../navigation';

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
      <FlashMessage />
    </>
  );
}
