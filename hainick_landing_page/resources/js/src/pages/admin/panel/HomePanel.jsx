import { useState, useEffect, useRef } from "react";
import { API_URL, BASE_URL } from "../../../utils/api";

const HomePanel = () => {
    const [heroUrl, setHeroUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const fileRef = useRef();

    const fetchHero = () => {
        setLoading(true);
        fetch(`${API_URL}/hainick-assets`)
            .then((res) => res.json())
            .then((data) => {
                const hero = data.find(
                    (item) => item.image_type === "hero_banner",
                );
                setHeroUrl(
                    hero?.image_url ? `${BASE_URL}${hero.image_url}` : null,
                );
            })
            .catch(() =>
                setMessage({
                    type: "error",
                    text: "Gagal memuat data dari server.",
                }),
            )
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchHero();
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMessage({ type: "error", text: "File harus berupa gambar." });
            return;
        }

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("image_type", "hero_banner");
        formData.append("image", file);

        try {
            const url = heroUrl
                ? `${API_URL}/update-hainick-assets/hero_banner`
                : `${API_URL}/create-hainick-assets`;

            const method = heroUrl ? "PUT" : "POST";

            const res = await fetch(url, { method, body: formData });

            if (res.ok) {
                setMessage({
                    type: "success",
                    text: "Hero banner berhasil diperbarui!",
                });
                fetchHero();
            } else {
                const data = await res.json();
                setMessage({
                    type: "error",
                    text: data.error || "Gagal mengunggah gambar.",
                });
            }
        } catch {
            setMessage({
                type: "error",
                text: "Tidak dapat terhubung ke server.",
            });
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .panel-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .panel-header-left { display: flex; flex-direction: column; gap: 2px; }
        .panel-page-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
        }
        .panel-page-sub { font-size: 0.82rem; color: #9ca3af; }

        .panel-add-btn {
          background: #1a2744;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.6rem 1.2rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: background 0.2s, transform 0.15s;
        }
        .panel-add-btn:hover:not(:disabled) { background: #263660; transform: translateY(-1px); }
        .panel-add-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        .panel-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e9ecf0;
          overflow: hidden;
        }
        .panel-card-header {
          padding: 1.1rem 1.4rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .panel-card-title { font-size: 0.9rem; font-weight: 700; color: #1a2744; }

        .hero-preview-wrap {
          padding: 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .hero-preview-img {
          width: 100%;
          max-height: 340px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid #e9ecf0;
          display: block;
        }

        .hero-empty {
          width: 100%;
          height: 200px;
          border-radius: 12px;
          border: 2px dashed #e5e7eb;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-size: 0.88rem;
          gap: 0.4rem;
        }
        .hero-empty-icon { font-size: 2rem; }

        .hero-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .hero-meta-info { display: flex; flex-direction: column; gap: 2px; }
        .hero-meta-label { font-size: 0.75rem; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .hero-meta-val { font-size: 0.85rem; color: #374151; font-weight: 500; word-break: break-all; }

        .badge-type {
          display: inline-block;
          padding: 0.2rem 0.65rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 700;
          background: #dbeafe;
          color: #1d4ed8;
        }

        .alert {
          padding: 0.65rem 1rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          margin: 0 1.4rem 1.4rem;
        }
        .alert-success { background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0; }
        .alert-error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }

        .skeleton {
          width: 100%;
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 12px;
        }
        @keyframes shimmer { to { background-position: -200% 0; } }

        @media (max-width: 600px) {
          .hero-preview-img { max-height: 200px; }
        }
      `}</style>

            <div className="panel-wrap">
                <div className="panel-header">
                    <div className="panel-header-left">
                        <h1 className="panel-page-title">⌂ Home</h1>
                        <p className="panel-page-sub">
                            Kelola hero banner landing page
                        </p>
                    </div>
                    <button
                        className="panel-add-btn"
                        onClick={() => fileRef.current.click()}
                        disabled={uploading || loading}
                    >
                        {uploading
                            ? "Mengunggah..."
                            : heroUrl
                              ? "🔄 Ganti Banner"
                              : "+ Upload Banner"}
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </div>

                {message && (
                    <div
                        className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="panel-card">
                    <div className="panel-card-header">
                        <span className="panel-card-title">Hero Banner</span>
                        <span className="badge-type">hero_banner</span>
                    </div>

                    <div className="hero-preview-wrap">
                        {loading ? (
                            <div className="skeleton" />
                        ) : heroUrl ? (
                            <>
                                <img
                                    className="hero-preview-img"
                                    src={heroUrl}
                                    alt="Hero Banner Preview"
                                />
                                <div className="hero-meta">
                                    <div className="hero-meta-info">
                                        <span className="hero-meta-label">
                                            URL Gambar
                                        </span>
                                        <span className="hero-meta-val">
                                            {heroUrl}
                                        </span>
                                    </div>
                                    <button
                                        className="panel-add-btn"
                                        style={{ background: "#dc2626" }}
                                        onClick={() => fileRef.current.click()}
                                        disabled={uploading}
                                    >
                                        {uploading
                                            ? "Mengunggah..."
                                            : "🔄 Ganti"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="hero-empty">
                                <span className="hero-empty-icon">🖼️</span>
                                <span>Belum ada hero banner.</span>
                                <span>
                                    Klik <strong>+ Upload Banner</strong> untuk
                                    mengunggah.
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePanel;
