import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';

import { FocusAwareStatusBar, SafeAreaView, ScrollView } from '@/components/ui';
import { Env } from '@/lib/env';
import {
  connectToBroker,
  disconnectFromBroker,
  setMessageHandler,
  subscribeToTopic,
} from '@/lib/mqtt-client';
import { type LocationPayload } from '@/models/location-payload';
import { useRouteStore } from '@/stores/use-route-store';

// Each bus data we want to keep track of
interface BusData extends LocationPayload {
  // We'll track some ID for each bus
}

// We'll store them in a Record keyed by some unique ID
type BusDataMap = Record<string, BusData>;

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [buses, setBuses] = useState<BusDataMap>({});
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);

  // 1. Grab routes + store actions
  const { routes, selectedRouteId, toggleSelectedRoute } = useRouteStore();

  /**
   * Connect to MQTT and subscribe on mount
   */
  useEffect(() => {
    (async () => {
      await connectToBroker();
      await subscribeToTopic('location_drivers/#');

      // Whenever a message is received, we handle it
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
   * When we tap on a bus marker:
   *  - Set as selectedBus for info
   *  - Toggle the polyline for that bus's route
   */
  const onBusPress = useCallback(
    (bus: BusData) => {
      setSelectedBus(bus);

      // If the bus has route_id, toggle the route in the store
      if (bus.route_id) {
        toggleSelectedRoute(bus.route_id);
      }
    },
    [toggleSelectedRoute]
  );

  // 2. Determine if the route for the selectedRouteId is in our store
  const selectedRoute = routes.find((r) => r._id === selectedRouteId);

  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView contentContainerStyle={styles.screenContainer}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ alignItems: 'center', marginBottom: 4 }}>
            <Text style={{ fontWeight: 'bold' }}>Map</Text>
            <Text>Broker URL: {Env.BROKER_URL}</Text>
            {selectedBus && (
              <Text style={{ marginTop: 8 }}>
                Selected Bus: {selectedBus.vehicle_number_id} -{' '}
                {selectedBus.driver_name} on route {selectedBus.route_name}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={{
                latitude: 6.3,
                longitude: -75.58,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
            >
              {/* 3. Render bus markers */}
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

              {/* 4. Conditionally render Polyline if we have a selected route */}
              {selectedRoute && selectedRoute.directions.length > 0 && (
                <Polyline
                  coordinates={selectedRoute.directions}
                  strokeColor="#ff0000"
                  strokeWidth={5}
                />
              )}
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
