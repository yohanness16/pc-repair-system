// import React, { useEffect, useState } from "react";
// import { useData } from "../context/DataContext";
// import { useAuth } from "../context/AuthContext";
// import {
//   Plus,
//   Search,
//   Filter,
//   Edit,
//   Trash2,
//   Monitor,
//   Printer,
//   Laptop,
//   Eye,
//   AlertTriangle,
//   CheckCircle,
//   Clock,
//   Package,
// } from "lucide-react";
// import NewTicketModal from "./NewTicketModal";
// import TicketDetailsModal from "./TicketDetailsModal";
// import { useApiClient } from "../hooks/useApiClient";
// import { getAllEquipments } from "../api/equipmentApi";

// const PCStatus: React.FC = () => {
//   const { updateTicket, deleteTicket } = useData();
//   const [tickets, setTickets] = useState<any>([]);
//   const apiClient = useApiClient();
//   const { user } = useAuth();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [deviceFilter, setDeviceFilter] = useState("all");
//   const [showNewTicket, setShowNewTicket] = useState(false);
//   const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchEquipments = async () => {
//       const allTickets = await getAllEquipments(apiClient);
//       setTickets(allTickets);
//     };
//     fetchEquipments();
//   }, []);

//   const filteredTickets = tickets.filter((ticket) => {
//     const matchesSearch =
//       ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ticket.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       ticket.issueDescription
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       ticket.location.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" || ticket.status === statusFilter;
//     const matchesDevice =
//       deviceFilter === "all" || ticket.deviceType === deviceFilter;

//     return matchesSearch && matchesStatus && matchesDevice;
//   });

//   const getDeviceIcon = (deviceType: string) => {
//     switch (deviceType) {
//       case "pc":
//         return Monitor;
//       case "printer":
//         return Printer;
//       case "laptop":
//         return Laptop;
//       default:
//         return Monitor;
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return CheckCircle;
//       case "in_progress":
//         return Clock;
//       case "pending":
//         return AlertTriangle;
//       case "waiting_parts":
//         return Package;
//       default:
//         return Clock;
//     }
//   };

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

//   const handleStatusUpdate = (ticketId: string, newStatus: string) => {
//     updateTicket(ticketId, { status: newStatus as any });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">
//             PC & Device Status
//           </h2>
//           <p className="text-gray-600">
//             Manage repair tickets and device maintenance
//           </p>
//         </div>
//         <button
//           onClick={() => setShowNewTicket(true)}
//           className="btn-primary flex items-center space-x-2"
//         >
//           <Plus className="w-4 h-4" />
//           <span>New Ticket</span>
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="card p-6">
//         <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search tickets, device IDs, locations..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 input-field"
//               />
//             </div>
//           </div>

//           <div className="flex space-x-4">
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="input-field w-auto"
//             >
//               <option value="all">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="in_progress">In Progress</option>
//               <option value="waiting_parts">Waiting Parts</option>
//               <option value="completed">Completed</option>
//               <option value="cancelled">Cancelled</option>
//             </select>

//             <select
//               value={deviceFilter}
//               onChange={(e) => setDeviceFilter(e.target.value)}
//               className="input-field w-auto"
//             >
//               <option value="all">All Devices</option>
//               <option value="pc">PC</option>
//               <option value="laptop">Laptop</option>
//               <option value="printer">Printer</option>
//               <option value="monitor">Monitor</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Tickets Table */}
//       <div className="card">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Ticket
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Device
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Issue
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Priority
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Assigned
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Updated
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredTickets.map((ticket) => {
//                 const DeviceIcon = getDeviceIcon(ticket.deviceType);
//                 const StatusIcon = getStatusIcon(ticket.status);

//                 return (
//                   <tr key={ticket.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="bg-blue-100 p-2 rounded-lg mr-3">
//                           <DeviceIcon className="w-4 h-4 text-blue-600" />
//                         </div>
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {ticket.ticketNumber}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {ticket.deviceId}
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900 capitalize">
//                         {ticket.deviceType}
//                       </div>
//                       <div className="text-sm text-gray-500 truncate max-w-32">
//                         {ticket.location}
//                       </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900 max-w-xs truncate">
//                         {ticket.issueDescription}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {ticket.department}
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
//                           ticket.status
//                         )}`}
//                       >
//                         <StatusIcon className="w-3 h-3 mr-1" />
//                         {ticket.status.replace("_", " ")}
//                       </div>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
//                           ticket.priority
//                         )}`}
//                       >
//                         {ticket.priority}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {ticket.assignedTo}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(ticket.updatedAt).toLocaleDateString()}
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex items-center justify-end space-x-2">
//                         <button
//                           onClick={() => setSelectedTicket(ticket.id)}
//                           className="text-blue-600 hover:text-blue-900"
//                           title="View Details"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>

//                         {(user?.role === "admin" ||
//                           ticket.assignedTo === user?.username) && (
//                           <>
//                             <select
//                               value={ticket.status}
//                               onChange={(e) =>
//                                 handleStatusUpdate(ticket.id, e.target.value)
//                               }
//                               className="text-xs border-gray-300 rounded px-2 py-1"
//                               title="Update Status"
//                             >
//                               <option value="pending">Pending</option>
//                               <option value="in_progress">In Progress</option>
//                               <option value="waiting_parts">
//                                 Waiting Parts
//                               </option>
//                               <option value="completed">Completed</option>
//                               <option value="cancelled">Cancelled</option>
//                             </select>

//                             {user?.role === "admin" && (
//                               <button
//                                 onClick={() => deleteTicket(ticket.id)}
//                                 className="text-red-600 hover:text-red-900"
//                                 title="Delete Ticket"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {filteredTickets.length === 0 && (
//           <div className="text-center py-12">
//             <Monitor className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-2 text-sm font-medium text-gray-900">
//               No tickets found
//             </h3>
//             <p className="mt-1 text-sm text-gray-500">
//               {searchTerm || statusFilter !== "all" || deviceFilter !== "all"
//                 ? "Try adjusting your search or filter criteria."
//                 : "Get started by creating a new repair ticket."}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Modals */}
//       {showNewTicket && (
//         <NewTicketModal onClose={() => setShowNewTicket(false)} />
//       )}

//       {selectedTicket && (
//         <TicketDetailsModal
//           ticketId={selectedTicket}
//           onClose={() => setSelectedTicket(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default PCStatus;

import React, { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Monitor,
  Printer,
  Laptop,
  Eye,
  CheckCircle,
  Clock,
  HardDrive, // A more generic icon for equipment
  Server, // For Scanner, as an example
} from "lucide-react";
import NewTicketModal from "./NewTicketModal";
import TicketDetailsModal from "./TicketDetailsModal";
import { useApiClient } from "../hooks/useApiClient";
import { getAllEquipments } from "../api/equipmentApi";

// --- STEP 1: Define a TypeScript interface for the backend data ---
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

const PCStatus: React.FC = () => {
  const { updateTicket, deleteTicket } = useData(); // Assuming these functions are updated for the new data structure
  const [tickets, setTickets] = useState<Equipment[]>([]); // Use the Equipment interface
  const apiClient = useApiClient();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null); // ID is a number

  useEffect(() => {
    const fetchEquipments = async () => {
      const allTickets: Equipment[] = await getAllEquipments(apiClient);
      setTickets(allTickets);
      console.log(tickets);
    };
    fetchEquipments();
  }, []);

  // --- STEP 2: Update filtering logic with correct field names ---
  const filteredTickets = tickets.filter((ticket) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      ticket.tag_number.toString().includes(searchLower) ||
      ticket.serial_number.toLowerCase().includes(searchLower) ||
      ticket.remark.toLowerCase().includes(searchLower) ||
      ticket.branch_name.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesDevice =
      deviceFilter === "all" || ticket.item_category === deviceFilter;

    return matchesSearch && matchesStatus && matchesDevice;
  });

  // --- STEP 3: Update helper functions for new data values ---
  const getDeviceIcon = (itemCategory: string) => {
    switch (itemCategory) {
      case "Computer":
        return Monitor;
      case "Printer":
        return Printer;
      case "Laptop":
        return Laptop;
      case "Scanner":
        return Server; // Example icon for Scanner
      default:
        return HardDrive; // A generic fallback icon
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "working":
        return CheckCircle;
      case "maintenance": // Assuming other possible statuses
        return Clock;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "working":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending_creation":
        return "bg-gray-100 text-gray-800";
      case "pending_completion":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      // ... other statuses
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  // The priority field doesn't exist, so getPriorityColor is removed.

  const handleStatusUpdate = (ticketId: number, newStatus: string) => {
    // This function might need adjustment depending on what your update API endpoint expects
    updateTicket(ticketId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header (No changes needed here) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipment Status</h2>
          <p className="text-gray-600">
            Manage equipment and maintenance records
          </p>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Record</span>
        </button>
      </div>

      {/* --- STEP 4: Update filter UI with correct values --- */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by tag, serial number, branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="pending_creation">Pending Creation</option>
              <option value="pending_completion">Pending Completion</option>
              <option value="working">Working</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              {/* ... other options */}
            </select>

            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="input-field w-auto"
            >
              {/* These values should match the 'item_category' field from the backend */}
              <option value="all">All Categories</option>
              <option value="Computer">Computer</option>
              <option value="Laptop">Laptop</option>
              <option value="Printer">Printer</option>
              <option value="Scanner">Scanner</option>
              <option value="Monitor">Monitor</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- STEP 5: Update table to display backend data correctly --- */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Updated table headers */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tag / Serial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category / Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remark
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => {
                const DeviceIcon = getDeviceIcon(ticket.item_category);
                const StatusIcon = getStatusIcon(ticket.status);

                return (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <DeviceIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Tag: {ticket.tag_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            {ticket.serial_number}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {ticket.item_category}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-32">
                        {ticket.branch_name}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {ticket.remark}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {ticket.status_display}
                      </div>
                    </td>

                    {/* 'Priority' column is removed */}

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.added_by_name}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedTicket(ticket.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* This UI may need to be adjusted based on business logic */}
                        {user?.role === "admin" && (
                          <>
                            <button
                              onClick={() => deleteTicket(ticket.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Fallback UI (No changes needed) */}
      </div>

      {showNewTicket && (
        <NewTicketModal onClose={() => setShowNewTicket(false)} />
      )}

      {selectedTicket && (
        <TicketDetailsModal
          ticketId={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
      {/* Modals (No changes needed, assuming they fetch by ID) */}
    </div>
  );
};

export default PCStatus;
