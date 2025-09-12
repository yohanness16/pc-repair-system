import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Monitor, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Plus,
  Activity
} from 'lucide-react';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const { getDashboardStats, tickets } = useData();
  const { user } = useAuth();
  const stats = getDashboardStats();

  const recentTickets = tickets.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'waiting_parts':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username}!
            </h2>
            <p className="text-gray-600">
              Here's an overview of your IT repair operations
            </p>
          </div>
          <div className="bg-blue-600 p-3 rounded-full">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Devices</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalDevices}</p>
              <p className="text-sm text-green-600 mt-1">Bank-wide inventory</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tickets</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeTickets}</p>
              <p className="text-sm text-orange-600 mt-1">Need attention</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed This Week</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completedThisWeek}</p>
              <p className="text-sm text-green-600 mt-1">Great progress!</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
              <p className="text-3xl font-bold text-gray-900">{stats.avgResolutionTime}d</p>
              <p className="text-sm text-blue-600 mt-1">Within target</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost This Month</p>
              <p className="text-3xl font-bold text-gray-900">${stats.costThisMonth}</p>
              <p className="text-sm text-gray-600 mt-1">Budget tracking</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Efficiency</p>
              <p className="text-3xl font-bold text-gray-900">{stats.efficiency}%</p>
              <p className="text-sm text-green-600 mt-1">Above target</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onPageChange('pc-status')}
            className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-700">New Repair Ticket</span>
          </button>
          <button
            onClick={() => onPageChange('pc-status')}
            className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
          >
            <Monitor className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-700">View All Devices</span>
          </button>
          <button
            onClick={() => onPageChange('reports')}
            className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
          >
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-700">View Reports</span>
          </button>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tickets</h3>
          <button
            onClick={() => onPageChange('pc-status')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentTickets.map((ticket) => (
            <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">{ticket.ticketNumber}</span>
                    <span className={`status-badge ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className={`status-badge ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{ticket.issueDescription}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{ticket.deviceType.toUpperCase()} - {ticket.deviceId}</span>
                    <span>{ticket.location}</span>
                    <span>Assigned to: {ticket.assignedTo}</span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{new Date(ticket.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;