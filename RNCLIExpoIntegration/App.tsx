import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as ExpoLocation from 'expo-location';

const TASK_NAME = 'location-tracking';

function App(): React.JSX.Element {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationStarted, setLocationStarted] = useState(false);

  useEffect(() => {
    (async () => {
      let {status} = await ExpoLocation.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await ExpoLocation.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    const config = async () => {
      let resf = await ExpoLocation.requestForegroundPermissionsAsync();
      let resb = await ExpoLocation.requestBackgroundPermissionsAsync();

      if (resf.status !== 'granted' && resb.status !== 'granted') {
        console.log('Permission to access location was denied');
      } else {
        console.log('Permission to access location granted');
      }
    };

    config();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const startLocationTracking = async () => {
    await ExpoLocation.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: ExpoLocation.Accuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1,
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Using your location',
        notificationBody:
          'To turn off, go back to the app and switch something off.',
      },
    });

    const hasStarted = await ExpoLocation.hasStartedLocationUpdatesAsync(
      TASK_NAME,
    );
    setLocationStarted(hasStarted);
    console.log('Tracking started', hasStarted);
  };

  const stopLocation = () => {
    setLocationStarted(false);
    console.log('Tracking stopped');

    TaskManager.isTaskRegisteredAsync(TASK_NAME).then(tracking => {
      if (tracking) {
        ExpoLocation.stopLocationUpdatesAsync(TASK_NAME);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text>{text}</Text>
      <TouchableOpacity
        style={styles.buttonStart}
        onPress={startLocationTracking}>
        <Text style={styles.buttonText}>Start</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonStop} onPress={stopLocation}>
        <Text style={styles.buttonText}>Stop</Text>
      </TouchableOpacity>
    </View>
  );
}

TaskManager.defineTask(TASK_NAME, async ({data, error}) => {
  if (error) {
    console.log('LOCATION_TRACKING task ERROR:', error);
    return;
  }
  if (data) {
    const {locations} = data;
    const {latitude, longitude, speed, heading, accuracy} = locations[0].coords;

    console.log(
      `${new Date().toLocaleString()}: ${latitude},${longitude} - Speed ${speed} - Precision ${accuracy} - Heading ${heading}`,
    );
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  buttonStart: {
    backgroundColor: 'rgb(155, 189, 39)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonStop: {
    backgroundColor: 'rgb(155, 39, 39)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default App;
