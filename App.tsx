// App.tsx
import React from "react";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "./navigation/AppNavigator";
// import { useEffect } from "react";
// import * as Notifications from "expo-notifications";

// useEffect(() => {
//   Notifications.requestPermissionsAsync();
// }, []);
// This effect requests permission to send notifications when the app is loaded. It uses the Notifications API from Expo to handle permissions for notifications.

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
// This is the main entry point of the application. It imports the AppNavigator component and renders it within a React fragment. The StatusBar component is also included to manage the status bar appearance.