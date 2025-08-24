// src/component/LiveMap.jsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { BASE_URL, ENDPOINT_All_BUSES_LOCATIONS } from "../apiConfig.js";

// This is the URL of your backend API endpoint.
const API_URL = `${BASE_URL}${ENDPOINT_All_BUSES_LOCATIONS}`;

// Map container style
const containerStyle = {
  width: "100%",
  height: "80vh",
};

// Default map options
const defaultOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

// Default center of the map (Sri Lanka)
const defaultCenter = {
  lat: 7.8731,
  lng: 80.7718,
};

const LiveMap = () => {
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  // Use a ref to track if the component is mounted to prevent state updates on unmount
  const isMounted = useRef(true);

  // Load the Google Maps JavaScript API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Function to fetch bus data from the backend API
  const fetchBusLocations = useCallback(async () => {
    // Check for an existing fetch to prevent multiple requests at once
    if (isFetching) return;

    setIsFetching(true);
    setError(null); // Clear previous errors

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      if (isMounted.current) {
        setError("Authentication token not found. Please log in.");
        setIsFetching(false);
      }
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(API_URL, { headers });

      // Handle non-2xx HTTP responses
      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        if (response.status === 401) {
          errorMessage =
            "Unauthorized: Invalid or expired token. Please log in again.";
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Validate the data structure before updating state
      if (data && Array.isArray(data.data)) {
        if (isMounted.current) {
          setBuses(data.data);
        }
      } else {
        throw new Error("Invalid data format received from the API.");
      }
    } catch (e) {
      console.error("Failed to fetch bus locations:", e);
      if (isMounted.current) {
        setError(`Failed to load bus data: ${e.message}`);
      }
    } finally {
      if (isMounted.current) {
        setIsFetching(false);
      }
    }
  }, [isFetching]);

  // Use useEffect to fetch data when the component mounts and then every 10 seconds
  useEffect(() => {
    isMounted.current = true; // Set the ref to true when component mounts

    // Fetch on mount
    fetchBusLocations();

    const intervalId = setInterval(() => {
      fetchBusLocations();
    }, 10000);

    // Cleanup function: clears the interval and updates the ref when component unmounts
    return () => {
      clearInterval(intervalId);
      isMounted.current = false;
    };
  }, [fetchBusLocations]);

  // Conditional rendering for various states
  if (loadError) {
    return (
      <div className="text-center p-4">
        Error loading Google Maps. Check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="text-center p-4">Loading Map...</div>;
  }

  return (
    <div className="live-map-container p-4">
      <h2 className="text-2xl font-bold mb-4">Live Bus Tracking</h2>
      {error && <div className="text-red-500 mb-4 font-medium">{error}</div>}
      {isFetching && !buses.length && (
        <div className="text-gray-500 mb-4">Loading bus locations...</div>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={8}
        options={defaultOptions}
      >
        {buses.map((bus) => (
          <Marker
            key={bus.busId}
            position={{ lat: bus.latitude, lng: bus.longitude }}
            label={{
              text: bus.plateNumber,
              fontWeight: "bold",
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default LiveMap;
