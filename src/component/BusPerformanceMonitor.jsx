// src/component/BusPerformanceMonitor.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * BusPerformanceMonitor Component
 * This component displays bus performance data with filtering and export options.
 * It includes a sidebar for navigation and a header with user-related icons.
 * The layout is designed to be responsive across different screen sizes.
 */
const BusPerformanceMonitor = () => {
  // State for performance reports, loading status, and errors
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchPerformanceReports = async () => {
      setIsLoading(true);
      setError(null);
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://bus-tracking-system.test/api/performance-reports", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setReports(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceReports();
  }, []); // Empty array ensures this runs only once on component mount

  const renderTableContent = () => {
    if (isLoading) {
      return <div className="text-center p-8">Loading performance reports...</div>;
    }

    if (error) {
      return <div className="text-center p-8 text-red-600">Error: {error}</div>;
    }

    if (reports.length === 0) {
      return <div className="text-center p-8">No performance reports available.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus (Plate Number)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Speed (kph)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stops Missed</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alerts Raised</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.bus.plateNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reportDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.averageSpeed}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.stopsMissed}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.alertsRaised}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.uptimePercent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
            <Link to="/settings" className="text-gray-500 hover:text-gray-700"><span className="text-2xl">⚙️</span></Link>
            <Link to="/alerts" className="text-gray-500 hover:text-gray-700"><span className="text-2xl">🔔</span></Link>
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
          {renderTableContent()}
        </div>
      </div>
    </div>
  );
};

export default BusPerformanceMonitor;
