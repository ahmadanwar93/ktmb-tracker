export interface VehiclePosition {
  // shape of item returned from realtime API
  id: string;
  latitude: number;
  longitude: number;
  bearing?: number;
  speed?: number;
  timestamp: string;
  tripId?: string;
  routeId?: string;
  label?: string;
}

export interface FeedEntity {
  id: string;
  vehicle?: any;
}

export interface FeedMessage {
  entity: FeedEntity[];
  header: {
    gtfsRealtimeVersion: string;
    timestamp: number;
  };
}

export interface Trip {
  route_id: string;
  service_id: string;
  trip_id: string;
  direction_id: string;
}

export interface Route {
  agency_id: string;
  route_id: string;
  route_type: string;
  route_short_name: string;
  route_long_name: string;
  route_desc?: string;
  route_url?: string;
  route_color?: string;
  route_text_color?: string;
}

export interface Stop {
  stop_id: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
}

export interface StopTime {
  trip_id: string;
  arrival_time: string; // Format: "HH:MM:SS"
  departure_time: string; // Format: "HH:MM:SS"
  stop_id: string;
  stop_sequence: string;
  shape_dist_traveled?: string;
}

export interface Agency {
  agency_id: string;
  agency_name: string;
  agency_url: string;
  agency_timezone: string;
  agency_lang?: string;
  agency_phone?: string;
}

export interface Calendar {
  service_id: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  start_date: string; // Format: "YYYYMMDD"
  end_date: string; // Format: "YYYYMMDD"
}

export interface EnrichedVehicle extends VehiclePosition {
  routeId?: string;
  destination?: string;
  routeName?: string;
  nextStop?: string;
}

export interface TrainMarkerProps {
  vehicle: EnrichedVehicle;
}
