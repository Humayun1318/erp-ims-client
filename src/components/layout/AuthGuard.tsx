import { useUser } from "@/hooks/useUser";
import { Navigate, useLocation } from "react-router";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

export default function AuthGuard() {
  const { isAuthenticated, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to={location.pathname === "/admin" ? "/admin" : "/user/dashboard"} replace />;
  }

  if (location.pathname === "/register") {
    return <Register />;
  }

  return <Login />;
}
