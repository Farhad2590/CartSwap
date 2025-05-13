import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaCheck, FaTimes, FaCar, FaInfoCircle } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { MdWarning } from "react-icons/md";
import UserDetailsModal from "./components/UserDetailsModal";
import CarDetails from "./components/CarDetails";

const CarManagement = () => {
  const [carPosts, setCarPosts] = useState([]);
  const [singleUser, setSingleUser] = useState({});
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCarModal, setShowCarModal] = useState(false);
  const api = "http://localhost:9000";

  // Color palette based on #0d786d
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

  useEffect(() => {
    fetchAllCarPosts();
  }, []);

  const fetchAllCarPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/cars/`);
      setCarPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
      toast.error("Failed to load car posts");
    }
  };

  const handleUser = async (userEmail) => {
    try {
      const response = await axios.get(`${api}/users/${userEmail}`);
      setSingleUser(response.data);
      setShowUserModal(true);
    } catch (err) {
      toast.error("Failed to load user details");
    }
  };

  const handleCarDetails = (car) => {
    setSelectedCar(car);
    setShowCarModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car post?"))
      return;

    try {
      await axios.delete(`${api}/cars/${id}`);
      fetchAllCarPosts();
      toast.success("Car post deleted successfully");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      toast.error("Failed to delete car post");
    }
  };

  const handleUpdate = async (id) => {
    if (!window.confirm("Are you sure you want to accept this car post?"))
      return;

    try {
      await axios.put(`${api}/cars/approve/${id}`);
      fetchAllCarPosts();
      toast.success("Car post approved successfully");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      toast.error("Failed to approve car post");
    }
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSingleUser({});
  };

  const closeCarModal = () => {
    setShowCarModal(false);
    setSelectedCar(null);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: `${colors.success}30`,
          text: colors.success,
        };
      case "pending":
        return {
          bg: `${colors.warning}30`,
          text: colors.warning,
        };
      case "rejected":
        return {
          bg: `${colors.danger}30`,
          text: colors.danger,
        };
      default:
        return {
          bg: "#a0aec030",
          text: "#a0aec0",
        };
    }
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <BiLoaderAlt
            className="animate-spin text-4xl mb-2"
            style={{ color: colors.primary }}
          />
          <p style={{ color: colors.textLight }}>Loading car posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <MdWarning
            className="text-4xl mb-2"
            style={{ color: colors.danger }}
          />
          <p style={{ color: colors.danger }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <FaCar className="text-3xl mr-3" style={{ color: colors.primary }} />
        <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
          Car Management
        </h1>
      </div>

      <div
        className="bg-white shadow-lg rounded-xl overflow-hidden border"
        style={{ borderColor: `${colors.light}` }}
      >
        <div className="overflow-x-auto">
          <table
            className="min-w-full divide-y"
            style={{ borderColor: colors.light }}
          >
            <thead>
              <tr style={{ backgroundColor: colors.light }}>
                <th
                  className="py-4 px-6 text-left text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  Model
                </th>
                <th
                  className="py-4 px-6 text-left text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  Price per hour
                </th>
                <th
                  className="py-4 px-6 text-left text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  Availability
                </th>
                <th
                  className="py-4 px-6 text-left text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  Owner
                </th>
                <th
                  className="py-4 px-6 text-left text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  Car Details
                </th>
                <th
                  className="py-4 px-6 text-left text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  Status
                </th>
                <th
                  className="py-4 px-6 text-left text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: colors.light }}>
              {carPosts.map((carPost) => {
                const statusBadgeStyle = getStatusBadgeStyle(carPost.status);

                return (
                  <tr
                    key={carPost._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6">
                      <span
                        className="font-medium"
                        style={{ color: colors.text }}
                      >
                        {carPost.vehicle_model || carPost.model || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-6" style={{ color: colors.text }}>
                      ${carPost.vehicle_rate_per_hour || carPost.price || "N/A"}
                    </td>
                    <td className="py-4 px-6" style={{ color: colors.text }}>
                      {carPost.availability || "N/A"}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleUser(carPost.userEmail)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                        style={{
                          backgroundColor: `${colors.primary}20`,
                          color: colors.primary,
                        }}
                      >
                        View Owner
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleCarDetails(carPost)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                        style={{
                          backgroundColor: `${colors.primary}20`,
                          color: colors.primary,
                        }}
                      >
                        View Vehicle
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium inline-block capitalize"
                        style={{
                          backgroundColor: statusBadgeStyle.bg,
                          color: statusBadgeStyle.text,
                        }}
                      >
                        {carPost.status || "N/A"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        {carPost.status === "pending" && (
                          <button
                            onClick={() => handleUpdate(carPost._id)}
                            className="p-2 rounded-full transition-all duration-200 hover:shadow-md"
                            style={{ backgroundColor: `${colors.success}20` }}
                            title="Accept"
                          >
                            <FaCheck
                              size={16}
                              style={{ color: colors.success }}
                            />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(carPost._id)}
                          className="p-2 rounded-full transition-all duration-200 hover:shadow-md"
                          style={{ backgroundColor: `${colors.danger}20` }}
                          title="Reject"
                        >
                          <FaTimes size={16} style={{ color: colors.danger }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {carPosts.length === 0 && (
          <div className="py-8 text-center" style={{ color: colors.textLight }}>
            No car posts found
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && (
        <UserDetailsModal
          user={singleUser}
          onClose={closeUserModal}
          colors={colors}
        />
      )}

      {/* Car Details Modal */}
      {showCarModal && (
        <CarDetails car={selectedCar} onClose={closeCarModal} colors={colors} />
      )}
    </div>
  );
};

export default CarManagement;
