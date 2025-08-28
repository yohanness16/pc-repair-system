import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Monitor, 
  Printer, 
  Laptop, 
  MapPin, 
  User, 
  Calendar, 
  DollarSign,
  MessageSquare,
  Plus,
  Clock
} from 'lucide-react';

interface TicketDetailsModalProps {
  ticketId: string;
  onClose: () => void;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ ticketId, onClose }) => {
  const { tickets, updateTicket } = useData();
  const { user } = useAuth();
  const [newNote, setNewNote] = useState('');
  
  const ticket = tickets.find(t => t.id === ticketId);

  if (!ticket) {
    return null;
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'pc':
        return Monitor;
      case 'printer':
        return Printer;
      case 'laptop':
        return Laptop;
      default:
        return Monitor;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'waiting_parts':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const timestamp = new Date().toLocaleString();
    const noteWithUser = `[${timestamp}] ${user?.username}: ${newNote.trim()}`;
    
    updateTicket(ticket.id, {
      notes: [...ticket.notes, noteWithUser]
    });
    
    setNewNote('');
  };

  const handleStatusUpdate = (newStatus: string) => {
    updateTicket(ticket.id, { 
      status: newStatus as any,
      ...(newStatus === 'completed' ? { completedAt: new Date().toISOString() } : {})
    });
  };

  const DeviceIcon = getDeviceIcon(ticket.deviceType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <DeviceIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{ticket.ticketNumber}</h2>
              <p className="text-sm text-gray-500">{ticket.deviceId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority} priority
              </span>
            </div>
            
            {(user?.role === 'admin' || ticket.assignedTo === user?.username) && (
              <select
                value={ticket.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting_parts">Waiting Parts</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )}
          </div>

          {/* Device Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Monitor className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="font-medium">Type:</span>
                  <span className="ml-2 capitalize">{ticket.deviceType}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{ticket.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="font-medium">Department:</span>
                  <span className="ml-2">{ticket.department}</span>
                </div>
              </div>
            </div>

            <div className="card p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Details</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="font-medium">Reported by:</span>
                  <span className="ml-2">{ticket.reportedBy}</span>
                </div>
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="font-medium">Assigned to:</span>
                  <span className="ml-2">{ticket.assignedTo}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="font-medium">Created:</span>
                  <span className="ml-2">{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
                {ticket.completedAt && (
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium">Completed:</span>
                    <span className="ml-2">{new Date(ticket.completedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Issue Description</h3>
            <p className="text-gray-700 leading-relaxed">{ticket.issueDescription}</p>
          </div>

          {/* Cost Information */}
          {(ticket.estimatedCost || ticket.actualCost) && (
            <div className="card p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ticket.estimatedCost && (
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium">Estimated:</span>
                    <span className="ml-2">${ticket.estimatedCost.toFixed(2)}</span>
                  </div>
                )}
                {ticket.actualCost && (
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="font-medium">Actual:</span>
                    <span className="ml-2">${ticket.actualCost.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Notes & Updates
              </h3>
            </div>

            {/* Existing Notes */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {ticket.notes.length > 0 ? (
                ticket.notes.map((note, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p className="text-gray-700 whitespace-pre-wrap">{note}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm italic">No notes added yet.</p>
              )}
            </div>

            {/* Add New Note */}
            {(user?.role === 'admin' || ticket.assignedTo === user?.username) && (
              <div className="border-t pt-4">
                <div className="flex space-x-3">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note or update..."
                    rows={2}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="btn-primary px-4 py-2 text-sm flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;