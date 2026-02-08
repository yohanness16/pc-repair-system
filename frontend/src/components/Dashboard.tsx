// import React, { useEffect, useState } from "react";
// import { useData } from "../context/DataContext";
// import { useAuth } from "../context/AuthContext";
// import {
//   Monitor,
//   AlertTriangle,
//   CheckCircle,
//   Clock,
//   DollarSign,
//   TrendingUp,
//   Plus,
//   Activity,
// } from "lucide-react";
// import { useApiClient } from "../hooks/useApiClient";
// import { getAllEquipments } from "../api/equipmentApi";

// interface DashboardProps {
//   onPageChange: (page: string) => void;
// }

// const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
//   const { getDashboardStats } = useData();
//   const [tickets, setTickets] = useState<any>([]);
//   const { user } = useAuth();
//   const apiClient = useApiClient();
//   const stats = getDashboardStats();

//   useEffect(() => {
//     const fetchAllEquipments = async () => {
//       const equipments = await getAllEquipments(apiClient);
//       setTickets(equipments);
//     };
//     fetchAllEquipments();
//   }, []);

//   const recentTickets = tickets.slice(0, 5);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-800";
//       case "in_progress":
//         return "bg-blue-100 text-blue-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "waiting_parts":
//         return "bg-orange-100 text-orange-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case "critical":
//         return "bg-red-100 text-red-800";
//       case "high":
//         return "bg-orange-100 text-orange-800";
//       case "medium":
//         return "bg-yellow-100 text-yellow-800";
//       case "low":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section */}
//       <div className="card p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               Welcome back, {user?.username}!
//             </h2>
//             <p className="text-gray-600">
//               Here's an overview of your IT repair operations
//             </p>
//           </div>
//           <div className="bg-blue-600 p-3 rounded-full">
//             <Activity className="w-8 h-8 text-white" />
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <div className="card p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Total Devices</p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {stats.totalDevices}
//               </p>
//               <p className="text-sm text-green-600 mt-1">Bank-wide inventory</p>
//             </div>
//             <div className="bg-blue-100 p-3 rounded-full">
//               <Monitor className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="card p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">
//                 Active Tickets
//               </p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {stats.activeTickets}
//               </p>
//               <p className="text-sm text-orange-600 mt-1">Need attention</p>
//             </div>
//             <div className="bg-orange-100 p-3 rounded-full">
//               <AlertTriangle className="w-6 h-6 text-orange-600" />
//             </div>
//           </div>
//         </div>

//         <div className="card p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">
//                 Completed This Week
//               </p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {stats.completedThisWeek}
//               </p>
//               <p className="text-sm text-green-600 mt-1">Great progress!</p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-full">
//               <CheckCircle className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </div>

//         <div className="card p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">
//                 Avg Resolution Time
//               </p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {stats.avgResolutionTime}d
//               </p>
//               <p className="text-sm text-blue-600 mt-1">Within target</p>
//             </div>
//             <div className="bg-blue-100 p-3 rounded-full">
//               <Clock className="w-6 h-6 text-blue-600" />
//             </div>
//           </div>
//         </div>

//         <div className="card p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">
//                 Cost This Month
//               </p>
//               <p className="text-3xl font-bold text-gray-900">
//                 ${stats.costThisMonth}
//               </p>
//               <p className="text-sm text-gray-600 mt-1">Budget tracking</p>
//             </div>
//             <div className="bg-purple-100 p-3 rounded-full">
//               <DollarSign className="w-6 h-6 text-purple-600" />
//             </div>
//           </div>
//         </div>

//         <div className="card p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-gray-600">
//                 Team Efficiency
//               </p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {stats.efficiency}%
//               </p>
//               <p className="text-sm text-green-600 mt-1">Above target</p>
//             </div>
//             <div className="bg-green-100 p-3 rounded-full">
//               <TrendingUp className="w-6 h-6 text-green-600" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="card p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//           Quick Actions
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <button
//             onClick={() => onPageChange("pc-status")}
//             className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
//           >
//             <Plus className="w-5 h-5 text-blue-600" />
//             <span className="font-medium text-blue-700">New Repair Ticket</span>
//           </button>
//           <button
//             onClick={() => onPageChange("pc-status")}
//             className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
//           >
//             <Monitor className="w-5 h-5 text-green-600" />
//             <span className="font-medium text-green-700">View All Devices</span>
//           </button>
//           <button
//             onClick={() => onPageChange("reports")}
//             className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
//           >
//             <TrendingUp className="w-5 h-5 text-purple-600" />
//             <span className="font-medium text-purple-700">View Reports</span>
//           </button>
//         </div>
//       </div>

//       {/* Recent Tickets */}
//       <div className="card p-6">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-semibold text-gray-900">
//             Recent Tickets
//           </h3>
//           <button
//             onClick={() => onPageChange("pc-status")}
//             className="text-blue-600 hover:text-blue-700 font-medium"
//           >
//             View All
//           </button>
//         </div>

//         <div className="space-y-4">
//           {recentTickets.map((ticket) => (
//             <div
//               key={ticket.id}
//               className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <span className="font-medium text-gray-900">
//                       {ticket.ticketNumber}
//                     </span>
//                     <span
//                       className={`status-badge ${getStatusColor(
//                         ticket.status
//                       )}`}
//                     >
//                       {ticket.status.replace("_", " ")}
//                     </span>
//                     <span
//                       className={`status-badge ${getPriorityColor(
//                         ticket.priority
//                       )}`}
//                     >
//                       {ticket.priority}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-600 mb-2">
//                     {ticket.issueDescription}
//                   </p>
//                   <div className="flex items-center space-x-4 text-xs text-gray-500">
//                     <span>
//                       {ticket.deviceType.toUpperCase()} - {ticket.deviceId}
//                     </span>
//                     <span>{ticket.location}</span>
//                     <span>Assigned to: {ticket.assignedTo}</span>
//                   </div>
//                 </div>
//                 <div className="text-right text-sm text-gray-500">
//                   <p>{new Date(ticket.updatedAt).toLocaleDateString()}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Monitor,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Activity,
  Server, // Icon for server/scanner
  MapPin, // Icon for branches
} from "lucide-react";
import { useApiClient } from "../hooks/useApiClient";
import { getAllEquipments } from "../api/equipmentApi";

// --- STEP 1: Define an interface for the backend data ---
interface Equipment {
  id: number;
  branch_name: string;
  added_by_name: string;
  status_display: string;
  tag_number: number;
  serial_number: string;
  item_category: string;
  status: string;
  remark: string;
  created_at: string;
  branch: number;
  added_by: number;
}

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const { user } = useAuth();
  const apiClient = useApiClient();

  useEffect(() => {
    const fetchAllEquipments = async () => {
      try {
        const allEquipments: Equipment[] = await getAllEquipments(apiClient);
        setEquipments(allEquipments);
      } catch (error) {
        console.error("Failed to fetch equipments:", error);
      }
    };
    fetchAllEquipments();
  }, [apiClient]);

  // --- STEP 2: Calculate stats directly from the fetched data ---
  const stats = {
    totalDevices: equipments.length,
    // Count unique branch names to get the number of active branches
    branchesServed: new Set(equipments.map((e) => e.branch_name)).size,
    // Example stat: count how many items are 'Scanners'
    scannerCount: equipments.filter((e) => e.item_category === "Scanner")
      .length,
    // Example stat: count how many are 'Computers'
    computerCount: equipments.filter((e) => e.item_category === "Computer")
      .length,
  };

  // Sort by most recent and take the top 5
  const recentEquipments = [...equipments]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  // --- STEP 3: Update helper functions for the new data structure ---
  const getStatusColor = (status: string) => {
    // This function now handles the statuses from your backend
    switch (status.toLowerCase()) {
      case "working":
        return "bg-green-100 text-green-800";
      case "maintenance": // Assuming other possible statuses
        return "bg-yellow-100 text-yellow-800";
      case "broken":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // The `getPriorityColor` function is no longer needed and has been removed.

  return (
    <div className="space-y-6">
      {/* Welcome Section (No changes needed) */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username}!
            </h2>
            <p className="text-gray-600">
              Here's an overview of your IT equipment inventory.
            </p>
          </div>
          <div className="bg-blue-600 p-3 rounded-full">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* --- STEP 4: Update Stats Grid with newly calculated stats --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Equipment
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalDevices}
              </p>
              <p className="text-sm text-green-600 mt-1">Bank-wide inventory</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Branches Served
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.branchesServed}
              </p>
              <p className="text-sm text-orange-600 mt-1">
                Across all locations
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Computers
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.computerCount}
              </p>
              <p className="text-sm text-blue-600 mt-1">PC and Laptop units</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Scanners
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.scannerCount}
              </p>
              <p className="text-sm text-green-600 mt-1">Active units</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (No changes needed) */}
      <div className="card p-6">{/* ... content ... */}</div>

      {/* --- STEP 5: Update Recent Equipment list with correct data fields --- */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Recently Added Equipment
          </h3>
          <button
            onClick={() => onPageChange("pc-status")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {recentEquipments.length > 0 ? (
            recentEquipments.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        Tag: {item.tag_number}
                      </span>
                      <span
                        className={`status-badge capitalize ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status_display}
                      </span>
                      {/* Priority badge has been removed as it doesn't exist in the data */}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.remark}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>
                        {item.item_category.toUpperCase()} - S/N:{" "}
                        {item.serial_number}
                      </span>
                      <span>Branch: {item.branch_name}</span>
                      <span>Added by: {item.added_by_name}</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Created on</p>
                    <p>{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No recent equipment found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
