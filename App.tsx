// App.tsx
import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AppNavigator from "./navigation/AppNavigator";
// import { useEffect } from "react";
// import * as Notifications from "expo-notifications";

// useEffect(() => {
//   Notifications.requestPermissionsAsync();
// }, []);
// This effect requests permission to send notifications when the app is loaded. It uses the Notifications API from Expo to handle permissions for notifications.

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar style="auto" />
        <AppNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
