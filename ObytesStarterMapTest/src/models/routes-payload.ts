export interface DirectionPoint {
  latitude: number;
  longitude: number;
}

export interface AdmService {
  _id: string;
  name: string;
}

export interface Vehicle {
  _id: string;
  registerId: string;
  associate: {
    _id: string;
    name: string;
  };
}

export interface Driver {
  _id: string;
  name: string;
  email: string;
}

export interface RouteItem {
  _id: string;
  name: string;
  state: boolean;
  directions: DirectionPoint[];
  admService: AdmService;
  vehicle: Vehicle[];
  driver: Driver[];
  interestPoints: string[];
  isProcessed: boolean;
  isFinished: boolean;
}

export interface RoutesResponse {
  total: number;
  routes: RouteItem[];
}
