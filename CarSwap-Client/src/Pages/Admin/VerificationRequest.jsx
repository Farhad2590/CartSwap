import { useState, useEffect } from "react";
import axios from "axios";

// Color palette
const colors = {
  primary: "#0d786d",
  secondary: "#10a599",
  accent: "#076158",
  light: "#edf7f6",
  dark: "#065048",
  text: "#334155",
  textLight: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
};

const VerificationRequest = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminRemarks, setAdminRemarks] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const api = "http://localhost:9000";

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/verifications/pending`);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

  const handleEditStatus = (userId, currentStatus) => {
    setEditingUserId(userId);
    setNewStatus(currentStatus);
  };

  const handleStatusUpdate = async (userId) => {
    try {
      const user = users.find((u) => u._id === userId);
      if (!user) return;

      await axios.put(`${api}/verifications/${user.userType}/${user._id}`, {
        status: newStatus,
        adminNotes: adminRemarks,
      });

      setUsers(
        users.map((u) =>
          u._id === userId
            ? {
                ...u,
                verificationStatus: "Verified",
                verificationData: {
                  ...u.verificationData,
                  status: newStatus,
                  adminRemarks: adminRemarks,
                  verifiedAt: new Date().toISOString,
                },
              }
            : u
        )
      );
      setEditingUserId(null);
      fetchAllUsers();
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${api}/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  if (loading) return <div className="text-center py-8" style={{ color: colors.text }}>Loading users...</div>;
  if (error)
    return <div className="text-center py-8" style={{ color: colors.danger }}>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: colors.primary }}>Verification Management</h1>
      <div className="shadow-md rounded-lg overflow-hidden" style={{ backgroundColor: "white" }}>
        <table className="min-w-full">
          <thead style={{ backgroundColor: colors.light }}>
            <tr>
              <th className="py-3 px-4 text-left" style={{ color: colors.text }}>Name</th>
              <th className="py-3 px-4 text-left" style={{ color: colors.text }}>Email</th>
              <th className="py-3 px-4 text-left" style={{ color: colors.text }}>Status</th>
              <th className="py-3 px-4 text-left" style={{ color: colors.text }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const status = user.verificationData?.status || "Pending";
              return (
                <tr
                  key={user._id}
                  className="border-t hover:bg-gray-50"
                  style={{ borderColor: colors.light }}
                >
                  <td className="py-3 px-4" style={{ color: colors.text }}>{user.name || "N/A"}</td>
                  <td className="py-3 px-4" style={{ color: colors.text }}>{user.email}</td>
                  <td className="py-3 px-4" style={{ color: colors.text }}>
                    {editingUserId === user._id ? (
                      <div>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="border px-2 py-1 rounded text-sm"
                          style={{ borderColor: colors.textLight, color: colors.text }}
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        <input
                          onChange={(e) => setAdminRemarks(e.target.value)}
                          className="border ml-2 px-2 py-1 rounded text-sm"
                          style={{ borderColor: colors.textLight, color: colors.text }}
                          type="text"
                          placeholder="Admin remarks"
                          name="adminRemarks"
                          id="adminRemarks"
                        />
                      </div>
                    ) : (
                      status
                    )}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-white px-3 py-1 rounded text-sm"
                      style={{ backgroundColor: colors.success }}
                    >
                      View Details
                    </button>

                    {editingUserId === user._id ? (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(user._id)}
                          className="text-white px-3 py-1 rounded text-sm"
                          style={{ backgroundColor: colors.primary }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="text-white px-3 py-1 rounded text-sm"
                          style={{ backgroundColor: colors.textLight }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStatus(user._id, status)}
                          className="text-white px-3 py-1 rounded text-sm"
                          style={{ backgroundColor: colors.warning }}
                        >
                          Edit Status
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-white px-3 py-1 rounded text-sm"
                          style={{ backgroundColor: colors.danger }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 rounded shadow-lg max-w-lg w-full" style={{ backgroundColor: "white" }}>
            <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>User Details</h2>
            <div className="space-y-2 max-h-[70vh] overflow-auto" style={{ color: colors.text }}>
              <h2>Name: {selectedUser.name}</h2>
              <h2>Email: {selectedUser.email}</h2>
              <h2>Role: {selectedUser.userType}</h2>
              <h2>Phone: {selectedUser.phone}</h2>
              <h2>
                License Number: {selectedUser.verificationData.licenseNumber}
              </h2>
              <h2>NID Number: {selectedUser.verificationData.nid}</h2>
              <h2>Status: {selectedUser.verificationData.status}</h2>
              <h2>
                Vehicle Reg: {selectedUser.verificationData.vehicleReg || ""}
              </h2>

              <h2 style={{ color: colors.primary }}>License Image</h2>
              <img src={selectedUser.verificationData.licenseImage} alt="License" />
              <h2 style={{ color: colors.primary }}>NID Photo</h2>
              <img src={selectedUser.verificationData.nidPhoto} alt="NID" />
              <h2 style={{ color: colors.primary }}>Vehicle Reg Image</h2>
              <img src={selectedUser.verificationData.vehicleRegImage} alt="Vehicle Registration" />
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={closeModal}
                className="text-white px-4 py-2 rounded"
                style={{ backgroundColor: colors.primary }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationRequest;