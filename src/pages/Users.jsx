import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Users.css';
import { Users as UsersIcon, UserPlus, Shield, Mail, Trash2, ShieldAlert, UserCheck, ShieldCheck } from 'lucide-react';

const API_URL = 'http://localhost:8080/LifelineJavaBackend/api/users';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
  const [suspendId, setSuspendId] = useState(null);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleSearch = (e) => {
      const query = e.detail.toLowerCase();
      const filtered = users.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    };

    window.addEventListener('userSearch', handleSearch);
    return () => window.removeEventListener('userSearch', handleSearch);
  }, [users]);

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
        const updatedUsers = [res.data, ...users];
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      }
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmSuspend = async () => {
    if (suspendId) {
      await axios.patch(`${API_URL}/${suspendId}/suspend`);
      const updated = users.map(u => u.email === suspendId ? { ...u, is_suspended: !u.is_suspended } : u);
      setUsers(updated);
      setFilteredUsers(updated);
      setSuspendId(null);
    }
  };

  const deleteUser = async () => {
    await axios.delete(`${API_URL}/${deleteId}`);
    const updated = users.filter(user => user.email !== deleteId);
    setUsers(updated);
    setFilteredUsers(updated);
    setDeleteId(null);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '', role: 'emergencyservice' });
    setShowForm(false);
    setEditMode(false);
  };

  return (
    <div className="users-container">
      <div className="users-header-row">
        <div className="header-title">
            <UsersIcon size={28} className="header-icon" />
            <h2>User Management</h2>
        </div>
        <button className="add-user-btn" onClick={() => setShowForm(true)}>
          <UserPlus size={18} />
          <span>Register User</span>
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <>
          <div className="form-overlay" onClick={resetForm}></div>
          <div className="add-user-form-modal">
            <h3>{editMode ? 'Update User' : 'Add New User'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                    <UsersIcon size={18} className="input-icon" />
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                    <Mail size={18} className="input-icon" />
                    <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="input-with-icon">
                    <Shield size={18} className="input-icon" />
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
              </div>
              <div className="form-group">
                <label>System Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="emergencyservice">Emergency Service Staff</option>
                  <option value="admin">Platform Administrator</option>
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-btn">{editMode ? 'Update' : 'Create Account'}</button>
                <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}

      <div className="table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th><div className="th-flex"><UsersIcon size={16} /> <span>User Details</span></div></th>
              <th><div className="th-flex"><Mail size={16} /> <span>Email</span></div></th>
              <th><div className="th-flex"><ShieldCheck size={16} /> <span>Account Status</span></div></th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.email}>
                <td className="user-td">
                    <div className="user-info">
                        <strong>{user.name}</strong>
                    </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge ${user.is_suspended ? 'status-suspended' : 'status-active'}`}>
                    {user.is_suspended ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td className="actions-td">
                  <button
                    className={`action-btn ${user.is_suspended ? 'activate' : 'suspend'}`}
                    onClick={() => setSuspendId(user.email)}
                    title={user.is_suspended ? 'Restore Access' : 'Restrict Access'}
                  >
                    {user.is_suspended ? <UserCheck size={16} /> : <ShieldAlert size={16} />}
                    <span>{user.is_suspended ? 'Activate' : 'Suspend'}</span>
                  </button>
                  <button className="action-btn delete" onClick={() => setDeleteId(user.email)} title="Delete Permanently">
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-box">
             <div className="warning-icon"><ShieldAlert size={48} color="#ef4444" /></div>
            <p>Delete this user profile permanenly?</p>
            <div className="confirm-btns">
              <button className="confirm-yes" onClick={deleteUser}>Delete Profile</button>
              <button className="confirm-no" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation */}
      {suspendId && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-box">
             <div className="warning-icon"><Shield size={48} color="#f59e0b" /></div>
            <p>Update this user's account access status?</p>
            <div className="confirm-btns">
              <button className="confirm-yes" style={{backgroundColor: '#10b981'}} onClick={confirmSuspend}>Change Status</button>
              <button className="confirm-no" onClick={() => setSuspendId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;