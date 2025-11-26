import { useEffect, useState } from "react";
import { GTFSStaticData } from "./services/gtfsStaticParser";
import { fetchKTMBVehicles } from "./services/gtfsApi";
import type { AppError, EnrichedVehicle, VehiclePosition } from "./types/types";
import { TrainMap } from "./components/TrainMap";
import "./App.css";

const gtfsStatic = new GTFSStaticData();

function App() {
  const [vehicles, setVehicles] = useState<EnrichedVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const enrichVehicles = (
    realtimeVehicles: VehiclePosition[]
  ): EnrichedVehicle[] => {
    return realtimeVehicles.map((vehicle) => {
      const tripInfo = gtfsStatic.getTripInfo(vehicle.tripId || "");
      const routeName = tripInfo
        ? gtfsStatic.getRouteName(tripInfo.route_id)
        : undefined;
      const nextStop = vehicle.tripId
        ? gtfsStatic.getNextStop(vehicle.tripId)
        : undefined;

      return {
        ...vehicle,
        routeId: tripInfo?.route_id,
        routeName: routeName,
        nextStop: nextStop,
      };
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await gtfsStatic.loadFromFiles();
        const realtimeVehicles = await fetchKTMBVehicles();
        const enriched = enrichVehicles(realtimeVehicles);
        setVehicles(enriched);
        setIsLoading(false);
      } catch (err: any) {
        setError({
          message: err.message || "Unknown error",
          status: err.status,
        });
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Run once on mount

  useEffect(() => {
    if (isLoading) return; // Don't start polling until initial load complete

    const interval = setInterval(async () => {
      try {
        const realtimeVehicles = await fetchKTMBVehicles();
        const enriched = enrichVehicles(realtimeVehicles);
        setVehicles(enriched);
      } catch (err: any) {
        console.error("Error updating vehicles:", err);
        setError({
          message: err.message || "Unknown error",
          status: err.status,
        });
      }
    }, 60000); // 60 seconds

    return () => {
      clearInterval(interval);
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div>Loading KTMB vehicle data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-col gap-4 bg-gray-900 text-white p-4">
        {error.status === 429 ? (
          <>
            <p className="text-lg sm:text-xl text-center">
              Error: HTTP error! status: 429
            </p>
            <p className="text-gray-400 text-sm sm:text-base max-w-md text-center px-4">
              The API has rate limited requests. Too many requests were made in
              a short period. Please wait a few minutes before retrying.
            </p>
          </>
        ) : (
          <p className="text-lg sm:text-xl text-center px-4">
            Error: {error.message}
          </p>
        )}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 text-black rounded text-sm sm:text-base"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-16 px-10 bg-gray-800 border-b border-gray-700 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">KTMB Train Tracker</h1>
        <div className="hidden md:flex gap-6 text-sm text-gray-500">
          <span>Updates every 60 seconds</span>
        </div>
      </header>
      <div className="flex-1 relative">
        <TrainMap vehicles={vehicles} />
      </div>
      <footer className="bg-gray-900 border-t border-gray-700 px-10 py-3 text-xs text-gray-400">
        <div className="flex justify-between items-center">
          <div>
            Data source:{" "}
            <a
              href="https://developer.data.gov.my/realtime-api/gtfs-realtime"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              GTFS Realtime
            </a>{" "}
            /{" "}
            <a
              href="https://developer.data.gov.my/realtime-api/gtfs-static"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              GTFS Static
            </a>{" "}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
