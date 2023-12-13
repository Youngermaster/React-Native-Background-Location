import { Text, Button } from "@rneui/themed";
import { View } from "react-native";

import * as TaskManager from 'expo-task-manager';
import * as ExpoLocation from 'expo-location';
import { useEffect, useState } from "react";

const TASK_NAME = 'location-tracking';

var l1;
var l2;

export default function Location() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationStarted, setLocationStarted] = useState(false);

  useEffect(() => {
    (async () => {

      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();

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

      if (resf.status != 'granted' && resb.status !== 'granted') {
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


  /**
   * Comenzar a trackear posicion
   */
  const startLocationTracking = async () => {
    await ExpoLocation.startLocationUpdatesAsync(TASK_NAME, {
      accuracy: ExpoLocation.Accuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1,
      // foregroundService is how you get the task to be updated as often as would be if the app was open
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: 'Using your location',
        notificationBody: 'To turn off, go back to the app and switch something off.',
      },

    });

    // Logramos que comince a trackear?
    const hasStarted = await ExpoLocation.hasStartedLocationUpdatesAsync(TASK_NAME);
    setLocationStarted(hasStarted);
    console.log('Tracking started', hasStarted);
  };

  /**
   * Detener tracking
   */
  const stopLocation = () => {
    setLocationStarted(false);
    console.log('Tracking detenido')

    // Detener la task
    TaskManager.isTaskRegisteredAsync(TASK_NAME)
      .then(tracking => {
        if (tracking) {
          ExpoLocation.stopLocationUpdatesAsync(TASK_NAME);
        }
      })
  }


  return (
    <View>
      <Text>
        json: {text}
      </Text>

      <Button
        containerStyle={{
          marginTop: 20,
          marginBottom: 20,
        }}
        buttonStyle={{
          borderRadius: 5,
          backgroundColor: 'rgb(155, 189, 39)',
          marginBottom: 20,
        }}
        onPress={() => startLocationTracking()}>
        Start
      </Button>
      <Button
        containerStyle={{
          marginBottom: 20,
        }}
        buttonStyle={{
          borderRadius: 5,
          backgroundColor: 'rgb(155, 39, 39)',
          marginBottom: 20,
        }}
        onPress={stopLocation}>
        Stop
      </Button>
    </View>
  )
}

TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  console.log('Task called')

  if (error) {
    console.log('LOCATION_TRACKING task ERROR:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;

    let speed = locations[0].coords.speed;
    let heading = locations[0].coords.heading;
    let accuracy = locations[0].coords.heading;

    l1 = lat;
    l2 = long;

    console.log(
      `${new Date(Date.now()).toLocaleString()}: ${lat},${long} - Speed ${speed} - Precision ${accuracy} - Heading ${heading} `
    );
  }
});