import React from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import Meals from "../pages/Meals/Meals";
import PrivetRouter from "./PrivetRouter";
import MealDetails from "../pages/Meals/MealDetails";
import DashboardLayout from "../layouts/DashboardLayout";
import CreateMeal from "../pages/Dashboard/Chef/CreateMeal";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Loging";
import Register from "../pages/Auth/Registration";
import MyMeals from "../pages/Dashboard/Chef/MyMeals";
import UpdateMeal from "../pages/Dashboard/Chef/UpdateMeal";
import PaymentPage from "../pages/Payments/PaymentPage";
import Favorites from "../pages/Dashboard/User/Favorites";
import MyOrders from "../pages/Dashboard/User/MyOrders";
import AdminRoute from "./AdminRoute";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageRequests from "../pages/Dashboard/Admin/ManageRequests";
import PlatformStats from "../pages/Dashboard/Admin/PlatformStats";
import PaymentHistory from "../pages/Dashboard/User/PaymentHistory";
import Profile from "../pages/Profile/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "meals",
        element: <Meals></Meals>,
      },
      {
        path: "meals_details/:id",
        element: <MealDetails />,
      },
      {
        path: "payment",
        element: (
          <PrivetRouter>
            <PaymentPage />
          </PrivetRouter>
        ),
      },
      {
        path: "favorites",
        element: (
          <PrivetRouter>
            <Favorites />
          </PrivetRouter>
        ),
      },
      {
        path: "my-orders",
        element: (
          <PrivetRouter>
            <MyOrders />
          </PrivetRouter>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivetRouter>
            <Profile />
          </PrivetRouter>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "auth/login",
        Component: Login,
      },
      {
        path: "auth/register",
        Component: Register,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivetRouter>
        <DashboardLayout></DashboardLayout>
      </PrivetRouter>
    ),
    children: [
      // {
      //   index: true,
      //    element: DashboardHome,
      // },
      {
        path: "/dashboard/create-meal",
        element: <CreateMeal></CreateMeal>,
      },
      {
        path: "/dashboard/my-meals",
        element: <MyMeals></MyMeals>,
      },
      {
        path: "/dashboard/update-meal/:id",
        element: <UpdateMeal></UpdateMeal>,
      },
      {
        path: "/dashboard/payment-history",
        element: <PaymentHistory></PaymentHistory>,
      },
    ],
  },
  // admin
  {
    path: "admin/manage-users",
    element: (
      <AdminRoute>
        <ManageUsers />
      </AdminRoute>
    ),
  },
  {
    path: "admin/manage-requests",
    element: (
      <AdminRoute>
        <ManageRequests />
      </AdminRoute>
    ),
  },
  {
    path: "admin/platform-stats",
    element: (
      <AdminRoute>
        <PlatformStats />
      </AdminRoute>
    ),
  },
]);
