import { Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

const PrivateRoute = () => {
  const [cookies] = useCookies(["Authorization"]);
  const isLoggedIn = !!cookies.Authorization;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;