// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoutes";

// Public
import LandingPage from "../pages/public/LandingPage";

// Admin
import Login from "../pages/admin/Login";
import AdminLayout from "../pages/admin/AdminLayout";
import HomePanel from "../pages/admin/panel/HomePanel";
import AboutPanel from "../pages/admin/panel/AboutPanel";
import OfficialTalentPanel from "../pages/admin/panel/OfficialTalentPanel";
import CreatorPlusPanel from "../pages/admin/panel/CreatorPlusPanel";
import ServicePanel from "../pages/admin/panel/ServicePanel";
import CreatorPanel from "../pages/admin/panel/CreatorPanel";
import ActivityPanel from "../pages/admin/panel/ActivityPanel";
import PricelistPanel from "../pages/admin/panel/PricelistPanel";
import TestimonyPanel from "../pages/admin/panel/TestimonyPanel";
import ContactPanel from "../pages/admin/panel/ContactPanel";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── PUBLIC ── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── ADMIN AUTH ── */}
      <Route path="/admin/login" element={<Login />} />

      {/* ── ADMIN PANEL (protected) ── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<HomePanel />} />
          <Route path="about" element={<AboutPanel />} />
          <Route path="officialTalent" element={<OfficialTalentPanel />} />
          <Route path="creatorPlus" element={<CreatorPlusPanel />} />
          <Route path="service" element={<ServicePanel />} />
          <Route path="creator" element={<CreatorPanel />} />
          <Route path="activity" element={<ActivityPanel />} />
          <Route path="pricelist" element={<PricelistPanel />} />
          <Route path="testimony" element={<TestimonyPanel />} />
          <Route path="contact" element={<ContactPanel />} />
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
