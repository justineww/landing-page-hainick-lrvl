// src/pages/admin/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hainickLogo from "../../storage/logo/hainick_logo.png";
import { auth } from "../../utils/auth";
import { API_URL } from "../../utils/api";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.username || !form.password) {
            setError("Username dan password wajib diisi.");
            return;
        }

        setLoading(true);

        try {
            // Menghindari double slash jika API_URL memiliki akhiran /
            const cleanApiUrl = API_URL.replace(/\/$/, "");

            const res = await fetch(`${cleanApiUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok && (data.success || !data.error)) {
                // Simpan token/session
                auth.login(data.token);

                // Redirect langsung ke AdminLayout
                navigate("/admin/AdminLayout", { replace: true });
            } else {
                setError(data.error || data.message || "Login gagal.");
            }
        } catch (err) {
            console.error("Login Exception:", err);
            setError("Tidak dapat terhubung ke server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-page {
          min-height: 100vh;
          background: #f4f6fb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 1.5rem;
        }

        .login-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 8px 40px rgba(26,39,68,0.10);
          width: 100%;
          max-width: 420px;
          padding: 2.8rem 2.4rem;
        }

        .login-logo img {
          height: 28px;
          width: auto;
          display: block;
          margin-bottom: 0.3rem;
          object-fit: contain;
        }

        .login-subtitle {
          font-size: 0.85rem;
          color: #888;
          margin-bottom: 2rem;
        }

        .login-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.45rem;
          letter-spacing: 0.01em;
        }

        .login-input-wrap {
          position: relative;
          margin-bottom: 1.2rem;
        }

        .login-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem;
          color: #111;
          background: #fafafa;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input:focus {
          border-color: #1a2744;
          box-shadow: 0 0 0 3px rgba(26,39,68,0.08);
          background: #fff;
        }

        .toggle-pass {
          position: absolute;
          right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer;
          color: #9ca3af;
          font-size: 0.8rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          padding: 2px 4px;
        }

        .login-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          border-radius: 8px;
          padding: 0.65rem 0.9rem;
          font-size: 0.82rem;
          margin-bottom: 1.2rem;
        }

        .login-btn {
          width: 100%;
          background: #1a2744;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.85rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          letter-spacing: 0.01em;
        }
        .login-btn:hover:not(:disabled) { background: #263660; transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        @media (max-width: 480px) {
          .login-card { padding: 2rem 1.4rem; }
        }
      `}</style>

            <div className="login-page">
                <div className="login-card">
                    <div className="login-logo">
                        <img src={hainickLogo} alt="Hainick Logo" />
                    </div>
                    <p className="login-subtitle">
                        Admin Panel — Masuk untuk melanjutkan
                    </p>

                    <form onSubmit={handleSubmit} noValidate>
                        <label className="login-label" htmlFor="username">
                            Username
                        </label>
                        <div className="login-input-wrap">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                className="login-input"
                                placeholder="admin"
                                value={form.username}
                                onChange={handleChange}
                                autoComplete="username"
                            />
                        </div>

                        <label className="login-label" htmlFor="password">
                            Password
                        </label>
                        <div className="login-input-wrap">
                            <input
                                id="password"
                                name="password"
                                type={showPass ? "text" : "password"}
                                className="login-input"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                                style={{ paddingRight: "3.5rem" }}
                            />
                            <button
                                type="button"
                                className="toggle-pass"
                                onClick={() => setShowPass(!showPass)}
                            >
                                {showPass ? "Hide" : "Show"}
                            </button>
                        </div>

                        {error && <div className="login-error">{error}</div>}

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                        >
                            {loading ? "Memverifikasi..." : "Masuk"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
