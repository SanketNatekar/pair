import React, { useState } from 'react';
import './CreateTournamentModal.css';

const CreateTournamentModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    totalRounds: 5,
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Tournament name is required');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit(formData);
    } catch (error) {
      setError('Failed to create tournament. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalRounds' ? parseInt(value) : value
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Tournament</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Tournament Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter tournament name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalRounds">Total Rounds</label>
            <input
              type="number"
              id="totalRounds"
              name="totalRounds"
              value={formData.totalRounds}
              onChange={handleChange}
              min="1"
              max="20"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter tournament description"
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournamentModal;