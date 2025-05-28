import LayoutDefault from "../layouts/LayoutDefault/LayoutDefault";
import Login from "../pages/Login/Login";
import UserDetail from "../pages/UserDetail";
import UserList from "../layouts/UserList";
import UserPhotos from "../pages/UserPhotos";
import PrivateRoutes from "../components/PrivateRoutes/PrivateRoutes";
import Register from "../pages/Register/Register";

const Routes = [
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
  {
    element: <PrivateRoutes />,
    children: [
      {
        path: "/",
        element: <LayoutDefault />,
        children: [
          {
            path: "users",
            children: [
              {
                path: ":userId",
                element: <UserDetail />,
              },
              {
                path: "list",
                element: <UserList />,
              },
            ],
          },
          {
            path: "photos",
            children: [
              {
                path: ":userId",
                element: <UserPhotos />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default Routes;
