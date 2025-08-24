import React, { useState } from "react";
import { Link } from "react-router-dom";

const Settings = () => {
  // Example states for toggles
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [refreshRate, setRefreshRate] = useState("30s");

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
              {/* Active link */}
              <Link
                to="/settings"
                className="flex items-center p-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200"
              >
                <span className="mr-2">⚙️</span> Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-2 sm:mb-0">
            Settings
          </h2>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
              <span className="text-2xl">🔔</span>
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
              <span className="text-2xl">👤</span>
            </button>
          </div>
        </header>

        {/* Settings Sections */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          {/* General Settings */}
          <div>
            <h3 className="text-xl font-semibold mb-4">General</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700">Dark Mode</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {darkMode ? "Enabled" : "Disabled"}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Notifications</h3>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700">Enable Alerts</span>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`px-4 py-2 rounded-md ${
                  notifications
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {notifications ? "On" : "Off"}
              </button>
            </div>
          </div>

          {/* System */}
          <div>
            <h3 className="text-xl font-semibold mb-4">System</h3>
            <label className="block mb-2 text-gray-700">
              Data Refresh Rate
            </label>
            <select
              value={refreshRate}
              onChange={(e) => setRefreshRate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="15s">15 Seconds</option>
              <option value="30s">30 Seconds</option>
              <option value="60s">1 Minute</option>
              <option value="300s">5 Minutes</option>
            </select>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
