import React from 'react';
import {connect} from 'react-redux';
import {StyleSheet, View, Button, Text} from 'react-native';
import * as Location from 'expo-location';
import {setLocation} from './actions/locationActions';

const LOCATION_TASK_NAME = 'background-location-task';

const AppContent = ({dispatch, latitude, longitude}) => {
  const handleEnableBackgroundLocation = async () => {
    console.log('Enabling background location');
    const {status: backgroundStatus} =
      await Location.requestBackgroundPermissionsAsync();

    const {status: foregroundStatus} =
      await Location.requestForegroundPermissionsAsync();
    console.log('Status', backgroundStatus, foregroundStatus);
    if (backgroundStatus === 'granted' && foregroundStatus === 'granted') {
      console.log('Background location permission granted');
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Lat: {latitude}</Text>
      <Text>Lng: {longitude}</Text>
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

const mapStateToProps = (state: any) => ({
  latitude: state.location.latitude,
  longitude: state.location.longitude,
});

export default connect(mapStateToProps)(AppContent);
