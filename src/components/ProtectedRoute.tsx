import { Navigate, Outlet } from "react-router-dom";
import { isTokenExpired } from "../utils/auth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: Readonly<ProtectedRouteProps>) {
    const token = localStorage.getItem("token");
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!user || !allowedRoles.includes(user.roleName))) {
        return <Navigate to="/desk-selection" replace />;
    }

    return <Outlet />;
}