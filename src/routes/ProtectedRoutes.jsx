import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // fix path

const ProtectedRoutes = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  // Pick login page from the route we are guarding
  const loginPath = allowedRoles.includes("student")
    ? "/auth/student-login"
    : "/auth/admin-login";

  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Wrong role → send to the correct portal login
    const fallback =
      user?.role === "student"
        ? "/auth/student-login"
        : "/auth/admin-login";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;