import React, { useEffect, useState } from "react";
import {
  X,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Shield,
  Key,
  Edit,
  Check,
} from "lucide-react";
import { useApiClient } from "../hooks/useApiClient";
import { useAuth } from "../context/AuthContext"; // To check if the current user is an admin
import { getUserById, resetUserPassword } from "../api/userApi"; // Import your new API functions

// Define an interface for the user data for type safety
interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface UserDetailsModalProps {
  userId: number; // The ID of the user to display
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  userId,
  onClose,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the password reset form
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  const apiClient = useApiClient();
  const { user: currentUser } = useAuth(); // Get the currently logged-in user to check their role
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getUserById(apiClient, userId, newPassword);
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        setError("Could not load user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleResetPassword = async () => {
    // 1. Add a guard clause to ensure user data is loaded
    if (!user) {
      setUpdateError("User details are not available. Cannot reset password.");
      return;
    }

    if (newPassword.length < 8) {
      setUpdateError("Password must be at least 8 characters long.");
      setUpdateSuccess(null);
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      // 2. Create the payload with all required fields from the component's state
      const payload = {
        new_password: newPassword,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      };

      console.log(payload);
      // 3. Pass the complete payload to the updated API function
      await resetUserPassword(apiClient, userId, payload);

      setUpdateSuccess("Password has been reset successfully!");
      setNewPassword(""); // Clear the input on success
    } catch (err) {
      console.error("Failed to reset password:", err);
      setUpdateError("An error occurred. Could not reset the password.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper component for displaying detail items consistently
  const DetailItem: React.FC<{
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
  }> = ({ icon: Icon, label, value }) => (
    <div>
      <dt className="flex items-center text-sm font-medium text-gray-500">
        <Icon className="w-4 h-4 mr-2 text-gray-400" />
        <span>{label}</span>
      </dt>
      <dd className="mt-1 text-md text-gray-900 font-semibold">
        {value || "N/A"}
      </dd>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}
          {error && (
            <div className="text-red-600 bg-red-50 p-4 rounded-lg text-center">
              {error}
            </div>
          )}

          {!loading && !error && user && (
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <DetailItem
                icon={User}
                label="Full Name"
                value={`${user.first_name} ${user.last_name}`}
              />
              <DetailItem
                icon={Shield}
                label="Username"
                value={user.username}
              />
              <DetailItem
                icon={Mail}
                label="Email Address"
                value={user.email}
              />
              <DetailItem
                icon={Key}
                label="Role"
                value={
                  <span className="capitalize px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                }
              />
            </dl>
          )}

          {/* --- Admin-Only Password Reset Section --- */}
          {!loading && user && isAdmin && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Edit className="w-5 h-5 mr-2 text-gray-500" />
                Reset Password
              </h3>
              <div className="flex items-center space-x-3">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="input-field w-full"
                  disabled={isUpdating}
                />
                <button
                  onClick={handleResetPassword}
                  className="btn-primary"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Reset"
                  )}
                </button>
              </div>
              {updateError && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> {updateError}
                </p>
              )}
              {updateSuccess && (
                <p className="mt-2 text-sm text-green-600 flex items-center">
                  <Check className="w-4 h-4 mr-1" /> {updateSuccess}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
