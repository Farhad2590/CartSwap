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
import CarManagement from "../Pages/Admin/CarManagement/CarManagement";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,

    children: [
      {
        path: "/",
        element: <Home />,
      },
      { path: "/signUpFlow", element: <SignUpFlow></SignUpFlow> },
      { path: "/signin", element: <Login></Login> },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard></Dashboard>,
    children: [
      {
        path: "/dashboard/profile",
        element: <Profile />,
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
      
    ],
  },
]);
