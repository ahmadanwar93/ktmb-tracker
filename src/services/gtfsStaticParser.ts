import Papa from "papaparse";
import type { Trip, Route, Stop, StopTime } from "../types/types";

export class GTFSStaticData {
  private trips: Trip[] = [];
  private routes: Route[] = [];
  private stops: Stop[] = [];
  private stopTimes: StopTime[] = [];

  async loadFromFiles() {
    try {
      const [tripsRes, routesRes, stopsRes, stopTimesRes] = await Promise.all([
        fetch("/gtfs-static/trips.txt"),
        fetch("/gtfs-static/routes.txt"),
        fetch("/gtfs-static/stops.txt"),
        fetch("/gtfs-static/stop_times.txt"),
      ]);

      if (!tripsRes.ok || !routesRes.ok || !stopsRes.ok || !stopTimesRes.ok) {
        throw new Error("Failed to load GTFS static files");
      }

      const [tripsText, routesText, stopsText, stopTimesText] =
        await Promise.all([
          tripsRes.text(),
          routesRes.text(),
          stopsRes.text(),
          stopTimesRes.text(),
        ]);

      // the generic passed in is used for type purpose only
      this.trips = Papa.parse<Trip>(tripsText, {
        header: true,
        skipEmptyLines: true,
      }).data;

      // in the case of filename error or file doesnt exist, we would like to catch the error
      if (this.trips.length === 0 || !this.trips[0].trip_id) {
        throw new Error("trips.txt appears to be invalid or empty");
      }

      this.routes = Papa.parse<Route>(routesText, {
        header: true,
        skipEmptyLines: true,
      }).data;
      if (this.routes.length === 0 || !this.routes[0].route_id) {
        throw new Error("routes.txt appears to be invalid or empty");
      }

      this.stops = Papa.parse<Stop>(stopsText, {
        header: true,
        skipEmptyLines: true,
      }).data;
      if (this.stops.length === 0 || !this.stops[0].stop_id) {
        throw new Error("stops.txt appears to be invalid or empty");
      }

      this.stopTimes = Papa.parse<StopTime>(stopTimesText, {
        header: true,
        skipEmptyLines: true,
      }).data;
      if (this.stopTimes.length === 0 || !this.stopTimes[0].stop_id) {
        throw new Error("stop_times.txt appears to be invalid or empty");
      }
    } catch (error) {
      throw error;
    }
  }

  getTripInfo(tripId: string): Trip | undefined {
    return this.trips.find((t) => t.trip_id === tripId);
  }

  getRouteName(routeId: string): string | undefined {
    const route = this.routes.find((r) => r.route_id === routeId);
    return route?.route_long_name;
  }

  getStop(stopId: string): Stop | undefined {
    return this.stops.find((s) => s.stop_id === stopId);
  }

  getStopName(stopId: string): string | undefined {
    return this.stops.find((s) => s.stop_id === stopId)?.stop_name;
  }

  getTripStops(tripId: string): StopTime[] {
    return (
      this.stopTimes
        // filter out the irrelevant rows using tripId
        .filter((st) => st.trip_id === tripId)
        // then sort by ascending order
        // stop sequence is used to indicates the order of stops along the route
        .sort((a, b) => parseInt(a.stop_sequence) - parseInt(b.stop_sequence))
    );
  }

  getNextStop(tripId: string): string | undefined {
    const now = new Date();
    const currentTimeStr = now.toTimeString().slice(0, 8); // "HH:MM:SS"
    // have to remove the timezone information

    const tripStops = this.getTripStops(tripId);

    if (tripStops.length === 0) {
      return undefined;
    }

    // Find the next stop that hasn't been reached yet
    const nextStopTime = tripStops.find(
      (st) => st.arrival_time > currentTimeStr
    );

    if (!nextStopTime) {
      // All stops have passed, return the last stop (destination)
      const lastStop = tripStops[tripStops.length - 1];
      return this.getStopName(lastStop.stop_id);
    }

    return this.getStopName(nextStopTime.stop_id);
  }
}
