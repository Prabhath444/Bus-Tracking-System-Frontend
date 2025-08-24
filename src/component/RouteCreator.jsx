import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, PolylineF } from "@react-google-maps/api";
import { apiClient } from "../context/AuthContext"; // Your configured API client for authenticated requests
import { Route } from "react-router-dom";
// --- Map Styling & Defaults ---
const containerStyle = { width: "100%", height: "calc(100vh - 200px)" };
const defaultCenter = { lat: 7.8731, lng: 80.7718 };
const defaultOptions = { disableDefaultUI: true, zoomControl: true };

const RouteCreator = () => {
  // --- State for Map and Drawing ---
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);

  // --- State for Generated Path & Inputs ---
  const [createdPath, setCreatedPath] = useState([]);
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [travelMode, setTravelMode] = useState("driving");

  // --- State for UI/API Status ---
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [error, setError] = useState("");

  // --- Refs for managing component lifecycles ---
  const currentPolylineRef = useRef(null);
  const isMounted = useRef(true);

  // --- Load Google Maps API with necessary libraries ---
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["drawing", "geometry"], // 'drawing' for tools, 'geometry' for polyline utilities
  });

  // --- Initialize Drawing Manager on Map Load ---
  const onMapLoad = useCallback(
    (mapInstance) => {
      setMap(mapInstance);

      if (window.google.maps.drawing && !drawingManager) {
        const newDrawingManager = new window.google.maps.drawing.DrawingManager(
          {
            drawingMode: window.google.maps.drawing.OverlayType.POLYLINE,
            drawingControl: true,
            drawingControlOptions: {
              position: window.google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [window.google.maps.drawing.OverlayType.POLYLINE],
            },
            polylineOptions: {
              strokeColor: "#3B82F6",
              strokeOpacity: 0.8,
              strokeWeight: 5,
              editable: true,
              draggable: true,
            },
          }
        );

        newDrawingManager.setMap(mapInstance);
        setDrawingManager(newDrawingManager);

        window.google.maps.event.addListener(
          newDrawingManager,
          "overlaycomplete",
          (event) => {
            if (
              event.type === window.google.maps.drawing.OverlayType.POLYLINE
            ) {
              if (currentPolylineRef.current) {
                currentPolylineRef.current.setMap(null);
              }
              const newPolyline = event.overlay;
              currentPolylineRef.current = newPolyline;
              const pathCoords = newPolyline
                .getPath()
                .getArray()
                .map((latLng) => ({
                  lat: latLng.lat(),
                  lng: latLng.lng(),
                }));
              setCreatedPath(pathCoords);

              newPolyline.setEditable(true);
              newPolyline.setDraggable(true);
              const path = newPolyline.getPath();
              path.addListener("set_at", () => updatePathCoords(newPolyline));
              path.addListener("insert_at", () =>
                updatePathCoords(newPolyline)
              );
              path.addListener("remove_at", () =>
                updatePathCoords(newPolyline)
              );
            }
          }
        );
      }
    },
    [drawingManager]
  );

  // --- Function to update coordinates after polyline is edited ---
  const updatePathCoords = useCallback((polyline) => {
    const updatedCoords = polyline
      .getPath()
      .getArray()
      .map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));
    setCreatedPath(updatedCoords);
  }, []);

  // --- Function to generate road path from user inputs ---
  const handleGenerateRoadPath = async () => {
    if (!originInput.trim() || !destinationInput.trim()) {
      setError("Please enter both origin and destination.");
      return;
    }
    setIsGeneratingPath(true);
    setError("");
    setCreatedPath([]);

    try {
      const response = await apiClient.get("/get-road-path", {
        params: {
          origin: originInput,
          destination: destinationInput,
          mode: travelMode,
        },
      });

      if (response.data.success && response.data.encoded_polyline) {
        if (
          window.google &&
          window.google.maps &&
          window.google.maps.geometry
        ) {
          const decodedPath = window.google.maps.geometry.encoding.decodePath(
            response.data.encoded_polyline
          );
          setCreatedPath(
            decodedPath.map((latLng) => ({
              lat: latLng.lat(),
              lng: latLng.lng(),
            }))
          );

          if (map && decodedPath.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            decodedPath.forEach((point) => bounds.extend(point));
            map.fitBounds(bounds);
          }
          if (currentPolylineRef.current) {
            currentPolylineRef.current.setMap(null); // Remove previous manually drawn line
            currentPolylineRef.current = null;
          }
        } else {
          setError(
            "Google Maps geometry library not loaded, cannot decode polyline."
          );
        }
      } else {
        setError(
          response.data.message ||
            "Failed to generate road path from directions."
        );
      }
    } catch (err) {
      console.error("Error generating road path:", err);
      setError(
        err.response?.data?.message ||
          "Could not generate road path. Check inputs and API."
      );
    } finally {
      setIsGeneratingPath(false);
    }
  };

  // --- Functions to save and clear the route ---
  const handleSaveRoute = async () => {
    if (createdPath.length < 2) {
      setError(
        "Please draw or generate a path with at least two points before saving."
      );
      return;
    }
    if (!routeName.trim()) {
      setError("Please enter a name for the route.");
      return;
    }

    setSaveStatus("Saving...");
    setError("");

    try {
      const response = await apiClient.post("/routes", {
        name: routeName,
        description: routeDescription,
        path_coordinates: createdPath,
      });

      setSaveStatus(response.data.message);
      setRouteName("");
      setRouteDescription("");
      setCreatedPath([]);
      if (currentPolylineRef.current) {
        currentPolylineRef.current.setMap(null);
        currentPolylineRef.current = null;
      }
    } catch (err) {
      console.error("Failed to save route:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        setError(Object.values(err.response.data.errors).flat().join(" "));
      } else if (
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        setError(err.response.data.message);
      } else {
        setError(
          "Could not save route. Please check your backend and try again."
        );
      }
      setSaveStatus("Save failed.");
    } finally {
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleClearRoute = () => {
    if (currentPolylineRef.current) {
      currentPolylineRef.current.setMap(null);
      currentPolylineRef.current = null;
    }
    setCreatedPath([]);
    setRouteName("");
    setRouteDescription("");
    setError("");
    setSaveStatus("Route cleared.");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  // --- Lifecycle Hook for Cleanup ---
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (drawingManager) {
        drawingManager.setMap(null);
      }
      if (currentPolylineRef.current) {
        currentPolylineRef.current.setMap(null);
      }
    };
  }, [drawingManager]);

  // --- Conditional Renderings for Loading/Error States ---
  if (loadError) {
    return (
      <div className="text-center p-4 text-red-600">
        Error loading Google Maps API. Check your key and network.
      </div>
    );
  }
  if (!isLoaded) {
    return <div className="text-center p-4">Loading Map Drawing Tools...</div>;
  }

  // --- Main Component JSX ---
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter rounded-md shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Create New Bus Route
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Generate Path from Roads
        </h3>
        <p className="text-gray-700 text-sm mb-4">
          Enter origin and destination to automatically generate a route along
          existing roads.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="origin"
              className="block text-sm font-medium text-gray-700"
            >
              Origin (Address or Lat,Lng)
            </label>
            <input
              type="text"
              id="origin"
              value={originInput}
              onChange={(e) => setOriginInput(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder="e.g., Colombo Fort"
            />
          </div>
          <div>
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700"
            >
              Destination (Address or Lat,Lng)
            </label>
            <input
              type="text"
              id="destination"
              value={destinationInput}
              onChange={(e) => setDestinationInput(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder="e.g., Galle Face Green"
            />
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="travelMode"
            className="block text-sm font-medium text-gray-700"
          >
            Travel Mode
          </label>
          <select
            id="travelMode"
            value={travelMode}
            onChange={(e) => setTravelMode(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          >
            <option value="driving">Driving</option>
            <option value="walking">Walking</option>
            <option value="bicycling">Bicycling</option>
            <option value="transit">Transit</option>
          </select>
        </div>
        <button
          onClick={handleGenerateRoadPath}
          disabled={isGeneratingPath}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          {isGeneratingPath ? "Generating..." : "Generate Road Path"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Or Draw a Custom Path
        </h3>
        <p className="text-gray-700 text-sm mb-4">
          Use the drawing tools on the map to create a custom route.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="routeName"
              className="block text-sm font-medium text-gray-700"
            >
              Route Name
            </label>
            <input
              type="text"
              id="routeName"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder="e.g., Route 101 - Fort to Galle Road"
            />
          </div>
          <div>
            <label
              htmlFor="routeDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Description (Optional)
            </label>
            <input
              type="text"
              id="routeDescription"
              value={routeDescription}
              onChange={(e) => setRouteDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder="Details about the route"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClearRoute}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Clear Route
          </button>
          <button
            onClick={handleSaveRoute}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Save Route
          </button>
        </div>

        {error && (
          <p className="mt-4 text-red-600 text-sm font-medium">{error}</p>
        )}
        {saveStatus && (
          <p className="mt-4 text-green-600 text-sm font-medium">
            {saveStatus}
          </p>
        )}
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        options={defaultOptions}
        onLoad={onMapLoad}
        onUnmount={() => {
          setMap(null);
          setDrawingManager(null);
        }}
      >
        {createdPath.length > 1 && (
          <PolylineF
            path={createdPath}
            options={{
              strokeColor: "#0000FF",
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}
      </GoogleMap>

      {createdPath.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Current Drawn Path Coordinates:
          </h3>
          <textarea
            className="w-full h-32 p-2 border rounded-md bg-gray-50 text-sm text-gray-800 resize-y"
            readOnly
            value={JSON.stringify(createdPath, null, 2)}
          />
          <p className="text-sm text-gray-600 mt-2">
            Total points: {createdPath.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default RouteCreator;
