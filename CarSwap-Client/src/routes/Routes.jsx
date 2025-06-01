import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home";
import Main from "../Layout/Main";
import Login from "../Pages/Login";
import SignUpFlow from "../Pages/SignUpFlow";
import Dashboard from "../Layout/Dashboard";
import Profile from "../Pages/Shared/Profile";
import VerificatioRequest from "../Pages/Admin/VerificationRequest";
import AllUsers from "../Pages/Admin/AllUsers";
import AddCar from "../Pages/CarOwner/AddCar";
import CarManagement from "../Pages/Admin/CarManagement";
import BookingPage from "../Components/BookingComponents/BookingPage";
import BookingConfirmation from "../Components/BookingComponents/BookingConfirmation";
import DashboardOverview from "../Components/DashboardComponents/DashboardOverview";
import BrowseCars from "../Components/DashboardComponents/BrowseCars";
import ProfileVerification from "../Pages/Shared/ProfileVerification";
import MyCar from "../Pages/CarOwner/MyCar";
import BowseCars from "../Pages/Shared/BrowseCars";
import Info from "../Pages/Shared/components/Info";
import CarDetails from "../Pages/Shared/CarDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,

    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/cars",
        element: <BowseCars />,
      },
      {
        path: "/cars/:id",
        element: <CarDetails />,
      },
      { path: "/signUpFlow", element: <SignUpFlow></SignUpFlow> },
      { path: "/signin", element: <Login></Login> },
      { path: "/booking/:carId", element: <BookingPage /> },
      {
        path: "/booking/:carId/confirmation",
        element: <BookingConfirmation />,
      },
      { path: "/verification-status", element: <Info /> },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: "/dashboard",
        element: <DashboardOverview />,
      },
      {
        path: "/dashboard/profile",
        element: <Profile />,
      },
      {
        path: "/dashboard/verification",
        element: <ProfileVerification />,
      },
      {
        path: "/dashboard/browse-cars",
        element: <BrowseCars />,
      },
      //Admin
      {
        path: "/dashboard/verification-requests",
        element: <VerificatioRequest />,
      },
      {
        path: "/dashboard/all-users",
        element: <AllUsers />,
      },

      {
        path: "/dashboard/manage-cars",
        element: <CarManagement />,
      },

      //CarOwner
      {
        path: "/dashboard/add-car",
        element: <AddCar />,
      },
      {
        path: "/dashboard/my-cars",
        element: <MyCar />,
      },
    ],
  },
]);
