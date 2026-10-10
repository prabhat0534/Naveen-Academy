import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import Students from "../pages/Students/Students";
import Fees from "../pages/Fees/Fees";
import Notes from "../pages/Notes/Notes";
import Notices from "../pages/Notices/Notices";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="fees" element={<Fees />} />
        <Route path="notes" element={<Notes />} />
        <Route path="notices" element={<Notices />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}