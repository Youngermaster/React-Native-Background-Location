import { Client } from 'react-native-paho-mqtt';

import { type LocationPayload } from '@/models/location-payload';

// Simple in-memory storage
const myStorage: Record<string, any> = {
  setItem: (key: string, item: any) => {
    myStorage[key] = item;
  },
  getItem: (key: string) => myStorage[key],
  removeItem: (key: string) => {
    delete myStorage[key];
  },
};

// Create a client instance
const mqttClient = new Client({
  uri: 'ws://dev.grisu.co:8083/mqtt',
  clientId: 'busMap_' + Math.random().toString(16).substring(2, 8),
  storage: myStorage,
});

// Setup event handlers
mqttClient.on('connectionLost', (responseObject: any) => {
  if (responseObject.errorCode !== 0) {
    console.log('onConnectionLost:', responseObject.errorMessage);
    // Try reconnect logic or rely on reconnect: true
    reconnectToBroker();
  }
});

mqttClient.on('messageReceived', (message: any) => {
  console.log('Message received:', message.payloadString);
});

export const connectToBroker = async () => {
  try {
    // Keep the connection alive
    await mqttClient.connect({
      keepAliveInterval: 30,
      reconnect: true,
      onSuccess: () => {
        console.log('Connected to broker (or reconnected)');
        mqttClient.subscribe('location_drivers/#');
      },
      onFailure: (err: any) => {
        console.log('Connect failed', err);
      },
    });
    console.log('Connected to MQTT broker');
  } catch (err) {
    console.log('Error on MQTT connect:', err);
  }
};

export const disconnectFromBroker = async () => {
  try {
    await mqttClient.disconnect();
    console.log('Disconnected from MQTT broker');
  } catch (err) {
    console.log('Error on MQTT disconnect:', err);
  }
};

export const subscribeToTopic = async (topic: string) => {
  try {
    await mqttClient.subscribe(topic);
    console.log(`Subscribed to topic: ${topic}`);
  } catch (err) {
    console.log('Error subscribing to topic:', err);
  }
};

export const setMessageHandler = (
  handler: (payload: LocationPayload) => void
) => {
  // Re-assign the messageReceived callback to handle new messages
  mqttClient.on('messageReceived', (message: any) => {
    try {
      const data = JSON.parse(message.payloadString) as LocationPayload;
      handler(data);
    } catch (error) {
      console.warn('Could not parse JSON from MQTT:', error);
    }
  });
};

function reconnectToBroker() {
  mqttClient
    .connect({ keepAliveInterval: 30, reconnect: true })
    .then(() => {
      console.log('Reconnected to MQTT broker');
      return mqttClient.subscribe('location_drivers/#');
    })
    .then(() => {
      console.log('Re-subscribed to topic after reconnect');
    })
    .catch((err: any) => {
      console.log('Error on reconnect:', err);
    });
}

export default mqttClient;
