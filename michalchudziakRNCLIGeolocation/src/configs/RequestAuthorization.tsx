import React from 'react';
import {View, Button} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default function RequestAuthorizationExample() {
  const requestAuthorization = () => {
    Geolocation.requestAuthorization();
  };

  return (
    <View>
      <Button title="Request Authorization" onPress={requestAuthorization} />
    </View>
  );
}
