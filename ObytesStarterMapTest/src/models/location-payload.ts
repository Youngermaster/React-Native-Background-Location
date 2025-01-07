export interface LocationPayload {
  driverLocation: {
    latitude: number;
    longitude: number;
  };
  timestamp: any;
  route_interestPoints: any;
  admService_name: any;
  vehicle_number_id: any;
  vehicle_iconMetro: any;
  vehicle_color: any;
  driver_id: any;
  driver_name: any;
  route_id: any;
  route_name: any;
  route_directions: any;
  route_isProcessed: any;
  route_isFinished: any;
  admService_id?: any;
}
