// src/component/BusAndDriverManagement.jsx

import React from "react";
import { Link } from "react-router-dom";

/**
 * BusAndDriverManagement Component
 * This component displays a list of buses and their assigned drivers.
 * It includes a sidebar for navigation, a header, and options to manage entries.
 * The layout is designed to be responsive.
 */
const BusAndDriverManagement = () => {
  // Mock data for bus and driver management
  const managementData = [
    {
      id: 1,
      busId: "B001",
      driverName: "K. Perera",
      contact: "077-1234567",
      route: "Route A",
      status: "On Route",
    },
    {
      id: 2,
      busId: "B002",
      driverName: "S. Silva",
      contact: "071-2345678",
      route: "Route B",
      status: "Idle",
    },
    {
      id: 3,
      busId: "B003",
      driverName: "M. Fernando",
      contact: "076-3456789",
      route: "Route C",
      status: "Maintenance",
    },
    {
      id: 4,
      busId: "B004",
      driverName: "N. Bandara",
      contact: "070-4567890",
      route: "Route D",
      status: "On Route",
    },
    {
      id: 5,
      busId: "B005",
      driverName: "L. Jayasuriya",
      contact: "075-5678901",
      route: "Route E",
      status: "Idle",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-inter">
      {/*
        Sidebar Navigation Area
        The 'Bus and Driver Management' link is styled to appear active.
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
              <Link
                to="/alerts"
                className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200"
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
              {/* Bus and Driver Management Link (Active) */}
              <Link
                to="/bus-driver-management"
                className="flex items-center p-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200"
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

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2 sm:mb-0">
            Bus & Driver Management
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

        {/* Control Buttons (Add New, Filter, Export) */}
        <div className="flex justify-end space-x-4 mb-6">
          <button className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200">
            <span className="mr-2">➕</span> Add New
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200">
            <span className="mr-2">🔍</span> Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200">
            <span className="mr-2">⬇️</span> Export
          </button>
        </div>

        {/* Bus and Driver Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Driver Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Assigned Route
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {managementData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.busId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.driverName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.route}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "On Route"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Idle"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <a href="#" className="text-teal-600 hover:text-teal-900">
                        Edit
                      </a>
                      <span className="text-gray-300"> • </span>
                      <a href="#" className="text-red-600 hover:text-red-900">
                        Delete
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

export default BusAndDriverManagement;
