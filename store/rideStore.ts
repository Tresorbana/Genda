import { create } from 'zustand';
import { rideTypes } from '@/mocks/rides';

interface RideState {
  selectedRideId: string | null;
  rideTypes: typeof rideTypes;
  selectedRide: (typeof rideTypes)[0] | null;
  selectRide: (id: string) => void;
  clearRide: () => void;
}

export const useRideStore = create<RideState>((set, get) => ({
  selectedRideId: null,
  rideTypes,
  get selectedRide() {
    const { selectedRideId, rideTypes } = get();
    if (!selectedRideId) return null;
    return rideTypes.find((ride) => ride.id === selectedRideId) || null;
  },
  selectRide: (id) => set({ selectedRideId: id }),
  clearRide: () => set({ selectedRideId: null }),
}));