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
import DashboardIndex from "../pages/Dashboard/DashboardIndex";
import AdminOverview from "../pages/Dashboard/Admin/AdminOverview";
import ChefOverview from "../pages/Dashboard/Chef/ChefOverview";
import UserOverview from "../pages/Dashboard/User/UserOverview";
import ChefOrderRequests from "../pages/Dashboard/Chef/ChefOrderRequests";
import MyReviews from "../pages/Dashboard/User/MyReview";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage></ErrorPage>,
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
        path: "meals/:id",
        element: <MealDetails />,
      },
      {
        path: "/payment/:id",
        element: (
          <PrivetRouter>
            <PaymentPage />
          </PrivetRouter>
        ),
      },
      {
        path: "/favorites",
        element: (
          <PrivetRouter>
            <Favorites />
          </PrivetRouter>
        ),
      },
      {
        path: "/my-orders",
        element: (
          <PrivetRouter>
            <MyOrders />
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
        path: "/login",
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
        <DashboardLayout />
      </PrivetRouter>
    ),
    children: [
      {
        index: true,
        element: <DashboardIndex />,
      },
      {
        path: "admin/overview",
        element: (
          <AdminRoute>
            <AdminOverview />
          </AdminRoute>
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
      {
        path: "user/my-review",
        element: (
          <PrivetRouter>
            <MyReviews />
          </PrivetRouter>
        ),
      },
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
      // 1. Overview Routes (role based)

      {
        path: "chef/overview",
        element: (
          <PrivetRouter>
            <ChefOverview />
          </PrivetRouter>
        ),
      },
      {
        path: "user/overview",
        element: (
          <PrivetRouter>
            <UserOverview />
          </PrivetRouter>
        ),
      },

      {
        path: "/dashboard/create-meal",
        element: (
          <PrivetRouter>
            <CreateMeal />
          </PrivetRouter>
        ),
      },
      {
        path: "order-requests",
        element: (
          <PrivetRouter>
            <ChefOrderRequests />
          </PrivetRouter>
        ),
      },

      {
        path: "/dashboard/my-meals",
        element: (
          <PrivetRouter>
            <MyMeals />
          </PrivetRouter>
        ),
      },
      {
        path: "update-meal/:id",
        element: (
          <PrivetRouter>
            <UpdateMeal />
          </PrivetRouter>
        ),
      },

      {
        path: "user/orders",
        element: (
          <PrivetRouter>
            <MyOrders />
          </PrivetRouter>
        ),
      },
      {
        path: "user/favorites",
        element: (
          <PrivetRouter>
            <Favorites />
          </PrivetRouter>
        ),
      },
      {
        path: "payment-history",
        element: (
          <PrivetRouter>
            <PaymentHistory />
          </PrivetRouter>
        ),
      },
    ],
  },
]);
