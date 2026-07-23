import { Routes, Route, Navigate } from "react-router-dom";

// ── IMPORT HALAMAN PUBLIC ──
import LandingPage from "./pages/public/LandingPage";

// ── IMPORT HALAMAN ADMIN ──
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";

// ── IMPORT PANEL ADMIN (Sesuaikan path jika Anda menyimpan di folder terpisah) ──
import HomePanel from "./pages/admin/panel/HomePanel";
import AboutPanel from "./pages/admin/panel/AboutPanel";
import OfficialTalentPanel from "./pages/admin/panel/OfficialTalentPanel";
import CreatorPlusPanel from "./pages/admin/panel/CreatorPlusPanel";
import CreatorPanel from "./pages/admin/panel/CreatorPanel";
import ActivityPanel from "./pages/admin/panel/ActivityPanel";
import TestimonyPanel from "./pages/admin/panel/TestimonyPanel";
import ContactPanel from "./pages/admin/panel/ContactPanel";

function App() {
    return (
        <Routes>
            {/* ── HALAMAN PUBLIC ── */}
            <Route path="/" element={<LandingPage />} />

            {/* ── HALAMAN LOGIN ADMIN ── */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ── NESTED ROUTES ADMIN PANEL ── */}
            {/* Tanda '/*' penting agar rute anak di dalam AdminLayout dapat diakses */}
            <Route path="/admin/*" element={<AdminLayout />}>
                {/* index merujuk ke rute utama "/admin" (HomePanel) */}
                <Route index element={<HomePanel />} />
                <Route path="about" element={<AboutPanel />} />
                <Route
                    path="officialTalent"
                    element={<OfficialTalentPanel />}
                />
                <Route path="creatorPlus" element={<CreatorPlusPanel />} />
                <Route path="creator" element={<CreatorPanel />} />
                <Route path="activity" element={<ActivityPanel />} />
                <Route path="testimony" element={<TestimonyPanel />} />
                <Route path="contact" element={<ContactPanel />} />
            </Route>

            {/* ── FALLBACK 404 / ROUTE TIDAK DITEMUKAN ── */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
