import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";
import { DeskSelection } from "./pages/DeskSelection";
import { MyReservations } from "./pages/MyReservations";
import { AdminFloors } from "./pages/AdminFloors";
import { AdminReservations } from "./pages/AdminReservations";
import { AdminAnalytics } from "./pages/AdminAnalytics";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/desk-selection" element={<DeskSelection />} />
            <Route path="/my-reservations" element={<MyReservations />} />

          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<Layout />}>
            <Route path="/admin/floors" element={<AdminFloors />} />
            <Route path="/admin/reservations" element={<AdminReservations />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/desk-selection" />} />
        <Route path="*" element={<Navigate to="/desk-selection" />} />
      </Routes>
    </Router>
  );
}