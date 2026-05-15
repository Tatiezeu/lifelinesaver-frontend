import React from 'react';
import { FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <FaExclamationTriangle className="modal-warn-icon" />
          <h3>{title || 'Confirm Deletion'}</h3>
        </div>
        <div className="modal-body">
          <p>{message || 'Are you sure you want to delete this permanently? This action cannot be undone.'}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn modal-confirm" onClick={onConfirm}>
            <FaTrash size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
