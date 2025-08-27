import React from 'react';
import { useData } from '../context/DataContext';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  Monitor,
  Printer,
  Laptop,
  Smartphone
} from 'lucide-react';

const WeeklyReports: React.FC = () => {
  const { getWeeklyReports } = useData();
  const reports = getWeeklyReports();

  const currentWeekReport = reports[0];

  const deviceIcons = {
    pc: Monitor,
    printer: Printer,
    laptop: Laptop,
    monitor: Smartphone
  };

  const getCompletionRate = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getStatusColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Weekly Reports</h2>
        <p className="text-gray-600">Performance analytics and operational insights</p>
      </div>

      {/* Current Week Overview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Week Overview</h3>
            <p className="text-sm text-gray-500">{currentWeekReport.week}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-50 p-4 rounded-lg mb-2">
              <AlertTriangle className="w-8 h-8 text-blue-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentWeekReport.totalTickets}</p>
            <p className="text-sm text-gray-600">Total Tickets</p>
          </div>

          <div className="text-center">
            <div className="bg-green-50 p-4 rounded-lg mb-2">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentWeekReport.completedTickets}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>

          <div className="text-center">
            <div className="bg-yellow-50 p-4 rounded-lg mb-2">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{currentWeekReport.avgResolutionTime}d</p>
            <p className="text-sm text-gray-600">Avg Resolution</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-50 p-4 rounded-lg mb-2">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto" />
            </div>
            <p className="text-2xl font-bold text-gray-900">${currentWeekReport.costSaved}</p>
            <p className="text-sm text-gray-600">Cost Saved</p>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Rate */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Completion Rate
          </h3>
          
          <div className="space-y-4">
            {reports.map((report, index) => {
              const completionRate = getCompletionRate(report.completedTickets, report.totalTickets);
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{report.week}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${completionRate}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${getStatusColor(completionRate)}`}>
                      {completionRate}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Monitor className="w-5 h-5 mr-2 text-blue-600" />
            Device Breakdown
          </h3>
          
          <div className="space-y-4">
            {Object.entries(currentWeekReport.deviceBreakdown).map(([device, count]) => {
              const DeviceIcon = deviceIcons[device as keyof typeof deviceIcons];
              const percentage = Math.round((count / currentWeekReport.totalTickets) * 100);
              
              return (
                <div key={device} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <DeviceIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700 capitalize">{device}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Historical Data */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Historical Performance</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Week
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Resolution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost Saved
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report, index) => {
                const completionRate = getCompletionRate(report.completedTickets, report.totalTickets);
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.week}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.totalTickets}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.completedTickets}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getStatusColor(completionRate)}`}>
                        {completionRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.avgResolutionTime} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${report.costSaved.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Performance Trend</h4>
            <p className="text-blue-800 text-sm">
              Completion rate improved by 12% compared to last week, with faster resolution times across all device types.
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Cost Efficiency</h4>
            <p className="text-green-800 text-sm">
              In-house repairs saved ${currentWeekReport.costSaved} this week compared to external service costs.
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Common Issues</h4>
            <p className="text-yellow-800 text-sm">
              PC hardware failures account for 42% of tickets. Consider preventive maintenance schedule.
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Team Performance</h4>
            <p className="text-purple-800 text-sm">
              Average resolution time decreased to {currentWeekReport.avgResolutionTime} days, meeting SLA targets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReports;