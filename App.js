import { StatusBar } from "expo-status-bar";
import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  View,
  AppState,
  ActivityIndicator,
  FlatList,
} from "react-native";
import styles from "./styles";

export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMovies = async () => {
    try {
      const response = await fetch("https://reactnative.dev/movies.json");
      const json = await response.json();
      setData(json.movies);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const ping = async () => {
    const response = await fetch("http://192.168.0.5:8000/");
  };

  useEffect(() => {
    getMovies();
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
    if (appState.current == "background") {
      console.log("Ch1mb9");
      setInterval(() => {
        ping();
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTextStyle}>React Native Background Tasks </Text>
      <Text style={styles.textStyle}>Current state is: {appStateVisible}</Text>
      <View style={{ flex: 4, padding: 24 }}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            keyExtractor={({ id }, index) => id}
            renderItem={({ item }) => (
              <Text>
                {item.title}, {item.releaseYear}
              </Text>
            )}
          />
        )}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
