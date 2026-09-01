import { Navigate, Outlet } from "react-router-dom";
import { isTokenExpired } from "../utils/auth";

export default function ProtectedRoute() {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}