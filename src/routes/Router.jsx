import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/course_details", element: <Allcourse /> },

      // protected route
      {
        path: "/single_details/:id",
        element: (
          <PrivetRouter>
            <SingleCourse />
          </PrivetRouter>
        ),
      },

      {
        path: "/my_profile",
        element: (
          <PrivetRouter>
            <MyProfile />
          </PrivetRouter>
        ),
      },
      {
        path: "/auth/forgot-password",
        element: <ForgotPassword></ForgotPassword>,
      },
      // Auth layout
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Loging /> },
          { path: "registration", element: <Registration /> },
        ],
      },
    ],
  },
]);
