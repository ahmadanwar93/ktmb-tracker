import type { VehiclePosition } from "../types/types";
import { decodeGTFSRealtime } from "./protobufDecoder";

const KTMB_ENDPOINT =
  "https://api.data.gov.my/gtfs-realtime/vehicle-position/ktmb";

export const fetchKTMBVehicles = async (): Promise<VehiclePosition[]> => {
  try {
    const response = await fetch(KTMB_ENDPOINT);
    // fetch works differently than axios. For axios, if status is not 2xx, then it will go to catch block
    // for fetch, catch block is for network error, or manual error thrown in the try block

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    // we have to specify how to interpret the response
    // in this case, we would like to keep the response as raw bytes

    // Decode the protobuf
    const decoded = await decodeGTFSRealtime(arrayBuffer);
    console.log(decoded);
    // restructure the format
    const vehicles: VehiclePosition[] = decoded.entity
      .filter((entity: any) => entity.vehicle && entity.vehicle.position)
      .map((entity: any) => {
        const vehicle = entity.vehicle;
        const position = vehicle.position;

        return {
          id: entity.id,
          latitude: position.latitude,
          longitude: position.longitude,
          bearing: position.bearing,
          speed: position.speed, // in gtfs documentation, speed is in m/s
          timestamp: new Date(Number(vehicle.timestamp) * 1000).toLocaleString(
            "en-MY",
            {
              timeZone: "Asia/Kuala_Lumpur",
            }
          ),
          tripId: vehicle.trip?.tripId,
          label: vehicle.vehicle?.label,
        };
      });

    return vehicles;
  } catch (error) {
    throw error;
  }
};
