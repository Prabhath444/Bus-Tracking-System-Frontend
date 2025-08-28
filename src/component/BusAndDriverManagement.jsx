import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

// --- Reusable Components ---

const Modal = ({ children, onClose, size = 'lg' }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
    <div className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-${size}`} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

const SortableHeader = ({ children, columnKey, sortConfig, requestSort }) => {
  const isSorted = sortConfig.key === columnKey;
  const arrow = isSorted ? (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼') : '';
  return (
    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort(columnKey)}>
      <div className="flex items-center">
        {children}
        <span className="ml-1">{arrow}</span>
      </div>
    </th>
  );
};

// --- Table Components ---

const BusTable = ({ data, onEdit, onDelete, sortConfig, requestSort }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <SortableHeader columnKey="plateNumber" sortConfig={sortConfig} requestSort={requestSort}>Plate Number</SortableHeader>
        <SortableHeader columnKey="model" sortConfig={sortConfig} requestSort={requestSort}>Model</SortableHeader>
        <SortableHeader columnKey="status" sortConfig={sortConfig} requestSort={requestSort}>Status</SortableHeader>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((bus) => (
        <tr key={bus.id}>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{bus.plateNumber}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bus.model}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bus.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {bus.status}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
            <button onClick={() => onEdit(bus)} className="text-teal-600 hover:text-teal-900">Edit</button>
            <span className="text-gray-300">•</span>
            <button onClick={() => onDelete(bus)} className="text-red-600 hover:text-red-900">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const DriverTable = ({ data, onEdit, onDelete, sortConfig, requestSort }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <SortableHeader columnKey="name" sortConfig={sortConfig} requestSort={requestSort}>Name</SortableHeader>
        <SortableHeader columnKey="email" sortConfig={sortConfig} requestSort={requestSort}>Email</SortableHeader>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {data.map((driver) => (
        <tr key={driver.id}>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{driver.name}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.email}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.phone}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
            <button onClick={() => onEdit(driver)} className="text-teal-600 hover:text-teal-900">Edit</button>
            <span className="text-gray-300">•</span>
            <button onClick={() => onDelete(driver)} className="text-red-600 hover:text-red-900">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// --- Add/Edit Form Modal ---

const BusDriverFormModal = ({ modalState, formData, onFormChange, onClose, onSubmit, isSubmitting, allBuses }) => {
  const isEdit = modalState.type.startsWith('edit');
  const isBus = modalState.type.endsWith('bus');
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (isEdit && !isBus) {
      const assignedBus = allBuses.find(b => b.id === formData.assignedBusId);
      if (assignedBus) setSearchTerm(assignedBus.plateNumber);
    }
  }, [isEdit, isBus, allBuses, formData.assignedBusId]);

  const handleBusSelect = (bus) => {
    setSearchTerm(bus.plateNumber);
    onFormChange({ target: { name: 'assignedBusId', value: bus.id } });
    setShowResults(false);
  };

  const searchResults = searchTerm && !isBus
    ? allBuses.filter(b => b.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const title = `${isEdit ? 'Edit' : 'Add'} ${isBus ? 'Bus' : 'Driver'}`;

  return (
    <Modal onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div className="space-y-4">
          {isBus ? (
            <>
              <div><label className="block text-sm font-medium">Plate Number</label><input type="text" name="plateNumber" value={formData.plateNumber || ''} onChange={onFormChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required /></div>
              <div><label className="block text-sm font-medium">Model</label><input type="text" name="model" value={formData.model || ''} onChange={onFormChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required /></div>
              <div><label className="block text-sm font-medium">Status</label><select name="status" value={formData.status || 'Active'} onChange={onFormChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2"><option>Active</option><option>Inactive</option><option>Maintenance</option></select></div>
            </>
          ) : (
            <>
              <div><label className="block text-sm font-medium">Name</label><input type="text" name="name" value={formData.name || ''} onChange={onFormChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required /></div>
              <div><label className="block text-sm font-medium">Email</label><input type="email" name="email" value={formData.email || ''} onChange={onFormChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required /></div>
              <div><label className="block text-sm font-medium">Phone</label><input type="text" name="phone" value={formData.phone || ''} onChange={onFormChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" required /></div>
              <div className="relative">
                <label className="block text-sm font-medium">Assign Bus (Optional)</label>
                <input type="text" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); }} placeholder="Search by Plate Number..." className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                {showResults && searchResults.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
                    {searchResults.map(bus => <li key={bus.id} onClick={() => handleBusSelect(bus)} className="p-2 hover:bg-gray-100 cursor-pointer">{bus.plateNumber}</li>)}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-teal-400">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// --- Main Component ---

const BusAndDriverManagement = () => {
  const [activeView, setActiveView] = useState("buses");
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalState, setModalState] = useState({ type: null, data: null });
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const API_BASE_URL = "http://bus-tracking-system.test/api";

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" };

      const [busResponse, driverResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/buses`, { headers }),
        fetch(`${API_BASE_URL}/drivers`, { headers }),
      ]);

      if (!busResponse.ok) throw new Error(`Failed to fetch buses: ${busResponse.status}`);
      if (!driverResponse.ok) throw new Error(`Failed to fetch drivers: ${driverResponse.status}`);

      const busJson = await busResponse.json();
      const driverJson = await driverResponse.json();

      setBuses(busJson.data);
      setDrivers(driverJson.data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedBuses = useMemo(() => {
    let sortableItems = [...buses];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [buses, sortConfig]);

  const sortedDrivers = useMemo(() => {
    let sortableItems = [...drivers];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [drivers, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleOpenModal = (type, data) => {
    setModalState({ type, data });
    setFormData(data);
  };

  const handleCloseModal = () => {
    setModalState({ type: null, data: null });
    setFormData(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { type, data } = modalState;
    const isEdit = type.startsWith('edit');
    const isBus = type.endsWith('bus');

    const method = isEdit ? 'PUT' : 'POST';
    let endpoint = isBus ? '/buses' : '/drivers';
    if (isEdit) {
      endpoint += `/${data.id}`;
    }

    let payload = {};
    if (isBus) {
      payload = { plate_number: formData.plateNumber, model: formData.model, status: formData.status };
    } else {
      payload = { name: formData.name, email: formData.email, phone: formData.phone, assigned_bus_id: formData.assignedBusId || null };
    }

    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        const errorMessages = errData.errors ? Object.values(errData.errors).join(' ') : (errData.message || `Failed to save data.`);
        throw new Error(errorMessages);
      }

      handleCloseModal();
      fetchData();
    } catch (err) {
      console.error(`Submit error:`, err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const { type, data } = modalState;
    const isBus = type.includes('bus');
    const endpoint = isBus ? `/buses/${data.id}` : `/drivers/${data.id}`;

    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });

      if (!response.ok) throw new Error(`Failed to delete.`);

      if (isBus) {
        setBuses(buses.filter(b => b.id !== data.id));
      } else {
        setDrivers(drivers.filter(d => d.id !== data.id));
      }
      handleCloseModal();
    } catch (err) {
      console.error(`Delete error:`, err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <li className="mb-2"><Link to="/alerts" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">🚨</span> Alerts</Link></li>
              <li className="mb-2"><Link to="/schedule-optimizer" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">📅</span> Schedule Optimizer</Link></li>
              <li className="mb-2"><Link to="/bus-driver-management" className="flex items-center p-2 text-blue-700 bg-blue-100 rounded-md"><span className="mr-2">👥</span> Bus and Driver Management</Link></li>
              <li className="mb-2"><Link to="/user-management" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">👨‍💼</span> User Management</Link></li>
              <li className="mb-2"><Link to="/settings" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">⚙️</span> Setting</Link></li>
            </ul>
          </nav>
        </aside>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2 sm:mb-0">
              {activeView === 'buses' ? 'Bus Management' : 'Driver Management'}
            </h2>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="text-gray-500 hover:text-gray-700"><span className="text-2xl">⚙️</span></button>
              <button className="text-gray-500 hover:text-gray-700"><span className="text-2xl">🔔</span></button>
              <button className="text-gray-500 hover:text-gray-700"><span className="text-2xl">👤</span></button>
            </div>
          </header>

          <div className="flex justify-between items-center mb-6">
            <div className="flex bg-gray-200 rounded-md p-1 space-x-1">
              <button onClick={() => setActiveView("buses")} className={`px-4 py-1 text-sm font-semibold rounded-md ${activeView === 'buses' ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-gray-600'}`}>Buses</button>
              <button onClick={() => setActiveView("drivers")} className={`px-4 py-1 text-sm font-semibold rounded-md ${activeView === 'drivers' ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-gray-600'}`}>Drivers</button>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => handleOpenModal(activeView === 'buses' ? 'add-bus' : 'add-driver', activeView === 'buses' ? { plateNumber: '', model: '', status: 'Active' } : { name: '', email: '', phone: '', assignedBusId: null })} className="flex items-center px-4 py-2 bg-green-200 text-green-800 rounded-md hover:bg-green-300"><span className="mr-2">➕</span> Add New</button>
              <button onClick={fetchData} disabled={loading || isSubmitting} className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50">
                <span className={`mr-2 ${loading ? "animate-spin" : ""}`}>🔄</span>
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              {loading && <div className="text-center p-8">Loading data...</div>}
              {error && <div className="text-center p-8 text-red-500">Error: {error}</div>}
              {!loading && !error && (
                activeView === 'buses'
                  ? <BusTable data={sortedBuses} sortConfig={sortConfig} requestSort={requestSort} onEdit={(bus) => handleOpenModal('edit-bus', bus)} onDelete={(bus) => handleOpenModal('delete-bus', bus)} />
                  : <DriverTable data={sortedDrivers} sortConfig={sortConfig} requestSort={requestSort} onEdit={(driver) => handleOpenModal('edit-driver', driver)} onDelete={(driver) => handleOpenModal('delete-driver', driver)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {modalState.type?.startsWith('add-') || modalState.type?.startsWith('edit-') ? (
        <BusDriverFormModal
          modalState={modalState}
          formData={formData}
          onFormChange={handleFormChange}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          allBuses={buses}
        />
      ) : null}

      {modalState.type?.startsWith('delete-') && (
        <Modal onClose={handleCloseModal} size="md">
          <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
          <p>Are you sure you want to delete <strong className="font-semibold">{modalState.data.plateNumber || modalState.data.name}</strong>? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
            <button type="button" onClick={handleDelete} disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400">
              {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default BusAndDriverManagement;