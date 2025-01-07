import { create } from 'zustand';

import { type RouteItem } from '@/models/routes-payload';

/**
 * We'll track:
 *   - `routes`: the array of routes fetched from the API
 *   - `setRoutes`: to store them
 *   - `selectedRouteId`: which route we currently want to show on the map
 *   - `toggleSelectedRoute`: if the user taps a bus (which has a route_id),
 *        we either select it or unselect it if it's already selected
 */
interface RouteStore {
  routes: RouteItem[];
  selectedRouteId: string | null;

  setRoutes: (newRoutes: RouteItem[]) => void;
  toggleSelectedRoute: (routeId: string) => void;
}

export const useRouteStore = create<RouteStore>((set) => ({
  routes: [],
  selectedRouteId: null,

  setRoutes: (newRoutes) => set({ routes: newRoutes }),

  toggleSelectedRoute: (routeId) =>
    set((state) => ({
      selectedRouteId: state.selectedRouteId === routeId ? null : routeId,
    })),
}));
