import React from 'react';
import {StyleSheet, View, Button, Text} from 'react-native';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

const App = () => {
  const [status, setStatus] = React.useState('Waiting for permissions...');

  const handleEnableBackgroundLocation = async () => {
    console.log('Asking for permissions...');
    const {status: foregroundStatus} =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
      setStatus('Foreground permission denied');
      return;
    }

    const {status: backgroundStatus} =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== 'granted') {
      setStatus('Background permission denied');
      return;
    }

    console.log('Starting location updates...');
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 0,
      foregroundService: {
        notificationTitle: 'Location Tracking',
        notificationBody: 'Enabled',
      },
    });

    setStatus('Location tracking enabled');
  };

  return (
    <View style={styles.container}>
      <Text>{status}</Text>
      <Button
        title="Enable Background Location"
        onPress={handleEnableBackgroundLocation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default App;
