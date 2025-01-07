import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

import { FocusAwareStatusBar, SafeAreaView, ScrollView } from '@/components/ui';
import { Env } from '@/lib/env';
import {
  connectToBroker,
  disconnectFromBroker,
  setMessageHandler,
  subscribeToTopic,
} from '@/lib/mqtt-client';
import { type LocationPayload } from '@/models/location-payload';

// Each bus data we want to keep track of
interface BusData extends LocationPayload {
  // We'll track some ID for each bus.
  // For example, we'll use vehicle_number_id or driver_name as an identifier.
}

// We'll store them in a Record keyed by some unique ID
type BusDataMap = Record<string, BusData>;

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [buses, setBuses] = useState<BusDataMap>({});
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);

  /**
   * Connect to MQTT and subscribe on mount
   */
  useEffect(() => {
    (async () => {
      await connectToBroker();
      // Subscribe to your topic. Adjust accordingly:
      //   e.g. "bus_location/#" or "location_drivers/#"
      //   or "location_drivers/66c6cba2a87c9c06dda7d7ba" for a single driver.
      await subscribeToTopic('location_drivers/#');

      // Whenever a message is received, handle it
      setMessageHandler(handleNewMessage);
    })();

    // Cleanup on unmount
    return () => {
      disconnectFromBroker();
    };
  }, []);

  /**
   * Handle each new MQTT message
   */
  const handleNewMessage = useCallback((payload: LocationPayload) => {
    // Example: Use "vehicle_number_id" or "driver_name" or "driver_id" as the unique ID
    const busId = payload.vehicle_number_id || payload.driver_name || 'unknown';
    setBuses((prev) => ({
      ...prev,
      [busId]: payload,
    }));
  }, []);

  /**
   * Convert the buses object into an array for rendering
   */
  const busArray = Object.keys(buses).map((key) => buses[key]);

  /**
   * When you tap on a bus marker, set it as selected
   */
  const onBusPress = useCallback((bus: BusData) => {
    setSelectedBus(bus);
  }, []);

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView contentContainerStyle={styles.screenContainer}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* 
            Simple info at top. 
            Shows info about the last tapped bus (or nothing if none tapped).
          */}
          <View style={{ alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontWeight: 'bold' }}>Map</Text>
            <Text>Broker URL: {Env.BROKER_URL}</Text>
            {selectedBus && (
              <Text style={{ marginTop: 8 }}>
                Selected Bus: {selectedBus?.vehicle_number_id} -{' '}
                {selectedBus?.driver_name} on route {selectedBus?.route_name}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: 6.3, // A default center
                longitude: -75.58,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
            >
              {/* Render a marker for each bus in the busArray */}
              {busArray.map((bus, index) => {
                const lat = bus.driverLocation?.latitude;
                const lng = bus.driverLocation?.longitude;
                if (!lat || !lng) return null;

                return (
                  <Marker
                    key={`${bus.vehicle_number_id}-${index}`}
                    coordinate={{ latitude: lat, longitude: lng }}
                    onPress={() => onBusPress(bus)}
                  >
                    <Callout>
                      <Text>{bus.vehicle_number_id}</Text>
                      <Text>{bus.driver_name}</Text>
                      <Text>Route: {bus.route_name}</Text>
                    </Callout>
                  </Marker>
                );
              })}
            </MapView>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
  },
});
