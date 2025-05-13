import { Fa500Px, FaBusinessTime, FaCalendar, FaCamera } from "react-icons/fa";
import { FaMailchimp, FaTimeline } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { GrLicense } from "react-icons/gr";
import { TbLicense } from "react-icons/tb";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../hooks/UseAuth";

const Profile = () => {
  const imgbbApi = "7f3a98e5b9235e50d10ab2af5590caa9";
  const [userData, setUserData] = useState(null);
  const [verificationForm, setVerificationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    licenseNumber: "",
    nid: "",
    vehicleReg: "",
    additionalNotes: "",
    licenseImage: null,
    nidPhoto: null,
    vehicleRegImage: null,
  });
  
  const { user } = useAuth();

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
    if (user?.email) {
      fetchUserData(user.email);
    }
  }, [user?.email]);

  const fetchUserData = async (email) => {
    try {
      const { data } = await axios.get(`http://localhost:9000/users/${email}`);
      setUserData(data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast.error("Failed to load profile data");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUpdatingPhoto(true);
      
      const formDataImg = new FormData();
      formDataImg.append("image", file);
      
      const uploadRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApi}`,
        formDataImg
      );
      
      const newPhotoUrl = uploadRes.data.data.url;
      
      await axios.put(`http://localhost:9000/users/${user.email}`, {
        photo: newPhotoUrl,
      });
      
      toast.success("Profile picture updated successfully!");
      fetchUserData(user.email);
    } catch (error) {
      console.error("Failed to update profile picture:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let vehicleRegImageUrl = userData.photo;
      let nidUrl = userData.photo;
      let licenseImageUrl = userData.photo;
      
      if (formData.vehicleRegImage) {
        const formDataImg = new FormData();
        formDataImg.append("image", formData.vehicleRegImage);
        const uploadRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApi}`,
          formDataImg
        );
        vehicleRegImageUrl = uploadRes.data.data.url;
      }

      if (formData.licenseImage) {
        const formDataImg = new FormData();
        formDataImg.append("image", formData.licenseImage);
        const uploadRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApi}`,
          formDataImg
        );
        licenseImageUrl = uploadRes.data.data.url;
      }

      if (formData.nidPhoto) {
        const formDataImg = new FormData();
        formDataImg.append("image", formData.nidPhoto);
        const uploadRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApi}`,
          formDataImg
        );
        nidUrl = uploadRes.data.data.url;
      }

      const verificationData = {
        ...formData,
        vehicleRegImage: vehicleRegImageUrl,
        licenseImage: licenseImageUrl,
        nidPhoto: nidUrl,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await axios.put(`http://localhost:9000/users/${user.email}`, {
        verificationData: verificationData,
      });

      toast.success("Verification request submitted successfully!");
      setVerificationForm(false);
      fetchUserData(user.email);
    } catch (error) {
      console.error("Failed to submit verification:", error);
      toast.error("Failed to submit verification request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "verified": return colors.success;
      case "pending": return colors.warning;
      case "rejected": return colors.danger;
      default: return colors.textLight;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden" style={{ borderTop: `4px solid ${colors.primary}` }}>
        {/* Header Background */}
        <div className="h-40 relative" style={{ 
          background: `linear-gradient(120deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
        }}>
          <div className="absolute bottom-0 left-0 right-0 h-24" style={{ 
            background: `linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)`
          }}></div>
        </div>

        {/* Profile Content */}
        <div className="relative px-6 pb-8">
          {/* Profile Image */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <div className="relative group">
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfilePicChange}
              />
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                {isUpdatingPhoto ? (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: colors.light }}>
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: colors.primary }}></div>
                  </div>
                ) : (
                  <img
                    src={userData.photo}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div 
                onClick={handleProfilePicClick}
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: colors.primary }}
              >
                <FaCamera className="text-white" />
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300 cursor-pointer" onClick={handleProfilePicClick}></div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-24 text-center">
            <h2 className="text-3xl font-bold" style={{ color: colors.text }}>{userData.name}</h2>
            <p className="font-medium text-lg capitalize mt-1" style={{ color: colors.primary }}>
              {userData.role}
            </p>
            {userData.verificationData?.status && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ 
                backgroundColor: `${getStatusColor(userData.verificationData?.status)}20`,
                color: getStatusColor(userData.verificationData?.status)
              }}>
                {userData.verificationData?.status || "Unverified"}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="flex items-center p-3 rounded-lg transition-all duration-300 hover:shadow-md" style={{ backgroundColor: `${colors.light}` }}>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.primary}20` }}>
                <FaMailchimp className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium" style={{ color: colors.textLight }}>Email</p>
                <p className="font-medium" style={{ color: colors.text }}>{userData.email}</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg transition-all duration-300 hover:shadow-md" style={{ backgroundColor: `${colors.light}` }}>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.primary}20` }}>
                <FaPhoneAlt className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium" style={{ color: colors.textLight }}>Phone</p>
                <p className="font-medium" style={{ color: colors.text }}>{userData.phone}</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg transition-all duration-300 hover:shadow-md" style={{ backgroundColor: `${colors.light}` }}>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${colors.primary}20` }}>
                <FaCalendar className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
              <div className="ml-4">
                <p className="text-xs font-medium" style={{ color: colors.textLight }}>Joined on</p>
                <p className="font-medium" style={{ color: colors.text }}>{formatDate(userData.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Verification Details */}
          {userData.verificationData?.status === "verified" && (
            <div className="mt-10 border-t pt-6" style={{ borderColor: `${colors.light}` }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>Verification Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center p-3 rounded-lg bg-white shadow-sm">
                    <GrLicense className="w-5 h-5" style={{ color: colors.primary }} />
                    <div className="ml-3">
                      <p className="text-xs" style={{ color: colors.textLight }}>License Number</p>
                      <p className="font-medium" style={{ color: colors.text }}>{userData.verificationData.licenseNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-white shadow-sm">
                    <Fa500Px className="w-5 h-5" style={{ color: colors.primary }} />
                    <div className="ml-3">
                      <p className="text-xs" style={{ color: colors.textLight }}>NID Number</p>
                      <p className="font-medium" style={{ color: colors.text }}>{userData.verificationData.nid}</p>
                    </div>
                  </div>
                  
                  {userData.userType === "renter" && (
                    <div className="flex items-center p-3 rounded-lg bg-white shadow-sm">
                      <TbLicense className="w-5 h-5" style={{ color: colors.primary }} />
                      <div className="ml-3">
                        <p className="text-xs" style={{ color: colors.textLight }}>Vehicle Registration</p>
                        <p className="font-medium" style={{ color: colors.text }}>{userData.verificationData.vehicleReg}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center p-3 rounded-lg bg-white shadow-sm">
                    <FaTimeline className="w-5 h-5" style={{ color: colors.primary }} />
                    <div className="ml-3">
                      <p className="text-xs" style={{ color: colors.textLight }}>Additional Notes</p>
                      <p className="font-medium" style={{ color: colors.text }}>{userData.verificationData.additionalNotes || "None"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 rounded-lg bg-white shadow-sm">
                    <FaBusinessTime className="w-5 h-5" style={{ color: colors.primary }} />
                    <div className="ml-3">
                      <p className="text-xs" style={{ color: colors.textLight }}>Admin Remarks</p>
                      <p className="font-medium" style={{ color: colors.text }}>{userData.adminNotes || "None"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 rounded-lg bg-white shadow-sm">
                    <FaBusinessTime className="w-5 h-5" style={{ color: colors.primary }} />
                    <div className="ml-3">
                      <p className="text-xs" style={{ color: colors.textLight }}>Verified At</p>
                      <p className="font-medium" style={{ color: colors.text }}>{userData.verifiedAt ? formatDate(userData.verifiedAt) : "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Document Images */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <p className="text-sm font-medium mb-2" style={{ color: colors.primary }}>NID Photo</p>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={userData.verificationData.nidPhoto} 
                      alt="NID" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg shadow-md">
                  <p className="text-sm font-medium mb-2" style={{ color: colors.primary }}>License Image</p>
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={userData.verificationData.licenseImage} 
                      alt="License" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                
                {userData.userType === "renter" && (
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <p className="text-sm font-medium mb-2" style={{ color: colors.primary }}>Vehicle Registration Image</p>
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={userData.verificationData.vehicleRegImage} 
                        alt="Vehicle Registration" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Show rejected message */}
          {userData.verificationData?.status === "rejected" && (
            <div className="mt-6 p-4 rounded-lg border" style={{ borderColor: colors.danger, backgroundColor: `${colors.danger}10` }}>
              <h3 className="font-medium mb-2" style={{ color: colors.danger }}>Verification Rejected</h3>
              <p style={{ color: colors.text }}>Admin Remarks: {userData.adminNotes || "No remarks provided"}</p>
            </div>
          )}
        </div>

        {/* Only show Get Verified button if status is not pending or verified */}
        {(!userData.verificationData?.status ||
          userData.verificationData?.status === "rejected" ||
          userData.verificationData?.status === "unverified") && (
          <div className="px-6 pb-6">
            <button
              onClick={() => setVerificationForm(true)}
              className="w-full py-3 rounded-lg text-white font-medium text-center transition duration-300"
              style={{ 
                backgroundColor: colors.primary,
                boxShadow: `0 4px 12px ${colors.primary}40`
              }}
            >
              Get Verified
            </button>
          </div>
        )}
        
        {/* Pending status notification */}
        {userData.verificationData?.status === "pending" && (
          <div className="px-6 pb-6">
            <div className="w-full py-3 rounded-lg font-medium text-center" style={{ 
              backgroundColor: `${colors.warning}20`,
              color: colors.warning,
            }}>
              Verification Pending
            </div>
          </div>
        )}
      </div>

      {/* Verification Form Modal */}
      {verificationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center" style={{ borderColor: colors.light }}>
              <h2 className="text-2xl font-bold" style={{ color: colors.primary }}>Verification Form</h2>
              <button
                onClick={() => setVerificationForm(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: colors.light }}
              >
                <span className="text-xl" style={{ color: colors.primary }}>✖</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-sm" style={{ color: colors.text }}>
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border focus:outline-none transition-all duration-300"
                    style={{ 
                      borderColor: colors.light,
                      boxShadow: "none",
                      ":focus": {
                        borderColor: colors.primary,
                        boxShadow: `0 0 0 3px ${colors.primary}20`
                      }
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-sm" style={{ color: colors.text }}>
                    NID Number
                  </label>
                  <input
                    type="text"
                    name="nid"
                    value={formData.nid}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border focus:outline-none transition-all duration-300"
                    style={{ borderColor: colors.light }}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-sm" style={{ color: colors.text }}>
                    Vehicle Registration
                  </label>
                  <input
                    type="text"
                    name="vehicleReg"
                    value={formData.vehicleReg}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border focus:outline-none transition-all duration-300"
                    style={{ borderColor: colors.light }}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-sm" style={{ color: colors.text }}>
                    Additional Notes
                  </label>
                  <input
                    type="text"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border focus:outline-none transition-all duration-300"
                    style={{ borderColor: colors.light }}
                  />
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-sm" style={{ color: colors.text }}>
                    License Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="licenseImage"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      className="w-full p-3 rounded-lg border focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium transition-all duration-300"
                      style={{ 
                        borderColor: colors.light,
                        color: colors.text,
                      }}
                    />
                    {formData.licenseImage && (
                      <span className="text-xs mt-1 block" style={{ color: colors.success }}>
                        Selected: {formData.licenseImage.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-sm" style={{ color: colors.text }}>
                    NID Photo
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="nidPhoto"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      className="w-full p-3 rounded-lg border focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium transition-all duration-300"
                      style={{ 
                        borderColor: colors.light,
                        color: colors.text,
                      }}
                    />
                    {formData.nidPhoto && (
                      <span className="text-xs mt-1 block" style={{ color: colors.success }}>
                        Selected: {formData.nidPhoto.name}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-sm" style={{ color: colors.text }}>
                    Vehicle Reg. Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="vehicleRegImage"
                      accept="image/*"
                      required
                      onChange={handleImageChange}
                      className="w-full p-3 rounded-lg border focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium transition-all duration-300"
                      style={{ 
                        borderColor: colors.light,
                        color: colors.text,
                      }}
                    />
                    {formData.vehicleRegImage && (
                      <span className="text-xs mt-1 block" style={{ color: colors.success }}>
                        Selected: {formData.vehicleRegImage.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg text-white font-medium transition duration-300"
                  style={{ 
                    backgroundColor: isSubmitting ? colors.textLight : colors.primary,
                    boxShadow: isSubmitting ? "none" : `0 4px 12px ${colors.primary}40`
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    "Submit Verification"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;