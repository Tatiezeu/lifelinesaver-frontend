import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Users.css';

const API_URL = 'http://127.0.0.1:8000/api/users/';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'emergencyservice',
  });
  const [deleteId, setDeleteId] = useState(null);
  const [suspendId, setSuspendId] = useState(null); // NEW: track which user to suspend

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editMode) {
        const res = await axios.post(API_URL, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        setUsers([res.data, ...users]);
      }
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmSuspend = async () => {
    if (suspendId) {
      await axios.patch(`${API_URL}${suspendId}/suspend/`);
      setUsers(users.map(u => u.id === suspendId ? { ...u, is_suspended: !u.is_suspended } : u));
      setSuspendId(null);
    }
  };

  const deleteUser = async () => {
    await axios.delete(`${API_URL}${deleteId}/delete_user/`);
    setUsers(users.filter(user => user.id !== deleteId));
    setDeleteId(null);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'emergencyservice' });
    setShowForm(false);
    setEditMode(false);
  };

  return (
    <div className="users-container">
      <h2>Manage Users</h2>

      <button className="add-user-btn" onClick={() => setShowForm(true)}>
        Add User
      </button>

      {/* Modal Form */}
      {showForm && (
        <>
          <div className="form-overlay" onClick={resetForm}></div>
          <div className="add-user-form-modal">
            <h3>{editMode ? 'Update User' : 'Add New User'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="emergencyservice">Emergency Service</option>
                <option value="admin">Admin</option>
              </select>
              <div className="form-buttons">
                <button type="submit" className="submit-btn">{editMode ? 'Update User' : 'Add User'}</button>
                <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}

      <table className="users-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td className={user.is_suspended ? 'status-suspended' : 'status-active'}>
                {user.is_suspended ? 'suspended' : 'active'}
              </td>
              <td>
                <button
                  className={user.is_suspended ? 'status-btn activate' : 'status-btn suspend'}
                  onClick={() => setSuspendId(user.id)} // open confirm modal
                >
                  {user.is_suspended ? 'Activate' : 'Suspend'}
                </button>
                <button className="delete-btn" onClick={() => setDeleteId(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-box">
            <p>Confirm delete?</p>
            <div className="confirm-buttons">
              <button className="confirm-yes" onClick={deleteUser}>Yes</button>
              <button className="confirm-no" onClick={() => setDeleteId(null)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation */}
      {suspendId && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-box">
            <p>Confirm suspend?</p>
            <div className="confirm-buttons">
              <button className="confirm-yes" onClick={confirmSuspend}>Yes</button>
              <button className="confirm-no" onClick={() => setSuspendId(null)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;