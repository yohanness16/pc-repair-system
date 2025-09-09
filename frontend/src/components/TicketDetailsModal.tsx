// import React, { useState } from 'react';
// import { useData } from '../context/DataContext';
// import { useAuth } from '../context/AuthContext';
// import {
//   X,
//   Monitor,
//   Printer,
//   Laptop,
//   MapPin,
//   User,
//   Calendar,
//   DollarSign,
//   MessageSquare,
//   Plus,
//   Clock
// } from 'lucide-react';

// interface TicketDetailsModalProps {
//   ticketId: string;
//   onClose: () => void;
// }

// const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ ticketId, onClose }) => {
//   const { tickets, updateTicket } = useData();
//   const { user } = useAuth();
//   const [newNote, setNewNote] = useState('');

//   const ticket = tickets.find(t => t.id === ticketId);

//   if (!ticket) {
//     return null;
//   }

//   const getDeviceIcon = (deviceType: string) => {
//     switch (deviceType) {
//       case 'pc':
//         return Monitor;
//       case 'printer':
//         return Printer;
//       case 'laptop':
//         return Laptop;
//       default:
//         return Monitor;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'completed':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'in_progress':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'waiting_parts':
//         return 'bg-orange-100 text-orange-800 border-orange-200';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800 border-red-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'critical':
//         return 'bg-red-100 text-red-800 border-red-200';
//       case 'high':
//         return 'bg-orange-100 text-orange-800 border-orange-200';
//       case 'medium':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'low':
//         return 'bg-green-100 text-green-800 border-green-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const handleAddNote = () => {
//     if (!newNote.trim()) return;

//     const timestamp = new Date().toLocaleString();
//     const noteWithUser = `[${timestamp}] ${user?.username}: ${newNote.trim()}`;

//     updateTicket(ticket.id, {
//       notes: [...ticket.notes, noteWithUser]
//     });

//     setNewNote('');
//   };

//   const handleStatusUpdate = (newStatus: string) => {
//     updateTicket(ticket.id, {
//       status: newStatus as any,
//       ...(newStatus === 'completed' ? { completedAt: new Date().toISOString() } : {})
//     });
//   };

//   const DeviceIcon = getDeviceIcon(ticket.deviceType);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b border-gray-200">
//           <div className="flex items-center space-x-3">
//             <div className="bg-blue-100 p-2 rounded-lg">
//               <DeviceIcon className="w-6 h-6 text-blue-600" />
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold text-gray-900">{ticket.ticketNumber}</h2>
//               <p className="text-sm text-gray-500">{ticket.deviceId}</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <div className="p-6 space-y-6">
//           {/* Status and Priority */}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
//                 {ticket.status.replace('_', ' ')}
//               </span>
//               <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(ticket.priority)}`}>
//                 {ticket.priority} priority
//               </span>
//             </div>

//             {(user?.role === 'admin' || ticket.assignedTo === user?.username) && (
//               <select
//                 value={ticket.status}
//                 onChange={(e) => handleStatusUpdate(e.target.value)}
//                 className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="in_progress">In Progress</option>
//                 <option value="waiting_parts">Waiting Parts</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             )}
//           </div>

//           {/* Device Information */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="card p-4">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Information</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center text-sm">
//                   <Monitor className="w-4 h-4 text-gray-500 mr-2" />
//                   <span className="font-medium">Type:</span>
//                   <span className="ml-2 capitalize">{ticket.deviceType}</span>
//                 </div>
//                 <div className="flex items-center text-sm">
//                   <MapPin className="w-4 h-4 text-gray-500 mr-2" />
//                   <span className="font-medium">Location:</span>
//                   <span className="ml-2">{ticket.location}</span>
//                 </div>
//                 <div className="flex items-center text-sm">
//                   <User className="w-4 h-4 text-gray-500 mr-2" />
//                   <span className="font-medium">Department:</span>
//                   <span className="ml-2">{ticket.department}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="card p-4">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Details</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center text-sm">
//                   <User className="w-4 h-4 text-gray-500 mr-2" />
//                   <span className="font-medium">Reported by:</span>
//                   <span className="ml-2">{ticket.reportedBy}</span>
//                 </div>
//                 <div className="flex items-center text-sm">
//                   <User className="w-4 h-4 text-gray-500 mr-2" />
//                   <span className="font-medium">Assigned to:</span>
//                   <span className="ml-2">{ticket.assignedTo}</span>
//                 </div>
//                 <div className="flex items-center text-sm">
//                   <Calendar className="w-4 h-4 text-gray-500 mr-2" />
//                   <span className="font-medium">Created:</span>
//                   <span className="ml-2">{new Date(ticket.createdAt).toLocaleString()}</span>
//                 </div>
//                 {ticket.completedAt && (
//                   <div className="flex items-center text-sm">
//                     <Clock className="w-4 h-4 text-gray-500 mr-2" />
//                     <span className="font-medium">Completed:</span>
//                     <span className="ml-2">{new Date(ticket.completedAt).toLocaleString()}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Issue Description */}
//           <div className="card p-4">
//             <h3 className="text-lg font-semibold text-gray-900 mb-3">Issue Description</h3>
//             <p className="text-gray-700 leading-relaxed">{ticket.issueDescription}</p>
//           </div>

//           {/* Cost Information */}
//           {(ticket.estimatedCost || ticket.actualCost) && (
//             <div className="card p-4">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Information</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {ticket.estimatedCost && (
//                   <div className="flex items-center">
//                     <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
//                     <span className="font-medium">Estimated:</span>
//                     <span className="ml-2">${ticket.estimatedCost.toFixed(2)}</span>
//                   </div>
//                 )}
//                 {ticket.actualCost && (
//                   <div className="flex items-center">
//                     <DollarSign className="w-4 h-4 text-gray-500 mr-2" />
//                     <span className="font-medium">Actual:</span>
//                     <span className="ml-2">${ticket.actualCost.toFixed(2)}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Notes Section */}
//           <div className="card p-4">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900 flex items-center">
//                 <MessageSquare className="w-5 h-5 mr-2" />
//                 Notes & Updates
//               </h3>
//             </div>

//             {/* Existing Notes */}
//             <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
//               {ticket.notes.length > 0 ? (
//                 ticket.notes.map((note, index) => (
//                   <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
//                     <p className="text-gray-700 whitespace-pre-wrap">{note}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-sm italic">No notes added yet.</p>
//               )}
//             </div>

//             {/* Add New Note */}
//             {(user?.role === 'admin' || ticket.assignedTo === user?.username) && (
//               <div className="border-t pt-4">
//                 <div className="flex space-x-3">
//                   <textarea
//                     value={newNote}
//                     onChange={(e) => setNewNote(e.target.value)}
//                     placeholder="Add a note or update..."
//                     rows={2}
//                     className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   <button
//                     onClick={handleAddNote}
//                     disabled={!newNote.trim()}
//                     className="btn-primary px-4 py-2 text-sm flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <Plus className="w-4 h-4" />
//                     <span>Add</span>
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex justify-end p-6 border-t border-gray-200">
//           <button
//             onClick={onClose}
//             className="btn-secondary"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TicketDetailsModal;

import React, { useEffect, useState } from "react";
import {
  X,
  Loader2,
  AlertCircle,
  Hash,
  Server,
  MapPin,
  MessageSquare,
  User,
  Calendar,
  CheckCircle,
  Activity,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import { useApiClient } from "../hooks/useApiClient";
import { useAuth } from "../context/AuthContext";
import {
  getEquipmentById,
  approveOrRejectCreation,
  requestRepairCompletion,
  approveOrRejectCompletion,
} from "../api/equipmentApi";
import { updateEquipmentStatus } from "../api/repairApi";

// Re-using the Equipment interface for type safety
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

interface TicketDetailsModalProps {
  ticketId: number; // The ID of the equipment to fetch
  requestId?: number;
  onClose: () => void;
  onUpdate: () => void;
}

type Part = {
  part_id: string;
  quantity: string;
};

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  ticketId,
  onClose,
  onUpdate,
}) => {
  const [ticket, setTicket] = useState<Equipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiClient = useApiClient();
  const { user } = useAuth();

  const [rejectionReason, setRejectionReason] = useState("");
  const [reportData, setReportData] = useState({ report: "", remark: "" });
  const [parts, setParts] = useState<Part[]>([{ part_id: "", quantity: "" }]);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateData, setUpdateData] = useState({
    status: "",
    report: "",
    remark: "",
  });

  useEffect(() => {
    // Define an async function to fetch the data
    const fetchTicketDetails = async () => {
      if (!ticketId) return;

      setLoading(true);
      setError(null);

      try {
        // --- This is where you call your API function ---
        const data = await getEquipmentById(apiClient, ticketId);
        setTicket(data);
      } catch (err) {
        console.error("Failed to fetch ticket details:", err);
        setError("Could not load the equipment details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, []); // Re-run effect if ticketId changes

  const handleReportChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreationApproval = async (isApproved: boolean) => {
    setIsProcessing(true);
    setError(null);
    try {
      await approveOrRejectCreation(
        apiClient,
        ticketId,
        isApproved ? "approved" : "rejected",
        isApproved ? null : rejectionReason
      );
      onUpdate();
    } catch (err) {
      setError("Failed to process creation request.");
    } finally {
      setIsProcessing(false);
    }
  };

  // STAFF: Action to Request Completion
  const handleRequestCompletion = async () => {
    setIsProcessing(true);
    setError(null);
    const payload = {
      ...reportData,
      parts: parts
        .filter((p) => p.part_id && p.quantity)
        .map((p) => ({
          part_id: parseInt(p.part_id),
          quantity: parseInt(p.quantity),
        })),
    };
    try {
      await updateEquipmentStatus(apiClient, ticketId, payload);
      onUpdate();
    } catch (err) {
      setError("Failed to submit completion request.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ADMIN: Action for Completion Approval
  const handleCompletionApproval = async (isApproved: boolean) => {
    setIsProcessing(true);
    setError(null);
    try {
      await approveOrRejectCompletion(
        apiClient,
        ticketId,
        isApproved,
        isApproved ? null : rejectionReason
      );
      onUpdate();
    } catch (err) {
      setError("Failed to process completion request.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePartChange = (
    index: number,
    field: keyof Part,
    value: string
  ) => {
    const newParts = [...parts];
    newParts[index][field] = value;
    setParts(newParts);
  };

  const addPart = () => {
    setParts([...parts, { part_id: "", quantity: "" }]);
  };

  const removePart = (index: number) => {
    const newParts = parts.filter((_, i) => i !== index);
    setParts(newParts);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  // --- REFACTORED: Handler for submitting the update ---
  const handleSubmitUpdate = async () => {
    if (!ticket || !updateData.status) {
      setUpdateError("A status must be selected.");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    // --- Prepare the payload for the backend ---
    const payload = {
      ...updateData,
      // Filter out empty parts and convert strings to integers
      parts: parts
        .filter((p) => p.part_id && p.quantity)
        .map((p) => ({
          part_id: parseInt(p.part_id, 10),
          quantity: parseInt(p.quantity, 10),
        })),
    };

    try {
      const updatedTicket = await updateEquipmentStatus(
        apiClient,
        ticket.id,
        payload
      );
      setTicket(updatedTicket); // Refresh modal view
      onUpdate(); // Refresh the main list and close modal
    } catch (err) {
      console.error("Failed to submit update:", err);
      setUpdateError("An error occurred. Could not submit the update.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- RENDER LOGIC ---
  const isOwner = user?.username === ticket?.added_by_name;
  const isAdmin = user?.role === "admin";
  const isPendingApproval = ticket?.status.startsWith("pending_"); // e.g., 'pending_disposal'

  // Helper component for displaying detail items
  // const DetailItem: React.FC<{
  //   icon: React.ElementType;
  //   label: string;
  //   value: React.ReactNode;
  // }> = ({ icon: Icon, label, value }) => (
  //   <div>
  //     <dt className="flex items-center text-sm font-medium text-gray-500">
  //       <Icon className="w-4 h-4 mr-2 text-gray-400" />
  //       <span>{label}</span>
  //     </dt>
  //     <dd className="mt-1 text-md text-gray-900 font-semibold">
  //       {value || "N/A"}
  //     </dd>
  //   </div>
  // );
  const renderActionArea = () => {
    // ADMIN: Approve/Reject a new equipment request
    if (isAdmin) {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Creation Approval</h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Add rejection reason (if rejecting)"
            className="input-field"
          />
          <div className="flex space-x-4">
            <button
              onClick={() => handleCreationApproval(true)}
              disabled={isProcessing}
              className="btn-primary"
            >
              Approve
            </button>
            <button
              onClick={() => handleCreationApproval(false)}
              disabled={isProcessing || !rejectionReason}
              className="btn-danger"
            >
              Reject
            </button>
          </div>
        </div>
      );
    }

    // STAFF: Submit a repair report for a 'working' item
    if (
      !isAdmin &&
      ticket?.added_by === user?.id &&
      ticket?.status === "under_repair"
    ) {
      return (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Submit Repair for Approval
          </h3>

          {/* Report */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Report *
            </label>
            <textarea
              name="report"
              value={reportData.report}
              onChange={handleReportChange}
              rows={4}
              className="input-field"
              placeholder="Describe the work that was done..."
            />
          </div>

          {/* Parts Used */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Parts Used
            </label>
            <div className="space-y-3">
              {parts.map((part, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Part ID"
                    value={part.part_id}
                    onChange={(e) =>
                      handlePartChange(index, "part_id", e.target.value)
                    }
                    className="input-field w-full"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={part.quantity}
                    onChange={(e) =>
                      handlePartChange(index, "quantity", e.target.value)
                    }
                    className="input-field w-1/4"
                    min="1"
                  />
                  <button
                    onClick={() => removePart(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addPart}
              className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Part
            </button>
          </div>

          {/* Remark */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Remark
            </label>
            <textarea
              name="remark"
              value={reportData.remark}
              onChange={handleReportChange}
              rows={2}
              className="input-field"
              placeholder="Optional notes..."
            />
          </div>

          <button
            onClick={handleRequestCompletion}
            disabled={isProcessing}
            className="btn-primary w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...
              </>
            ) : (
              "Request Completion"
            )}
          </button>
        </div>
      );
    }

    // ADMIN: Approve/Reject a completed repair
    if (isAdmin && ticket?.status == "need_repair") {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Completion Approval</h3>
          {/* Display the staff's report, parts, and remark here for the admin to review */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>
              <strong>Staff Report:</strong> {ticket?.report || "N/A"}
            </p>
            {/* You might need to display parts here too */}
          </div>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Add rejection reason (if rejecting)"
            className="input-field"
          />
          <div className="flex space-x-4">
            <button
              onClick={() => handleCompletionApproval(true)}
              disabled={isProcessing}
              className="btn-primary"
            >
              Approve Completion
            </button>
            <button
              onClick={() => handleCompletionApproval(false)}
              disabled={isProcessing || !rejectionReason}
              className="btn-danger"
            >
              Reject Completion
            </button>
          </div>
        </div>
      );
    }

    // Default: No actions available
    return (
      <p className="text-sm text-gray-500">
        No actions available for this item's current status.
      </p>
    );
  };

  return (
    <div className="fixed inset-0 ...">
      <div className="bg-white rounded-xl ...">
        {/* ... Modal Header and Details Display ... */}

        {/* --- The Dynamic Action Area --- */}
        {!loading && ticket && (
          <div className="p-6 border-t">
            {renderActionArea()}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        )}

        <div className="flex justify-end p-6 border-t">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;
