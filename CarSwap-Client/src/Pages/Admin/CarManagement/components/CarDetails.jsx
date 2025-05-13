import { useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdLocationOn, MdOutlineRuleFolder } from "react-icons/md";
import { GiCarWheel } from "react-icons/gi";
import { AiFillCar } from "react-icons/ai";
import { RiGasStationFill } from "react-icons/ri";
import { BsSpeedometer2 } from "react-icons/bs";
import { IoMdPricetags } from "react-icons/io";
import { TbLicense } from "react-icons/tb";

const CarDetails = ({ car, onClose, colors }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = car?.vehicle_images || [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (!car || !car.vehicle_model) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 overflow-y-auto">
      <div 
        className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl my-8"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 float-right mr-4 p-2 rounded-full z-10 transition-all duration-200 hover:shadow-md"
          style={{ backgroundColor: `${colors.danger}20` }}
          title="Close"
          aria-label="Close modal"
        >
          <FaTimes size={16} style={{ color: colors.danger }} />
        </button>

        {/* Car Image Slider */}
        <div className="w-full">
          <div 
            className="relative overflow-hidden"
            style={{ height: "280px" }}
          >
            {images.length > 0 ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={images[currentImageIndex]}
                    alt={`${car.vehicle_brand} ${car.vehicle_model}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Caption */}
                <div 
                  className="absolute bottom-0 w-full py-2 px-4 text-center"
                  style={{ backgroundColor: `${colors.primary}90` }}
                >
                  <p className="text-white text-sm font-medium">
                    {car.vehicle_brand} {car.vehicle_model} ({currentImageIndex + 1}/{images.length})
                  </p>
                </div>
                
                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-70 shadow-md hover:bg-opacity-100 transition-all"
                      aria-label="Previous image"
                    >
                      <FaChevronLeft size={14} style={{ color: colors.primary }} />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-70 shadow-md hover:bg-opacity-100 transition-all"
                      aria-label="Next image"
                    >
                      <FaChevronRight size={14} style={{ color: colors.primary }} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor: `${colors.primary}20` }}
              >
                <AiFillCar size={80} style={{ color: colors.primary }} />
                <p className="ml-4 text-lg font-medium" style={{ color: colors.primary }}>
                  No images available
                </p>
              </div>
            )}
          </div>
          
          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2 px-6">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentImageIndex === index ? "scale-125" : "opacity-50"
                  }`}
                  style={{ 
                    backgroundColor: currentImageIndex === index 
                      ? colors.primary 
                      : colors.textLight
                  }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Car Info */}
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
              {car.vehicle_brand} {car.vehicle_model}
            </h2>
            <span 
              className="px-3 py-1 rounded-full text-xs font-medium capitalize"
              style={{ 
                backgroundColor: car.status === "approved" 
                  ? `${colors.success}30` 
                  : car.status === "pending" 
                    ? `${colors.warning}30` 
                    : `${colors.danger}30`,
                color: car.status === "approved" 
                  ? colors.success 
                  : car.status === "pending" 
                    ? colors.warning 
                    : colors.danger
              }}
            >
              {car.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Vehicle Details */}
            <div className="space-y-3">
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-50" style={{ color: colors.text }}>
                <AiFillCar className="w-5 h-5 mr-3" style={{ color: colors.primary }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Vehicle Type</p>
                  <p>{car.vehicle_type || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-50" style={{ color: colors.text }}>
                <GiCarWheel className="w-5 h-5 mr-3" style={{ color: colors.primary }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Year</p>
                  <p>{car.year || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-50" style={{ color: colors.text }}>
                <RiGasStationFill className="w-5 h-5 mr-3" style={{ color: colors.primary }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Engine Number</p>
                  <p>{car.vehicle_engine_number || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-50" style={{ color: colors.text }}>
                <TbLicense className="w-5 h-5 mr-3" style={{ color: colors.primary }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Number Plate</p>
                  <p>{car.vehicle_number_plate || "N/A"}</p>
                </div>
              </div>
            </div>
            
            {/* Rental Details */}
            <div className="space-y-3">
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-50" style={{ color: colors.text }}>
                <IoMdPricetags className="w-5 h-5 mr-3" style={{ color: colors.primary }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Rate Per Hour</p>
                  <p>${car.vehicle_rate_per_hour || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-50" style={{ color: colors.text }}>
                <BsSpeedometer2 className="w-5 h-5 mr-3" style={{ color: colors.primary }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Maximum Allowed Distance</p>
                  <p>{car.maximum_allowed_distance || "N/A"} km</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-50" style={{ color: colors.text }}>
                <GiCarWheel className="w-5 h-5 mr-3" style={{ color: colors.primary }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Availability</p>
                  <p>{car.availability || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex items-center p-2 rounded-lg hover:bg-gray-50" style={{ color: colors.text }}>
                <MdLocationOn className="w-5 h-5 mr-3" style={{ color: colors.primary }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.textLight }}>Location</p>
                  <p>{car.posting_location || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rules Section */}
          {car.rules && (
            <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.light }}>
              <div className="flex items-center mb-2">
                <MdOutlineRuleFolder className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                  Rules & Requirements
                </h3>
              </div>
              <p className="pl-7" style={{ color: colors.textLight }}>
                {car.rules}
              </p>
            </div>
          )}
          
          {/* Post Info */}
          <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.light }}>
            <div className="flex justify-between text-sm" style={{ color: colors.textLight }}>
              <p>Posted by: {car.userEmail}</p>
              <p>Posted on: {new Date(car.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="mt-2 flex">
              <p className="text-sm mr-3" style={{ color: colors.textLight }}>
                Subscription: 
              </p>
              <span 
                className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                style={{ 
                  backgroundColor: car.isSubscriber ? `${colors.success}30` : `${colors.textLight}30`,
                  color: car.isSubscriber ? colors.success : colors.textLight
                }}
              >
                {car.isSubscriber ? "Subscribed" : "Not Subscribed"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;