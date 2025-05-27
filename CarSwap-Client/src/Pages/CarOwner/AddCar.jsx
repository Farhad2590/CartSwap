import { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const AddCar = () => {
  const imgbbApi = "7f3a98e5b9235e50d10ab2af5590caa9";
  const { user } = useAuth();
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    vehicle_type: "",
    vehicle_brand: "",
    vehicle_model: "",
    vehicle_engine_number: "",
    vehicle_number_plate: "",
    vehicle_images: [],
    vehicle_rate_per_hour: "",
    maximum_allowed_distance: "",
    year: "",
    rules: "",
    availability: "",
    posting_location: "",
  });

  // Get user's location on component mount
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const response = await axios.get('https://api.ipify.org?format=json');
        const ipAddress = response.data.ip;
        
        // Get location info from IP
        const geoResponse = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
        const locationData = geoResponse.data;
        
        setLocation(`${locationData.city}, ${locationData.region}, ${locationData.country_name}`);
        setFormData(prev => ({
          ...prev,
          posting_location: `${locationData.city}, ${locationData.region}, ${locationData.country_name}`,
        }));
      } catch (error) {
        console.error("Error fetching location:", error);
        setLocation("Location unavailable");
      }
    };

    getUserLocation();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        vehicle_images: [...Array.from(files)],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload multiple images
      const imageUrls = [];
      
      if (formData.vehicle_images.length > 0) {
        for (const image of formData.vehicle_images) {
          const formDataImg = new FormData();
          formDataImg.append("image", image);

          const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${imgbbApi}`,
            {
              method: "POST",
              body: formDataImg,
            }
          );

          const result = await response.json();

          if (result.success) {
            imageUrls.push(result.data.url);
          } else {
            console.error("Upload failed:", result);
            throw new Error("Image upload failed");
          }
        }
      }

      const postFormData = {
        ...formData,
        vehicle_images: imageUrls,
        userEmail: user?.email,
        userId: user?._id,
        isSubscriber: user?.isSubscribed || false,
        ratings: [],
        createdAt: new Date().toISOString(),
      };

      await axios.post("http://localhost:9000/cars/", postFormData);

      toast.success("Vehicle added successfully!");

      // Reset form
      setFormData({
        vehicle_type: "",
        vehicle_brand: "",
        vehicle_model: "",
        vehicle_engine_number: "",
        vehicle_number_plate: "",
        vehicle_images: [],
        vehicle_rate_per_hour: "",
        maximum_allowed_distance: "",
        year: "",
        rules: "",
        availability: "",
        posting_location: location,
      });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast.error("Failed to add vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const vehicleTypes = [
    "2 seater",
    "4 seater",
    "6 seater",
    "12 seater",
    "16 seater",
    "20 seater",
  ];

  // Custom style variables based on provided colors
  const styles = {
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10" style={{ color: styles.text }}>
      <h2 className="text-3xl font-bold text-center mb-2" style={{ color: styles.primary }}>
        Add Your Vehicle
      </h2>
      <p className="text-center mb-8" style={{ color: styles.textLight }}>
        Complete the form below to list your vehicle for rental
      </p>

      {location && (
        <div className="mb-6 text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm" style={{ backgroundColor: styles.light, color: styles.primary }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 md:p-8"
        style={{ backgroundColor: "white", borderTop: `4px solid ${styles.primary}` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Vehicle Type */}
          <div className="col-span-1">
            <label className="block mb-2 font-medium" style={{ color: styles.dark }}>
              Vehicle Type *
            </label>
            <select
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: "#e2e8f0", focus: { ringColor: styles.primary } }}
              required
            >
              <option value="">Select Vehicle Type</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Brand */}
          <div className="col-span-1">
            <label className="block mb-2 font-medium" style={{ color: styles.dark }}>
              Vehicle Brand *
            </label>
            <input
              type="text"
              name="vehicle_brand"
              value={formData.vehicle_brand}
              onChange={handleChange}
              placeholder="e.g. Toyota, Honda"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: "#e2e8f0", focus: { ringColor: styles.primary } }}
              required
            />
          </div>

          {/* Vehicle Model */}
          <div className="col-span-1">
            <label className="block mb-2 font-medium" style={{ color: styles.dark }}>
              Vehicle Model *
            </label>
            <input
              type="text"
              name="vehicle_model"
              value={formData.vehicle_model}
              onChange={handleChange}
              placeholder="e.g. Corolla, Civic"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: "#e2e8f0", focus: { ringColor: styles.primary } }}
              required
            />
          </div>

          {/* Year */}
          <div className="col-span-1">
            <label className="block mb-2 font-medium" style={{ color: styles.dark }}>
              Year *
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="e.g. 2023"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: "#e2e8f0", focus: { ringColor: styles.primary } }}
              required
            />
          </div>

          {/* Engine Number */}
          <div className="col-span-1">
            <label className="block mb-2 font-medium" style={{ color: styles.dark }}>
              Engine Number *
            </label>
            <input
              type="text"
              name="vehicle_engine_number"
              value={formData.vehicle_engine_number}
              onChange={handleChange}
              placeholder="Vehicle engine number"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: "#e2e8f0", focus: { ringColor: styles.primary } }}
              required
            />
          </div>

          {/* Number Plate */}
          <div className="col-span-1">
            <label className="block mb-2 font-medium" style={{ color: styles.dark }}>
              License Plate Number *
            </label>
            <input
              type="text"
              name="vehicle_number_plate"
              value={formData.vehicle_number_plate}
              onChange={handleChange}
              placeholder="e.g. ABC-1234"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: "#e2e8f0", focus: { ringColor: styles.primary } }}
              required
            />
          </div>

          {/* Rate Per Hour */}
          <div className="col-span-1">
            <label className="block mb-2 font-medium" style={{ color: styles.dark }}>
              Rate Per Hour (USD) *
            </label>
            <input
              type="number"
              name="vehicle_rate_per_hour"
              value={formData.vehicle_rate_per_hour}
              onChange={handleChange}
              placeholder="e.g. 25"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: "#e2e8f0", focus: { ringColor: styles.primary } }}
              required
            />
          </div>

          {/* Maximum Allowed Distance */}
          <div className="col-span-1">
            <label className="block mb-2 font-medium" style={{ color: styles.dark }}>
              Maximum Allowed Distance (km) *
            </label>
            <input
              type="number"
              name="maximum_allowed_distance"
              value={formData.maximum_allowed_distance}
              onChange={handleChange}
              placeholder="e.g. 200"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: "#e2e8f0", focus: { ringColor: styles.primary } }}
              required
            />
          </div>

          {/* Availability */}
          <div className="col-span-1">
            <label className="block mb-2 font-medium" style={{ color: styles.dark }}>
              Availability *
            </label>
            <input
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="e.g. Weekends only, 24/7"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: "#e2e8f0", focus: { ringColor: styles.primary } }}
              required
            />
          </div>

          {/* Rules */}
          <div className="col-span-3">
            <label className="block mb-2 font-medium" style={{ color: styles.dark }}>
              Rental Rules *
            </label>
            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              placeholder="Specify any rules or restrictions for renting your vehicle"
              className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 h-24"
              style={{ borderColor: "#e2e8f0", focus: { ringColor: styles.primary } }}
              required
            />
          </div>

          {/* Vehicle Images */}
          <div className="col-span-3">
            <label className="block mb-2 font-medium" style={{ color: styles.dark }}>
              Vehicle Images *
            </label>
            <div 
              className="border-2 border-dashed rounded-lg p-4 text-center"
              style={{ borderColor: styles.textLight }}
            >
              <input
                type="file"
                name="vehicle_images"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="vehicle-images"
                multiple
                required
              />
              <label 
                htmlFor="vehicle-images"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: styles.secondary }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-base font-medium" style={{ color: styles.primary }}>
                  Click to upload images
                </span>
                <span className="text-sm mt-1" style={{ color: styles.textLight }}>
                  Upload multiple photos of your vehicle
                </span>
              </label>
              
              {formData.vehicle_images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium" style={{ color: styles.primary }}>
                    {formData.vehicle_images.length} {formData.vehicle_images.length === 1 ? 'image' : 'images'} selected
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {Array.from(formData.vehicle_images).map((file, index) => (
                      <div 
                        key={index} 
                        className="w-16 h-16 relative overflow-hidden rounded-md"
                        style={{ border: `1px solid ${styles.light}` }}
                      >
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Vehicle preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg text-white text-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
            style={{ 
              backgroundColor: styles.primary,
              boxShadow: `0 4px 6px rgba(13, 120, 109, 0.2)`,
              hover: { backgroundColor: styles.dark } 
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Add Vehicle
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Terms and conditions notice */}
      <div className="mt-6 text-center text-sm" style={{ color: styles.textLight }}>
        By listing your vehicle, you agree to our 
        <a href="#" className="mx-1 underline" style={{ color: styles.primary }}>
          Terms & Conditions
        </a>
        and
        <a href="#" className="ml-1 underline" style={{ color: styles.primary }}>
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

export default AddCar;