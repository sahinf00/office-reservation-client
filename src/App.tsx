import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { DeskSelection } from "./pages/DeskSelection";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/desk-selection" element={<DeskSelection />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/desk-selection" />} />
        <Route path="*" element={<Navigate to="/desk-selection" />} />
      </Routes>
    </Router>
  );
}