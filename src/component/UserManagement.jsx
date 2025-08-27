import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [selectedUser, setSelectedUser] = useState(null); // For View
  const [userToEdit, setUserToEdit] = useState(null); // For Edit
  const [userToDelete, setUserToDelete] = useState(null); // For Delete

  // State for forms and their loading status
  const initialNewUserState = { name: '', email: '', password: '', password_confirmation: '', role: 'User', status: 'Active' };
  const [newUser, setNewUser] = useState(initialNewUserState);
  const [editFormData, setEditFormData] = useState({ role: '', status: '' });

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch("http://bus-tracking-system.test/api/users", {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const json = await response.json();
      setUsers(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Modal & Form Handlers ---

  const handleOpenAddModal = () => {
    setNewUser(initialNewUserState);
    setIsAddModalOpen(true);
  };
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleViewClick = (user) => setSelectedUser(user);
  const handleCloseViewModal = () => setSelectedUser(null);

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditFormData({ role: user.role, status: user.status });
  };
  const handleCloseEditModal = () => setUserToEdit(null);

  const handleDeleteClick = (user) => setUserToDelete(user);
  const handleCloseDeleteModal = () => setUserToDelete(null);

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- API Handlers ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (newUser.password !== newUser.password_confirmation) {
      alert("Passwords do not match.");
      return;
    }
    setIsCreating(true);
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(`http://bus-tracking-system.test/api/users`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || `Failed to create user. Server responded with ${response.status}`);
      }

      handleCloseAddModal();
      fetchUsers();
    } catch (err) {
      console.error("Create error:", err);
      alert(`Failed to create user: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!userToEdit) return;
    setIsUpdating(true);
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(`http://bus-tracking-system.test/api/users/${userToEdit.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) throw new Error(`Failed to update user. Server responded with ${response.status}`);

      setUsers(users.map(user => user.id === userToEdit.id ? { ...user, ...editFormData } : user));
      handleCloseEditModal();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update user. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) throw new Error("Authentication token not found.");

      const response = await fetch(`http://bus-tracking-system.test/api/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Failed to delete user. Server responded with ${response.status}`);

      setUsers(users.filter(user => user.id !== userToDelete.id));
      handleCloseDeleteModal();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
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
              <li className="mb-2"><Link to="/bus-performance" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">🚌</span> Bus Performance</Link></li>
              <li className="mb-2"><Link to="/alerts" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">🚨</span> Alerts</Link></li>
              <li className="mb-2"><Link to="/schedule-optimizer" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">📅</span> Schedule Optimizer</Link></li>
              <li className="mb-2"><Link to="/bus-driver-management" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">👥</span> Bus and Driver</Link></li>
              <li className="mb-2"><Link to="/user-management" className="flex items-center p-2 text-blue-700 bg-blue-100 rounded-md"><span className="mr-2">👨‍💼</span> User Management</Link></li>
              <li className="mb-2"><Link to="/settings" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded-md"><span className="mr-2">⚙️</span> Setting</Link></li>
            </ul>
          </nav>
        </aside>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2 sm:mb-0">User Management</h2>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="text-gray-500 hover:text-gray-700"><span className="text-2xl">⚙️</span></button>
              <button className="text-gray-500 hover:text-gray-700"><span className="text-2xl">🔔</span></button>
              <button className="text-gray-500 hover:text-gray-700"><span className="text-2xl">👤</span></button>
            </div>
          </header>

          <div className="flex justify-end space-x-4 mb-6">
            <button onClick={handleOpenAddModal} className="flex items-center px-4 py-2 bg-green-200 text-green-800 rounded-md hover:bg-green-300 transition-colors duration-200">
              <span className="mr-2">➕</span> Add User
            </button>
            <button onClick={fetchUsers} disabled={loading} className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <span className={`mr-2 ${loading ? 'animate-spin' : ''}`}>🔄</span>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              {loading && <div className="text-center p-4">Loading users...</div>}
              {error && <div className="text-center p-4 text-red-500">Error: {error}</div>}
              {!loading && !error && (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${user.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>{user.status}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button onClick={() => handleViewClick(user)} className="text-teal-600 hover:text-teal-900">View</button>
                          <span className="text-gray-300"> • </span>
                          <button onClick={() => handleEditClick(user)} className="text-teal-600 hover:text-teal-900">Edit</button>
                          <span className="text-gray-300"> • </span>
                          <button onClick={() => handleDeleteClick(user)} className="text-red-600 hover:text-red-900">Delete</button>
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

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleCloseAddModal}>
          <form onSubmit={handleCreateUser} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-3 mb-4"><h3 className="text-xl font-semibold">Add New User</h3><button type="button" onClick={handleCloseAddModal} className="text-2xl">&times;</button></div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700">Name</label><input type="text" name="name" value={newUser.name} onChange={handleAddFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" name="email" value={newUser.email} onChange={handleAddFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Password</label><input type="password" name="password" value={newUser.password} onChange={handleAddFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Confirm Password</label><input type="password" name="password_confirmation" value={newUser.password_confirmation} onChange={handleAddFormChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" /></div>
              <div><label className="block text-sm font-medium text-gray-700">Role</label><select name="role" value={newUser.role} onChange={handleAddFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"><option>Admin</option><option>Manager</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700">Status</label><select name="status" value={newUser.status} onChange={handleAddFormChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"><option>Active</option><option>Suspended</option></select></div>
            </div>
            <div className="flex justify-end space-x-4 mt-6 border-t pt-4">
              <button type="button" onClick={handleCloseAddModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
              <button type="submit" disabled={isCreating} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400">
                {isCreating ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleCloseViewModal}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-3 mb-4"><h3 className="text-xl font-semibold">User Details</h3><button onClick={handleCloseViewModal} className="text-2xl">&times;</button></div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4"><strong>User ID:</strong><span className="col-span-2">{selectedUser.id}</span></div>
              <div className="grid grid-cols-3 gap-4"><strong>Name:</strong><span className="col-span-2">{selectedUser.name}</span></div>
              <div className="grid grid-cols-3 gap-4"><strong>Email:</strong><span className="col-span-2">{selectedUser.email}</span></div>
              <div className="grid grid-cols-3 gap-4"><strong>Role:</strong><span className="col-span-2">{selectedUser.role}</span></div>
              <div className="grid grid-cols-3 gap-4"><strong>Status:</strong><span className={`col-span-2 font-semibold ${selectedUser.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>{selectedUser.status}</span></div>
              <div className="grid grid-cols-3 gap-4 border-t pt-4 mt-4"><strong>Created At:</strong><span className="col-span-2">{new Date(selectedUser.createdAt).toLocaleString('en-LK')}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {userToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleCloseEditModal}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-3 mb-4"><h3 className="text-xl font-semibold">Edit User: {userToEdit.name}</h3><button onClick={handleCloseEditModal} className="text-2xl">&times;</button></div>
            <div className="space-y-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <select id="role" name="role" value={editFormData.role} onChange={handleEditFormChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md">
                  <option>Admin</option>
                  <option>User</option>
                  <option>Manager</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select id="status" name="status" value={editFormData.status} onChange={handleEditFormChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md">
                  <option>Active</option>
                  <option>Suspended</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6 border-t pt-4">
              <button onClick={handleCloseEditModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={handleUpdateUser} disabled={isUpdating} className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-teal-400">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleCloseDeleteModal}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete the user <strong className="font-semibold">{userToDelete.name}</strong>? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4 mt-6">
              <button onClick={handleCloseDeleteModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={handleConfirmDelete} disabled={isDeleting} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400">
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserManagement;