// src/component/Dashboard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { BASE_URL, ENDPOINT_All_BUSES } from "../apiConfig.js"; // Adjust the path if needed

/**
 * Dashboard Component
 * This component displays the main dashboard overview with various data cards.
 * It includes a sidebar for navigation and a header with user-related icons.
 * The layout is designed to be responsive across different screen sizes.
 */
function Dashboard() {
  // State to store the bus data, loading status, and any errors

  const [busData, setBusData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to hold the counts of each bus category
  const [counts, setCounts] = useState({
    active: 0,
    inactive: 0,
    gpsOnline: 0,
    gpsOffline: 0,
  });

  useEffect(() => {
    // Asynchronous function to handle the data fetching
    const fetchBusDetails = async () => {
      try {
        // Get the token from session storage
        const token = sessionStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        // The API endpoint
        const endpoint = `${BASE_URL}${ENDPOINT_All_BUSES}`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include the token for authentication
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // Throw an error if the server response is not okay
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBusData(data); // Set the received data to the state

        // Filter the data and update the counts state
        setCounts({
          active: data.data.filter((bus) => bus.status === "Active").length,
          inactive: data.data.filter((bus) => bus.status === "Inactive").length,
          gpsOnline: data.data.filter((bus) => bus.gpsStatus === "Online")
            .length,
          gpsOffline: data.data.filter((bus) => bus.gpsStatus === "Offline")
            .length,
        });
      } catch (error) {
        setError(error.message); // Set the error message to the state
      } finally {
        setIsLoading(false); // Always set loading to false when done
      }
    };

    fetchBusDetails(); // Call the function when the component mounts

    // Set up the auto-refresh interval (every 60 seconds)
    const intervalId = setInterval(fetchBusDetails, 60000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // The empty dependency array ensures this effect runs only once

  // Conditional rendering based on state
  if (isLoading) {
    return <div>Loading bus details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-inter">
      {/*
        Sidebar Navigation Area
        
      */}
      <aside className="w-full md:w-64 bg-white shadow-md p-4 mb-4 md:mb-0">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">SLGPS</h1>
        <nav>
          <ul>
            <li className="mb-2">
              {/* Dashboard Link (Active) - Dashboard link  */}
              <Link
                to="/dashboard"
                className="flex items-center p-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200"
              >
                <span className="mr-2">🏠</span> Dashboard
              </Link>
            </li>
            <li className="mb-2">
              {/* Live Map Link */}
              <Link
                to="/live-map"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
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

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header for the main content area (Page Title and top-right icons) */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
          {/* Page Title */}
          <h2 className="text-3xl font-semibold text-gray-800 mb-2 sm:mb-0">
            Overview
          </h2>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
              <span className="text-2xl">⚙️</span>
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
              <span className="text-2xl">🔔</span>
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
              <span className="text-2xl">👤</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Total Buses */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Total Buses
            </h3>
            {/* Active Buses data - */}
            <p className="flex items-center justify-between text-gray-600 mb-1">
              <span>Active Buses:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {counts.active}
              </span>
            </p>
            {/* Inactive Buses data - */}
            <p className="flex items-center justify-between text-gray-600">
              <span>Inactive Buses:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {counts.inactive}
              </span>
            </p>
            {/* More link - */}
            <a
              href="#"
              className="text-teal-600 hover:text-teal-800 text-sm mt-4 block"
            >
              More
            </a>
          </div>

          {/* Card 2: Buses Currently On Road */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Buses Currently On Road
            </h3>

            <div className="text-5xl font-bold text-center text-green-700 my-4">
              {counts.gpsOnline}
            </div>
            <a
              href="#"
              className="text-teal-600 hover:text-teal-800 text-sm mt-2 block"
            >
              More
            </a>
          </div>

          {/* Card 3: Speed Alerts Today */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Speed Alerts Today
            </h3>

            <div className="text-5xl font-bold text-center text-red-700 my-4"></div>
            <a
              href="#"
              className="text-teal-600 hover:text-teal-800 text-sm mt-2 block"
            >
              More
            </a>
          </div>

          {/* Card 4: Delayed Bus Count Today */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delayed Bus Count Today
            </h3>

            <div className="text-5xl font-bold text-center text-yellow-700 my-4"></div>
            <a
              href="#"
              className="text-teal-600 hover:text-teal-800 text-sm mt-2 block"
            >
              More
            </a>
          </div>

          {/* Card 5: Average Speed */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Average Speed
            </h3>

            <div className="text-5xl font-bold text-center text-green-700 my-4"></div>
            <a
              href="#"
              className="text-teal-600 hover:text-teal-800 text-sm mt-2 block"
            >
              More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
