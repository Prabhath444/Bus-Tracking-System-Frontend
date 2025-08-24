// src/component/ScheduleOptimizer.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// --- Reusable Modal Component ---
// This component now handles both Add and Edit modes.
const AddScheduleModal = ({ isOpen, onClose, onSaveSuccess, scheduleToEdit }) => {
  const isEditMode = Boolean(scheduleToEdit);

  // State for form input values
  const [formData, setFormData] = useState({
    day: 'Monday',
    route_id: '',
    bus_id: '',
    driver_id: '',
    departure_time: '',
    arrival_time: '',
  });

  // State for the form's dropdown options
  const [formOptions, setFormOptions] = useState({ buses: [], drivers: [], routes: [] });
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  // State for submission process
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch dropdown data and populate form for editing
  useEffect(() => {
    if (isOpen) {
      const fetchOptions = async () => {
        setIsLoadingOptions(true);
        setSubmitError(null);
        const token = sessionStorage.getItem("authToken");

        if (!token) {
          setSubmitError("Authentication token not found. Please log in.");
          setIsLoadingOptions(false);
          return;
        }

        try {
          const response = await fetch("http://bus-tracking-system.test/api/schedule-options", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to load form options. Status: ${response.status}`);
          }

          const data = await response.json();
          setFormOptions({
            buses: data.buses || [],
            drivers: data.drivers || [],
            routes: data.routes || [],
          });

          // If in Edit Mode, pre-fill the form with the schedule data.
          // Otherwise, set default values for Add Mode.
          if (isEditMode) {
            setFormData({
              day: scheduleToEdit.day,
              route_id: scheduleToEdit.route.id,
              bus_id: scheduleToEdit.bus.id,
              driver_id: scheduleToEdit.driver.id,
              // FIX: Format time to HH:mm by removing the seconds
              departure_time: scheduleToEdit.departureTime.substring(0, 5),
              arrival_time: scheduleToEdit.arrivalTime.substring(0, 5),
            });
          } else {
            setFormData({
              day: 'Monday',
              route_id: data.routes?.[0]?.id || '',
              bus_id: data.buses?.[0]?.id || '',
              driver_id: data.drivers?.[0]?.id || '',
              departure_time: '',
              arrival_time: '',
            });
          }
        } catch (err) {
          setSubmitError(err.message);
        } finally {
          setIsLoadingOptions(false);
        }
      };

      fetchOptions();
    }
  }, [isOpen, scheduleToEdit, isEditMode]);

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    const token = sessionStorage.getItem("authToken");

    // Determine the URL and method based on whether we are adding or editing
    const url = isEditMode
      ? `http://bus-tracking-system.test/api/schedules/${scheduleToEdit.id}`
      : "http://bus-tracking-system.test/api/schedules";

    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `An error occurred: ${response.status}`);
      }

      onSaveSuccess();

    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6 md:p-8 relative" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? 'Edit Schedule' : 'Add New Schedule'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl font-light" aria-label="Close modal">&times;</button>
        </div>

        {isLoadingOptions ? (
          <div className="text-center p-8">Loading form options...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Day of the Week */}
              <div>
                <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">Day of the Week</label>
                <select id="day" name="day" value={formData.day} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>

              {/* Route */}
              <div>
                <label htmlFor="route_id" className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <select id="route_id" name="route_id" value={formData.route_id} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  {formOptions.routes.map(route => <option key={route.id} value={route.id}>{route.route_name}</option>)}
                </select>
              </div>

              {/* Departure Time */}
              <div>
                <label htmlFor="departure_time" className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                <input type="time" id="departure_time" name="departure_time" value={formData.departure_time} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>

              {/* Arrival Time */}
              <div>
                <label htmlFor="arrival_time" className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                <input type="time" id="arrival_time" name="arrival_time" value={formData.arrival_time} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>

              {/* Bus */}
              <div className="md:col-span-1">
                <label htmlFor="bus_id" className="block text-sm font-medium text-gray-700 mb-1">Bus (Plate Number)</label>
                <select id="bus_id" name="bus_id" value={formData.bus_id} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  {formOptions.buses.map(bus => <option key={bus.id} value={bus.id}>{bus.plate_number}</option>)}
                </select>
              </div>

              {/* Driver */}
              <div className="md:col-span-1">
                <label htmlFor="driver_id" className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                <select id="driver_id" name="driver_id" value={formData.driver_id} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  {formOptions.drivers.map(driver => <option key={driver.id} value={driver.id}>{driver.name}</option>)}
                </select>
              </div>
            </div>

            {submitError && (
              <div className="mt-4 text-center p-2 bg-red-100 text-red-700 rounded-md">
                {submitError}
              </div>
            )}

            <div className="flex justify-end items-center border-t pt-6 mt-8 space-x-4">
              <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed">
                {isSubmitting ? 'Saving...' : 'Save Schedule'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


// --- Main ScheduleOptimizer Component ---
const ScheduleOptimizer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  // State to hold the schedule being edited
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      setError(null);
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://bus-tracking-system.test/api/schedules", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

        const data = await response.json();
        const groupedByDay = data.data.reduce((acc, schedule) => {
          const day = schedule.day;
          if (!acc[day]) acc[day] = [];
          acc[day].push(schedule);
          return acc;
        }, {});
        setSchedules(groupedByDay);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [refetchTrigger]);

  // Function to open the modal for adding a new schedule
  const handleAddClick = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  // Function to open the modal for editing an existing schedule
  const handleEditClick = (schedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    setRefetchTrigger(prev => prev + 1);
  };

  const renderTableContent = () => {
    if (isLoading) return <div className="text-center p-8">Loading schedules...</div>;
    if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;
    if (Object.keys(schedules).length === 0) return <div className="text-center p-8">No schedules available.</div>;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="align-middle whitespace-nowrap">
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Route</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Departure Time</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Arrival Time</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Bus (Plate No.)</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(schedules).map(([day, daySchedules]) => (
              <React.Fragment key={day}>
                <tr>
                  <td colSpan="6" className="px-4 py-2 bg-gray-100 text-sm font-bold text-gray-700">{day}</td>
                </tr>
                {daySchedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.route.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.departureTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.arrivalTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.bus.plateNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.driver.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEditClick(schedule)} className="text-teal-600 hover:text-teal-900">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-inter">
        {/* Sidebar */}
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
                <Link to="/bus-performance" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200">
                  <span className="mr-2">🚌</span> Bus Performance Monitor
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/alerts" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md transition-colors duration-200">
                  <span className="mr-2">🚨</span> Alerts
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/schedule-optimizer" className="flex items-center p-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors duration-200">
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

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2 sm:mb-0">
              Schedule Optimizer
            </h2>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200"><span className="text-2xl">⚙️</span></button>
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200"><span className="text-2xl">🔔</span></button>
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200"><span className="text-2xl">👤</span></button>
            </div>
          </header>

          {/* Control Buttons */}
          <div className="flex justify-end space-x-4 mb-6">
            <button
              onClick={handleAddClick}
              className="flex items-center px-4 py-2 bg-green-200 text-green-800 rounded-md hover:bg-green-300 transition-colors duration-200"
            >
              <span className="mr-2">➕</span> Add Schedule
            </button>
            <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200">
              <span className="mr-2">⬇️</span> Export
            </button>
            <button
              onClick={() => setRefetchTrigger(prev => prev + 1)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
            >
              <span className="mr-2">🔄</span> Refresh
            </button>
          </div>

          {/* Schedule Table */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {renderTableContent()}
          </div>
        </div>
      </div>

      {/* Render the Modal Form */}
      <AddScheduleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSaveSuccess={handleSaveSuccess}
        scheduleToEdit={editingSchedule}
      />
    </>
  );
};

export default ScheduleOptimizer;
