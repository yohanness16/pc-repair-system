import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { X, AlertCircle, Loader2 } from 'lucide-react';

interface NewTicketModalProps {
  onClose: () => void;
}

const NewTicketModal: React.FC<NewTicketModalProps> = ({ onClose }) => {
  const { addTicket } = useData();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    deviceType: 'pc' as 'pc' | 'printer' | 'laptop' | 'monitor',
    deviceId: '',
    location: '',
    department: '',
    issueDescription: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    reportedBy: '',
    estimatedCost: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const departments = [
    'STAFF 1',
    'STAFF 2',
    'STAFF 3',
    'STAFF 4',
    'STAFF 5',
    'STAFF 6',
    'STAFF 7',
    'STAFF 8',
    'STAFF 9',
    'STAFF 10'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.deviceId.trim()) {
      newErrors.deviceId = 'Device ID is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    if (!formData.issueDescription.trim()) {
      newErrors.issueDescription = 'Issue description is required';
    }
    if (!formData.reportedBy.trim()) {
      newErrors.reportedBy = 'Reporter name is required';
    }
    if (formData.estimatedCost && isNaN(Number(formData.estimatedCost))) {
      newErrors.estimatedCost = 'Please enter a valid cost';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      addTicket({
        deviceType: formData.deviceType,
        deviceId: formData.deviceId.trim(),
        location: formData.location.trim(),
        department: formData.department,
        issueDescription: formData.issueDescription.trim(),
        priority: formData.priority,
        status: 'pending',
        assignedTo: user?.username || 'unassigned',
        reportedBy: formData.reportedBy.trim(),
        estimatedCost: formData.estimatedCost ? Number(formData.estimatedCost) : undefined,
        notes: []
      });

      onClose();
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Repair Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device Type *
              </label>
              <select
                value={formData.deviceType}
                onChange={(e) => handleChange('deviceType', e.target.value)}
                className="input-field"
                disabled={isSubmitting}
              >
                <option value="pc">Desktop PC</option>
                <option value="laptop">Laptop</option>
                <option value="printer">Printer</option>
                <option value="monitor">Monitor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Device ID *
              </label>
              <input
                type="text"
                value={formData.deviceId}
                onChange={(e) => handleChange('deviceId', e.target.value)}
                placeholder="e.g., PC-BRANCH-001"
                className={`input-field ${errors.deviceId ? 'border-red-300' : ''}`}
                disabled={isSubmitting}
              />
              {errors.deviceId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.deviceId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Main Branch - Teller Station 1"
                className={`input-field ${errors.location ? 'border-red-300' : ''}`}
                disabled={isSubmitting}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.location}
                </p>
              )}
            </div>

            <div>
              {user?.role === 'admin' && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repairing staff *
                </label>
              )}
              <select
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className={`input-field ${errors.department ? 'border-red-300' : ''}`}
                disabled={isSubmitting}
              >
                <option value="">Select staff member</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.department}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                className="input-field"
                disabled={isSubmitting}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reported By *
              </label>
              <input
                type="text"
                value={formData.reportedBy}
                onChange={(e) => handleChange('reportedBy', e.target.value)}
                placeholder="Employee name"
                className={`input-field ${errors.reportedBy ? 'border-red-300' : ''}`}
                disabled={isSubmitting}
              />
              {errors.reportedBy && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.reportedBy}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Description *
            </label>
            <textarea
              value={formData.issueDescription}
              onChange={(e) => handleChange('issueDescription', e.target.value)}
              rows={4}
              placeholder="Describe the issue in detail..."
              className={`input-field ${errors.issueDescription ? 'border-red-300' : ''}`}
              disabled={isSubmitting}
            />
            {errors.issueDescription && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.issueDescription}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Cost (BIRR)
            </label>
            <input
              type="number"
              value={formData.estimatedCost}
              onChange={(e) => handleChange('estimatedCost', e.target.value)}
              placeholder="Optional - estimated repair cost"
              min="0"
              step="0.01"
              className={`input-field ${errors.estimatedCost ? 'border-red-300' : ''}`}
              disabled={isSubmitting}
            />
            {errors.estimatedCost && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.estimatedCost}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Ticket</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTicketModal;