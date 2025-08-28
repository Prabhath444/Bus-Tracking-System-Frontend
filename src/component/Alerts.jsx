import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";

const SortableHeader = ({ children, columnKey, sortConfig, requestSort }) => {
  const isSorted = sortConfig.key === columnKey;
  const arrow = isSorted ? (sortConfig.direction === "ascending" ? " ▲" : " ▼") : "";

  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => requestSort(columnKey)}
    >
      <div className="flex items-center">
        {children}
        <span className="ml-1 text-gray-600">{arrow}</span>
      </div>
    </th>
  );
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "severity", direction: "descending" });
  const menuRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlertDetails, setSelectedAlertDetails] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch("http://bus-tracking-system.test/api/alerts", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const json = await response.json();
      setAlerts(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleDismissClick = async (alertId) => {
    const originalAlerts = [...alerts];

    // Optimistic UI update
    const updatedAlerts = alerts.map(alert =>
      alert.id === alertId ? { ...alert, status: 'Resolved' } : alert
    );
    setAlerts(updatedAlerts);
    setOpenMenuId(null);

    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(`http://bus-tracking-system.test/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: 'Resolved' }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update alert. Server responded with ${response.status}`);
      }
    } catch (err) {
      console.error("Error resolving alert:", err);
      // Revert UI change on failure
      setAlerts(originalAlerts);
      alert("Could not resolve the alert. Please try again.");
    }
  };

  const handleViewClick = (alertId) => {
    const alertToShow = alerts.find((alert) => alert.id === alertId);
    if (alertToShow) {
      setSelectedAlertDetails(alertToShow);
      setIsModalOpen(true);
      setOpenMenuId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlertDetails(null);
  };

  const sortedAlerts = useMemo(() => {
    let sortableItems = [...alerts];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === "severity") {
          const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          const valA = severityOrder[a.severity] || 0;
          const valB = severityOrder[b.severity] || 0;
          if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1;
          if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        }
        if (sortConfig.key === "busId") {
          const valA = a.bus?.plateNumber?.toLowerCase() || '';
          const valB = b.bus?.plateNumber?.toLowerCase() || '';
          if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1;
          if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1;
          return 0;
        }
        const valA = a[sortConfig.key]?.toLowerCase() || '';
        const valB = b[sortConfig.key]?.toLowerCase() || '';
        if (valA < valB) return sortConfig.direction === "ascending" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [alerts, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") direction = "descending";
    setSortConfig({ key, direction });
  };

  const handleMenuToggle = (alertId) => {
    setOpenMenuId(openMenuId === alertId ? null : alertId);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpenMenuId(null);
    };
    if (openMenuId !== null) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-inter">
        <aside className="w-full md:w-64 bg-white shadow-md p-4 mb-4 md:mb-0">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">SLGPS</h1>
          <nav>
            <ul>
              <li className="mb-2"><Link to="/dashboard" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">🏠</span> Dashboard</Link></li>
              <li className="mb-2"><Link to="/live-map" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">📍</span> Live Map</Link></li>
              <li className="mb-2"><Link to="/bus-performance" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">🚌</span> Bus Performance Monitor</Link></li>
              <li className="mb-2"><Link to="/alerts" className="flex items-center p-2 text-blue-700 bg-blue-100 rounded-md"><span className="mr-2">🚨</span> Alerts</Link></li>
              <li className="mb-2"><Link to="/schedule-optimizer" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">📅</span> Schedule Optimizer</Link></li>
              <li className="mb-2"><Link to="/bus-driver-management" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">👥</span> Bus and Driver Management</Link></li>
              <li className="mb-2"><Link to="/user-management" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">👨‍💼</span> User Management</Link></li>
              <li className="mb-2"><Link to="/settings" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">⚙️</span> Setting</Link></li>
            </ul>
          </nav>
        </aside>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2 sm:mb-0">Alerts</h2>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/settings" className="text-gray-500 hover:text-gray-700"><span className="text-2xl">⚙️</span></Link>
              <Link to="/alerts" className="text-gray-500 hover:text-gray-700"><span className="text-2xl">🔔</span></Link>
              <button className="text-gray-500 hover:text-gray-700"><span className="text-2xl">👤</span></button>
            </div>
          </header>

          <div className="flex justify-end space-x-4 mb-6">
            <button onClick={fetchAlerts} disabled={loading} className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <span className={`mr-2 ${loading ? "animate-spin" : ""}`}>🔄</span>
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              {loading && alerts.length === 0 && <div className="text-center p-4">Loading alerts...</div>}
              {error && <div className="text-center p-4 text-red-500">Error: {error}</div>}
              {!loading && !error && alerts.length === 0 && <div className="text-center p-4">No alerts found.</div>}
              {alerts.length > 0 && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <SortableHeader columnKey="type" sortConfig={sortConfig} requestSort={requestSort}>Alert Type</SortableHeader>
                      <SortableHeader columnKey="busId" sortConfig={sortConfig} requestSort={requestSort}>Bus ID</SortableHeader>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <SortableHeader columnKey="severity" sortConfig={sortConfig} requestSort={requestSort}>Severity</SortableHeader>
                      <SortableHeader columnKey="status" sortConfig={sortConfig} requestSort={requestSort}>Status</SortableHeader>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedAlerts.map((alert) => (
                      <tr key={alert.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.bus.plateNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(alert.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${alert.severity === "High" || alert.severity === "Critical" ? "text-red-600" : alert.severity === "Medium" ? "text-yellow-600" : "text-green-600"}`}>{alert.severity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                          <div ref={openMenuId === alert.id ? menuRef : null}>
                            <button onClick={() => handleMenuToggle(alert.id)} className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">⋮</button>
                            {openMenuId === alert.id && (
                              <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                <div className="py-1">
                                  <button onClick={() => handleViewClick(alert.id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><span className="mr-2">👁️</span> View</button>
                                  <button onClick={() => handleDismissClick(alert.id)} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-100"><span className="mr-2">❌</span> Dismiss</button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && selectedAlertDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleCloseModal}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Alert Details</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4"><strong className="text-gray-600">Alert ID:</strong><span className="col-span-2">{selectedAlertDetails.id}</span></div>
              <div className="grid grid-cols-3 gap-4"><strong className="text-gray-600">Type:</strong><span className="col-span-2">{selectedAlertDetails.type}</span></div>
              <div className="grid grid-cols-3 gap-4">
                <strong className="text-gray-600">Severity:</strong>
                <span className={`col-span-2 font-semibold ${selectedAlertDetails.severity === "High" || selectedAlertDetails.severity === "Critical" ? "text-red-600" : selectedAlertDetails.severity === "Medium" ? "text-yellow-600" : "text-green-600"}`}>{selectedAlertDetails.severity}</span>
              </div>
              <div className="grid grid-cols-3 gap-4"><strong className="text-gray-600">Status:</strong><span className="col-span-2">{selectedAlertDetails.status}</span></div>
              <div className="grid grid-cols-3 gap-4">
                <strong className="text-gray-600">Timestamp:</strong>
                <span className="col-span-2">{new Date(selectedAlertDetails.timestamp).toLocaleString('en-LK', { dateStyle: 'long', timeStyle: 'medium' })}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 border-t pt-4 mt-4"><strong className="text-gray-600">Bus Plate No:</strong><span className="col-span-2">{selectedAlertDetails.bus.plateNumber}</span></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Alerts;