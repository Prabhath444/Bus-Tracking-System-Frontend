import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// A reusable card component for the dashboard
const StatCard = ({ title, value, icon, colorClass }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
    <div className={`text-3xl p-3 rounded-full ${colorClass}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-medium text-gray-600">{title}</h3>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the user profile dropdown
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    // No need to set loading to true again on auto-refresh
    if (!dashboardData) setIsLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const endpoint = "http://bus-tracking-system.test/api/dashboard";

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setDashboardData(result.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [dashboardData]);

  useEffect(() => {
    // Load user data from session storage on component mount
    try {
      const userString = sessionStorage.getItem('user');
      if (userString) {
        setCurrentUser(JSON.parse(userString));
      }
    } catch (e) {
      console.error("Failed to parse user data from session storage", e);
    }

    fetchDashboardData();
  }, [fetchDashboardData]);

  // Effect to close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear all session data
    navigate('/');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-inter">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white shadow-md p-4 mb-4 md:mb-0">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">SLGPS</h1>
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/dashboard" className="flex items-center p-2 text-blue-700 bg-blue-100 rounded-md">
                <span className="mr-2">🏠</span> Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/live-map" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md">
                <span className="mr-2">📍</span> Live Map
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/bus-performance" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md">
                <span className="mr-2">🚌</span> Bus Performance Monitor
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/alerts" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md">
                <span className="mr-2">🚨</span> Alerts
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/schedule-optimizer" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md">
                <span className="mr-2">📅</span> Schedule Optimizer
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/bus-driver-management" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md">
                <span className="mr-2">👥</span> Bus and Driver Management
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/user-management" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md">
                <span className="mr-2">👨‍💼</span> User Management
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/settings" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md">
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
            Dashboard Overview
          </h2>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/settings" className="text-gray-500 hover:text-gray-700"><span className="text-2xl">⚙️</span></Link>
            <Link to="/alerts" className="text-gray-500 hover:text-gray-700"><span className="text-2xl">🔔</span></Link>

            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(prev => !prev)} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">👤</span>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg p-4 z-20 border">
                  {currentUser ? (
                    <div>
                      <div className="border-b pb-2 mb-2">
                        <p className="font-semibold text-gray-800">{currentUser.name}</p>
                        <p className="text-sm text-gray-500">{currentUser.email}</p>
                        <p className="text-xs text-gray-400 mt-1">User ID: {currentUser.id}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No user data found.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <StatCard title="Total Buses" value={dashboardData?.totalBuses ?? 0} icon="🚌" colorClass="bg-blue-100 text-blue-600" />
          <StatCard title="Online Buses" value={dashboardData?.onlineBuses ?? 0} icon="📡" colorClass="bg-green-100 text-green-600" />
          <StatCard title="Active Alerts" value={dashboardData?.activeAlerts ?? 0} icon="🚨" colorClass="bg-red-100 text-red-600" />
          <StatCard title="Total Drivers" value={dashboardData?.totalDrivers ?? 0} icon="👥" colorClass="bg-yellow-100 text-yellow-600" />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;