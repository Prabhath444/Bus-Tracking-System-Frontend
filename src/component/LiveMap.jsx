import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { BASE_URL, ENDPOINT_All_BUSES_LOCATIONS } from "../apiConfig.js"; // Using original apiConfig

// --- API endpoint URL from original file ---
const API_URL = `${BASE_URL}${ENDPOINT_All_BUSES_LOCATIONS}`;

// --- Styles and initial map coordinates from LiveMap2 ---
const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 6.9271, // Centered on Colombo for a better default view
  lng: 79.8612,
};

const LiveMap = () => {
  // --- State management from both files ---
  const [locations, setLocations] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null); // For InfoWindow
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const isMounted = useRef(true); // From original LiveMap for safe async operations

  // --- Load Google Maps script (from LiveMap2) ---
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // --- Custom bus icon using useMemo (from LiveMap2) ---
  const busIcon = useMemo(() => {
    if (!isLoaded) return null;
    return {
      path: 'M12 2c-4.42 0-8 .5-8 4v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1V6c0-3.5-3.58-4-8-4zm0 2c3.47 0 6 .19 6 2H6c0-1.81 2.53-2 6-2zm-5 5h10v2H7V9zm5 4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
      fillColor: '#2563eb',
      fillOpacity: 1,
      strokeWeight: 0,
      scale: 2.5,
      anchor: new window.google.maps.Point(12, 12),
    };
  }, [isLoaded]);

  // --- Robust data fetching function (from original LiveMap) ---
  const fetchLocations = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);
    setError(null);

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      if (isMounted.current) {
        setError("Authentication token not found. Please log in.");
        setIsFetching(false);
      }
      return;
    }

    try {
      const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data.data)) {
        if (isMounted.current) {
          setLocations(data.data);
        }
      } else {
        throw new Error("Invalid data format received from the API.");
      }
    } catch (e) {
      console.error("Failed to fetch live locations:", e);
      if (isMounted.current) {
        setError(`Could not load live location data: ${e.message}`);
      }
    } finally {
      if (isMounted.current) {
        setIsFetching(false);
      }
    }
  }, [isFetching]);

  // --- useEffect for periodic fetching (combining logic from both) ---
  useEffect(() => {
    isMounted.current = true;
    fetchLocations(); // Fetch immediately on mount

    const intervalId = setInterval(fetchLocations, 5000); // 5-second interval from LiveMap2

    return () => { // Cleanup from original LiveMap
      clearInterval(intervalId);
      isMounted.current = false;
    };
  }, [fetchLocations]);

  // --- Render logic for loading/error states ---
  if (loadError) {
    return <div className="flex justify-center items-center h-screen">Error loading Google Maps. Please check your API key and network connection.</div>;
  }

  // --- Main component render with modern UI from LiveMap2 ---
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-inter">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white shadow-md p-4 mb-4 md:mb-0">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">SLGPS</h1>
        <nav>
          <ul>
            <li className="mb-2">
              {/* Dashboard Link (Active) - Dashboard link  */}
              <Link
                to="/dashboard"
                className="flex items-center p-2  text-gray-700  hover:bg-gray-200 transition-colors duration-200"
              >
                <span className="mr-2">🏠</span> Dashboard
              </Link>
            </li>
            <li className="mb-2">
              {/* Live Map Link */}
              <Link
                to="/live-map"
                className="flex items-center p-2  text-blue-700  bg-blue-100 hover:bg-blue-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">📍</span> Live Map
              </Link>
            </li>
            <li className="mb-2">
              {/* Bus Performance Monitor Link */}
              <Link
                to="/bus-performance"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">🚌</span> Bus Performance Monitor
              </Link>
            </li>
            <li className="mb-2">
              {/* Alerts Link */}
              <Link
                to="/alerts"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">🚨</span> Alerts
              </Link>
            </li>
            <li className="mb-2">
              {/* Schedule Optimizer Link */}
              <Link
                to="/schedule-optimizer"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">📅</span> Schedule Optimizer
              </Link>
            </li>
            <li className="mb-2">
              {/* Bus and Driver Management Link */}
              <Link
                to="/bus-driver-management"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">👥</span> Bus and Driver Management
              </Link>
            </li>
            <li className="mb-2">
              {/* User Management Link */}
              <Link
                to="/user-management"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">👨‍💼</span> User Management
              </Link>
            </li>
            <li className="mb-2">
              {/* Setting Link */}
              <Link
                to="/settings"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">⚙️</span> Setting
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 z-10">
          <h2 className="text-2xl font-semibold text-gray-800">Live Bus Map</h2>
        </header>

        {/* Map Container */}
        <main className="flex-1 relative">
          {error && <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-100 text-red-700 p-3 rounded-md z-20">{error}</div>}

          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={12}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                zoomControl: true,
                gestureHandling: 'cooperative',
              }}
              onClick={() => setSelectedBus(null)}
            >
              {locations.map(bus => (
                <MarkerF
                  key={bus.busId}
                  position={{ lat: bus.latitude, lng: bus.longitude }}
                  icon={busIcon}
                  title={`Bus: ${bus.plateNumber}`}
                  onClick={() => setSelectedBus(bus)}
                />
              ))}

              {selectedBus && (
                <InfoWindowF
                  position={{ lat: selectedBus.latitude, lng: selectedBus.longitude }}
                  onCloseClick={() => setSelectedBus(null)}
                >
                  <div className="p-1">
                    <h3 className="font-bold text-lg mb-1">{selectedBus.plateNumber}</h3>
                    <p><strong>Speed:</strong> {selectedBus.speed ?? 'N/A'} kph</p>
                    <p><strong>Last Update:</strong> {new Date(selectedBus.timestamp).toLocaleTimeString()}</p>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          ) : (
            <div className="flex justify-center items-center h-full">Loading map...</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default LiveMap;