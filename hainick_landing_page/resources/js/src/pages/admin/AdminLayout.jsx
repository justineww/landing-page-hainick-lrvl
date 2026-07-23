// src/pages/admin/AdminLayout.jsx
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import hainickLogo from "../../storage/logo/hainick_logo.png";
import { auth } from "../../utils/auth";

const menuItems = [
    { label: "Home", path: "/admin", icon: "⌂" },
    { label: "About Us", path: "/admin/about", icon: "◎" },
    { label: "Official Talent", path: "/admin/officialTalent", icon: "★" },
    { label: "Creator+", path: "/admin/creatorPlus", icon: "+" },
    { label: "Creator", path: "/admin/creator", icon: "✦" },
    { label: "Activity", path: "/admin/activity", icon: "◉" },
    { label: "Testimony", path: "/admin/testimony", icon: "❝" },
    { label: "Contact Us", path: "/admin/contact", icon: "✉" },
];

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth.logout();
        navigate("/admin/login");
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-root {
          display: flex;
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f4f6fb;
        }

        /* ── SIDEBAR ── */
        .sidebar {
          width: 240px;
          min-height: 100vh;
          background: #1a2744;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 200;
          transition: transform 0.3s ease;
        }
        .sidebar-logo {
          padding: 1.6rem 1.5rem 1.2rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .sidebar-logo img {
          height: 24px;
          width: auto;
          display: block;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }
        .sidebar-role {
          font-size: 0.72rem;
          color: #64748b;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-top: 6px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.85rem;
          border-radius: 10px;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          color: #94a3b8;
          transition: background 0.18s, color 0.18s;
        }
        .sidebar-link:hover { background: rgba(255,255,255,0.07); color: #fff; }
        .sidebar-link.active { background: rgba(255,255,255,0.12); color: #fff; font-weight: 700; }
        .sidebar-link .s-icon {
          font-size: 1rem;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .sidebar-footer {
          padding: 1rem 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .logout-btn {
          width: 100%;
          background: rgba(239,68,68,0.12);
          color: #f87171;
          border: none;
          border-radius: 10px;
          padding: 0.65rem 0.85rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          transition: background 0.18s;
        }
        .logout-btn:hover { background: rgba(239,68,68,0.22); }

        /* Sidebar overlay (mobile) */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 199;
        }
        .sidebar-overlay.show { display: block; }

        /* ── TOPBAR ── */
        .topbar {
          position: fixed;
          top: 0;
          left: 240px;
          right: 0;
          height: 60px;
          background: #fff;
          border-bottom: 1px solid #e9ecf0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.8rem;
          z-index: 100;
          box-shadow: 0 1px 8px rgba(26,39,68,0.05);
        }
        .topbar-left { display: flex; align-items: center; gap: 1rem; }
        .topbar-title {
          font-size: 1rem;
          font-weight: 700;
          color: #0a0a0a;
        }
        .hamburger-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          flex-direction: column;
          gap: 5px;
        }
        .hamburger-btn span {
          display: block;
          width: 22px; height: 2px;
          background: #1a2744;
          border-radius: 2px;
        }
        .topbar-admin {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .admin-avatar {
          width: 34px; height: 34px;
          background: #1a2744;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 0.78rem;
          font-weight: 700;
        }
        .admin-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
        }

        /* ── MAIN CONTENT ── */
        .admin-main {
          margin-left: 240px;
          margin-top: 60px;
          padding: 2rem;
          min-height: calc(100vh - 60px);
          width: calc(100% - 240px);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1023px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .topbar {
            left: 0;
          }
          .hamburger-btn {
            display: flex;
          }
          .admin-main {
            margin-left: 0;
            width: 100%;
            padding: 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .admin-main {
            padding: 1rem;
          }
          .topbar {
            padding: 0 1rem;
          }
          .admin-name { display: none; }
        }
      `}</style>

            <div className="admin-root">
                <div
                    className={`sidebar-overlay${sidebarOpen ? " show" : ""}`}
                    onClick={() => setSidebarOpen(false)}
                />

                {/* ── SIDEBAR ── */}
                <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
                    <div className="sidebar-logo">
                        <img src={hainickLogo} alt="Hainick Logo" />
                        <div className="sidebar-role">Admin Panel</div>
                    </div>

                    <nav className="sidebar-nav">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/admin"}
                                className={({ isActive }) =>
                                    `sidebar-link${isActive ? " active" : ""}`
                                }
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="s-icon">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <button className="logout-btn" onClick={handleLogout}>
                            <span>⎋</span> Logout
                        </button>
                    </div>
                </aside>

                {/* ── TOPBAR ── */}
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            className="hamburger-btn"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle sidebar"
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                        <span className="topbar-title">Dashboard</span>
                    </div>
                    <div className="topbar-admin">
                        <div className="admin-avatar">AD</div>
                        <span className="admin-name">Admin</span>
                    </div>
                </header>

                {/* ── PAGE CONTENT ── */}
                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default AdminLayout;
