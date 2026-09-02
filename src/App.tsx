import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";
import { DeskSelection } from "./pages/DeskSelection";
import { MyReservations } from "./pages/MyReservations";

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
            <Route path="/admin/floors" element={<div>Admin Floor Management (WIP)</div>} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/desk-selection" />} />
        <Route path="*" element={<Navigate to="/desk-selection" />} />
      </Routes>
    </Router>
  );
}