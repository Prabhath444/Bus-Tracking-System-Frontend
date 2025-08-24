// src/component/BusPerformanceMonitor.jsx

import React from 'react';
import { Link } from 'react-router-dom';

/**
 * BusPerformanceMonitor Component
 * This component displays bus performance data with filtering and export options.
 * It includes a sidebar for navigation and a header with user-related icons.
 * The layout is designed to be responsive across different screen sizes.
 */
const BusPerformanceMonitor = () => {
  // Mock data for bus performance - In a real application, this data would be fetched from an API.
  const performanceData = [
    { id: 1, busId: 'B001', performance: 'Excellent', route: 'Route A', avgSpeed: '45 mph', stopsMissed: 0, alerts: 'None', uptime: '99%', fuelEfficiency: 'Good' },
    { id: 2, busId: 'B002', performance: 'Good', route: 'Route B', avgSpeed: '38 mph', stopsMissed: 1, alerts: 'Minor', uptime: '98%', fuelEfficiency: 'Average' },
    { id: 3, busId: 'B003', performance: 'Average', route: 'Route C', avgSpeed: '30 mph', stopsMissed: 2, alerts: 'Medium', uptime: '95%', fuelEfficiency: 'Below Average' },
    { id: 4, busId: 'B004', performance: 'Poor', route: 'Route D', avgSpeed: '25 mph', stopsMissed: 5, alerts: 'High', uptime: '90%', fuelEfficiency: 'Poor' },
    { id: 5, busId: 'B005', performance: 'Good', route: 'Route E', avgSpeed: '40 mph', stopsMissed: 0, alerts: 'None', uptime: '99%', fuelEfficiency: 'Good' },
    // Add more mock data as needed
  ];

  return (
    // Main container for the entire screen. Uses flexbox to arrange sidebar and main content.
    // Stacks vertically on mobile (flex-col), arranges horizontally on medium screens (md:flex-row).
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-inter">
      {/*
        Sidebar Navigation Area
        Contains navigation links similar to Dashboard and other pages.
        The 'Bus Performance Monitor' link is styled to appear active.
      */}
      <aside className="w-full md:w-64 bg-white shadow-md p-4 mb-4 md:mb-0">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">SLGPS</h1>
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/dashboard" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200">
                <span className="mr-2">🏠</span> Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/live-map" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200">
                <span className="mr-2">📍</span> Live Map
              </Link>
            </li>
            <li className="mb-2">
              {/* Bus Performance Monitor Link (Active) - Styles the link to appear active */}
              <Link to="/bus-performance" className="flex items-center p-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200">
                <span className="mr-2">🚌</span> Bus Performance Monitor
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/alerts" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200">
                <span className="mr-2">🚨</span> Alerts
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/schedule-optimizer" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200">
                <span className="mr-2">📅</span> Schedule Optimizer
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/bus-driver-management" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200">
                <span className="mr-2">👥</span> Bus and Driver Management
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/user-management" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200">
                <span className="mr-2">👨‍💼</span> User Management
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/settings" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200">
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
          <h2 className="text-3xl font-semibold text-gray-800 mb-2 sm:mb-0">Bus Performance Monitor</h2>
          {/* Top-right icons - Reduces spacing between icons on mobile */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200"><span className="text-2xl">⚙️</span></button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200"><span className="text-2xl">🔔</span></button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200"><span className="text-2xl">👤</span></button>
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

        {/* Performance Data Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          {/* Added overflow-x-auto to make the table horizontally scrollable on small screens */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Speed</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stops Missed</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alerts</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel Efficiency</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceData.map((bus) => (
                  <tr key={bus.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bus.busId}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        bus.performance === 'Excellent' ? 'text-green-600' :
                        bus.performance === 'Good' ? 'text-blue-600' :
                        bus.performance === 'Average' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                        {bus.performance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.avgSpeed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.stopsMissed}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.alerts}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.uptime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.fuelEfficiency}</td>
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

export default BusPerformanceMonitor;
