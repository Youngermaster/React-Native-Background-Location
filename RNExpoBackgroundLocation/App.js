import React, { useState, useEffect } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

const LOCATION_TASK_NAME = 'background-location-task';
let latestLocation = null; // Global variable to store the latest location

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // Request permission for iOS
    Notifications.requestPermissionsAsync();

    // startLocationTracking();
    // const locationUpdateInterval = setInterval(() => {
    //   if (latestLocation) {
    //     setLocation(latestLocation);
    //     // Trigger a local notification for testing
    //     // Notifications.scheduleNotificationAsync({
    //     //   content: {
    //     //     title: "Location Update",
    //     //     body: JSON.stringify(latestLocation),
    //     //   },
    //     //   trigger: null, // immediate notification
    //     // });
    //   }
    // }, 1000); // Update the state every second

    // return () => clearInterval(locationUpdateInterval);
  }, []);

  const startLocationTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let backgroundStatus = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus.status !== 'granted') {
      setErrorMsg('Permission for background location access was denied');
      return;
    }

    setInterval(async () => {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        // accuracy: Location.Accuracy.Balanced,
        timeInterval: 1000,
      });
    }, 1000); // Update the state every second
  };

  const requestPermissions = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        startLocationTracking();
        // await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        //   accuracy: Location.Accuracy.BestForNavigation,
        //   timeInterval: 1000,
        // });
      }
    }
  };

  let text = 'Waiting for location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>Hello, Hi</Text>
      <Text style={styles.paragraph}>{text}</Text>
      <Button onPress={requestPermissions} title="Enable background location" />
    </View>
  );
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    latestLocation = locations[0]; // Update the global variable with the new location
    // Trigger a local notification for testing
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Location Update",
        body: JSON.stringify(latestLocation),
      },
      trigger: null, // immediate notification
    });
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
