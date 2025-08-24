// src/component/ScheduleOptimizer.jsx

import React from "react";
import { Link } from "react-router-dom";

/**
 * Schedule Optimizer Component
 * Displays bus schedules with options to add, export, and refresh.
 * Includes a sidebar for navigation and a header with user-related icons.
 */
const ScheduleOptimizer = () => {
  // Mock data for schedules
  const scheduleData = [
    {
      id: 1,
      busId: "BUS001",
      route: "Colombo → Galle",
      departure: "08:00 AM",
      arrival: "11:00 AM",
      driver: "Driver A",
      status: "On Time",
    },
    {
      id: 2,
      busId: "BUS002",
      route: "Kandy → Colombo",
      departure: "09:00 AM",
      arrival: "12:30 PM",
      driver: "Driver B",
      status: "Delayed",
    },
    {
      id: 3,
      busId: "BUS003",
      route: "Negombo → Colombo",
      departure: "10:30 AM",
      arrival: "12:00 PM",
      driver: "Driver C",
      status: "On Time",
    },
    {
      id: 4,
      busId: "BUS004",
      route: "Matara → Colombo",
      departure: "01:00 PM",
      arrival: "05:00 PM",
      driver: "Driver D",
      status: "Cancelled",
    },
    {
      id: 5,
      busId: "BUS005",
      route: "Colombo → Jaffna",
      departure: "06:00 AM",
      arrival: "02:00 PM",
      driver: "Driver E",
      status: "On Time",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-inter">
      {/* Sidebar */}
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
              <Link
                to="/alerts"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                <span className="mr-2">🚨</span> Alerts
              </Link>
            </li>
            <li className="mb-2">
              {/* Active Link for Schedule Optimizer */}
              <Link
                to="/schedule-optimizer"
                className="flex items-center p-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200"
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

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2 sm:mb-0">
            Schedule Optimizer
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

        {/* Control Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          <button className="flex items-center px-4 py-2 bg-green-200 text-green-800 rounded-md hover:bg-green-300 transition-colors duration-200">
            <span className="mr-2">➕</span> Add Schedule
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200">
            <span className="mr-2">⬇️</span> Export
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200">
            <span className="mr-2">🔄</span> Refresh
          </button>
        </div>

        {/* Schedule Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bus ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Departure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrival
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scheduleData.map((schedule) => (
                  <tr key={schedule.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {schedule.busId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.route}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.departure}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.arrival}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.driver}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        schedule.status === "On Time"
                          ? "text-green-600"
                          : schedule.status === "Delayed"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {schedule.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <a href="#" className="text-teal-600 hover:text-teal-900">
                        Edit
                      </a>
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

export default ScheduleOptimizer;
