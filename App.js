import { StatusBar } from "expo-status-bar";
import React, { useRef, useState, useEffect } from "react";
import { Text, View, AppState } from "react-native";
import styles from "./styles";

export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.remove("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState == "active"
    ) {
      console.log("App has come to the foreground.");
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState: ", appState.current);
  };

  return (
    <View style={styles.container}>
      <Text>Juan Manuel Young Hoyos</Text>
      <Text style={styles.textStyle}>Current state is: {appStateVisible}</Text>
      <StatusBar style="auto" />
    </View>
  );
}
