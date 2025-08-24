// src/component/Alerts.jsx

import React from "react";
import { Link } from "react-router-dom";

/**
 * Alerts Component
 * This component displays a list of alerts with filtering and export options.
 * It includes a sidebar for navigation and a header with user-related icons.
 * The layout is designed to be responsive across different screen sizes.
 */
const Alerts = () => {
  // Mock data for alerts - In a real application, this data would be fetched from an API.
  const alertData = [
    {
      id: 1,
      type: "Overspeed",
      busId: "BUS001",
      time: "10:30 AM",
      severity: "High",
      status: "Active",
      action: "view",
    },
    {
      id: 2,
      type: "Consistently slow speed",
      busId: "BUS005",
      time: "11:15 AM",
      severity: "Medium",
      status: "Active",
      action: "View",
    },
    {
      id: 3,
      type: "Long stop",
      busId: "BUS010",
      time: "12:00 PM",
      severity: "Low",
      status: "Resolved",
      action: "View",
    },
    {
      id: 4,
      type: "Missed stop",
      busId: "BUS003",
      time: "01:45 PM",
      severity: "High",
      status: "Active",
      action: "View",
    },
    {
      id: 5,
      type: "Late arrival",
      busId: "BUS007",
      time: "02:30 PM",
      severity: "Medium",
      status: "Active",
      action: "View",
    },
    {
      id: 6,
      type: "GPS signal lost",
      busId: "BUS002",
      time: "03:00 PM",
      severity: "High",
      status: "Active",
      action: "View",
    },
    {
      id: 7,
      type: "Accident detected",
      busId: "BUS009",
      time: "03:45 PM",
      severity: "Critical",
      status: "Active",
      action: "View",
    },
  ];

  return (
    // Main container for the entire screen. Uses flexbox to arrange sidebar and main content.
    // Stacks vertically on mobile (flex-col), arranges horizontally on medium screens (md:flex-row).
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-inter">
      {/*
        Sidebar Navigation Area
        Contains navigation links similar to Dashboard and other pages.
        The 'Alerts' link is styled to appear active.
      */}
      <aside className="w-full md:w-64 bg-white shadow-md p-4 mb-4 md:mb-0">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">SLGPS</h1>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">🏠</span> Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/live-map"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">📍</span> Live Map
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/bus-performance"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">🚌</span> Bus Performance Monitor
              </Link>
            </li>
            <li className="mb-2">
              {/* Alerts Link (Active) - Styles the Alerts link to appear active */}
              <Link
                to="/alerts"
                className="flex items-center p-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200"
              >
                <span className="mr-2">🚨</span> Alerts
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/schedule-optimizer"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">📅</span> Schedule Optimizer
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/bus-driver-management"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">👥</span> Bus and Driver Management
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/user-management"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">👨‍💼</span> User Management
              </Link>
            </li>
            <li className="mb-2">
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

      {/* Main Content Area - Fills the remaining space after the sidebar */}
      {/* Reduces padding on mobile, enables vertical scroll if content overflows */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header for the main content area (Page Title and top-right icons) */}
        {/* Stacks vertically on mobile (flex-col), arranges horizontally on small screens (sm:flex-row) */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
          {/* Page Title */}
          <h2 className="text-3xl font-semibold text-gray-800 mb-2 sm:mb-0">
            Alerts
          </h2>
          {/* Top-right icons - Reduces spacing between icons on mobile */}
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

        {/* Control Buttons (Filter, Export, Refresh) */}
        <div className="flex justify-end space-x-4 mb-6">
          <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200">
            <span className="mr-2">🔍</span> Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200">
            <span className="mr-2">⬇️</span> Export
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200">
            <span className="mr-2">🔄</span> Refresh
          </button>
        </div>

        {/* Alerts Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Added overflow-x-auto to make the table horizontally scrollable on small screens */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Alert Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Bus ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Severity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {alertData.map((alert) => (
                  <tr key={alert.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {alert.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.busId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.time}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        alert.severity === "High" ||
                        alert.severity === "Critical"
                          ? "text-red-600"
                          : alert.severity === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {alert.severity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {alert.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative inline-block text-left">
                        {/* Dropdown trigger */}
                        <button
                          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                          type="button"
                          onClick={(e) => {
                            const menu = e.currentTarget.nextSibling;
                            menu.classList.toggle("hidden");
                          }}
                        >
                          ⋮
                        </button>

                        {/* Dropdown Menu */}
                        <div className="hidden absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <button
                              onClick={() =>
                                console.log("View alert:", alert.id)
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              👁 View
                            </button>
                            <button
                              onClick={() =>
                                console.log("Edit alert:", alert.id)
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() =>
                                console.log("Dismiss alert:", alert.id)
                              }
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                            >
                              ❌ Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
