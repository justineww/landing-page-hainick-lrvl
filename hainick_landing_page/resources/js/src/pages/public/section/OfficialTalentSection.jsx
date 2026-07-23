import { useState, useEffect, useRef, useCallback } from "react";
import { API_URL } from "../../../utils/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
/**
 * Format follower ke gaya Indonesia (koma sebagai desimal), misal 15700 -> "15,7K"
 */
const formatFollowersID = (val) => {
    const num = Number(val);
    if (!val || isNaN(num) || num === 0) return "—";
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(".", ",") + "M";
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(".", ",") + "K";
    }
    return String(num);
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const IGIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

const TikTokIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.75a4.85 4.85 0 01-1-.06z" />
    </svg>
);

const TwitterIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const EyeIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="15 18 9 12 15 6" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const UserPlaceholderIcon = () => (
    <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1.5"
    >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

// ── Talent Photo Card ─────────────────────────────────────────────────────────
const TalentPhotoCard = ({ talent, onClick }) => {
    const [imgError, setImgError] = useState(false);
    const photo = talent?.image_url ? `${API_URL}${talent.image_url}` : null;
    const showFallback = !photo || imgError;

    return (
        <button
            className="ot-card"
            onClick={onClick}
            type="button"
            aria-label={`Lihat detail ${talent?.nama || "talent"}`}
        >
            <div className="ot-card-photo-wrap">
                {showFallback ? (
                    <div className="ot-card-fallback" aria-hidden="true">
                        <UserPlaceholderIcon />
                    </div>
                ) : (
                    <img
                        src={photo}
                        alt={talent?.nama || "Talent Hainick"}
                        className="ot-card-img"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                )}
                <div className="ot-card-overlay">
                    <span className="ot-card-hint">
                        <EyeIcon /> Lihat Profil
                    </span>
                </div>
            </div>
        </button>
    );
};

// ── Modal Detail Talent ───────────────────────────────────────────────────────
const OfficialTalentModal = ({ talentId, thumbnailUrl, onClose }) => {
    const [desc, setDesc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDetail = useCallback(() => {
        const controller = new AbortController();
        setLoading(true);
        setError("");

        fetch(`${API_URL}/load-official-talent-desc/${talentId}`, {
            method: "GET",
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) throw new Error("Gagal memuat detail talent");
                return res.json();
            })
            .then((data) => {
                const item = Array.isArray(data) ? data[0] : data;
                setDesc(item || null);
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    setError(
                        err.message || "Terjadi kesalahan saat memuat data.",
                    );
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [talentId]);

    useEffect(() => {
        const cancelFetch = loadDetail();
        return () => cancelFetch();
    }, [loadDetail]);

    // Kunci scroll body & dukung tombol Escape selama modal terbuka
    useEffect(() => {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener("keydown", handleKey);
        };
    }, [onClose]);

    const photo = desc?.image_url
        ? `${API_URL}${desc.image_url}`
        : thumbnailUrl;
    const hasPhysical = desc?.tinggi || desc?.berat || desc?.umur;

    return (
        <div
            className="ot-modal-backdrop"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ot-modal-title"
        >
            <div className="ot-modal-box" onClick={(e) => e.stopPropagation()}>
                <button
                    className="ot-modal-close"
                    onClick={onClose}
                    aria-label="Tutup detail talent"
                    type="button"
                >
                    ✕
                </button>

                {loading ? (
                    <div className="ot-modal-loading">
                        <div className="ot-skel ot-skel-photo" />
                        <div className="ot-modal-loading-info">
                            <div
                                className="ot-skel"
                                style={{ width: "70%", height: 24 }}
                            />
                            <div
                                className="ot-skel"
                                style={{
                                    width: "100%",
                                    height: 14,
                                    marginTop: 16,
                                }}
                            />
                            <div
                                className="ot-skel"
                                style={{
                                    width: "90%",
                                    height: 14,
                                    marginTop: 8,
                                }}
                            />
                            <div
                                className="ot-skel"
                                style={{
                                    width: "60%",
                                    height: 14,
                                    marginTop: 8,
                                }}
                            />
                            <div
                                className="ot-skel"
                                style={{
                                    width: "80%",
                                    height: 36,
                                    marginTop: 24,
                                }}
                            />
                        </div>
                    </div>
                ) : error ? (
                    <div className="ot-modal-error-wrap">
                        <p className="ot-modal-error">{error}</p>
                        <button
                            className="ot-retry-btn"
                            onClick={loadDetail}
                            type="button"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : (
                    <div className="ot-modal-content">
                        <div className="ot-modal-photo-wrap">
                            {photo ? (
                                <img
                                    src={photo}
                                    alt={desc?.nama || "Talent"}
                                    className="ot-modal-photo"
                                />
                            ) : (
                                <div className="ot-modal-photo-fallback">
                                    <UserPlaceholderIcon />
                                </div>
                            )}
                        </div>

                        <div className="ot-modal-info">
                            <h3 id="ot-modal-title" className="ot-modal-name">
                                {desc?.nama?.trim() || "Talent Hainick"}
                            </h3>

                            {desc?.bio && (
                                <p className="ot-modal-bio">{desc.bio}</p>
                            )}

                            <div className="ot-modal-socials">
                                <div className="ot-social-stat">
                                    <span className="ot-social-label">
                                        <IGIcon /> Instagram
                                    </span>
                                    <span className="ot-social-count">
                                        {formatFollowersID(desc?.followers_ig)}
                                    </span>
                                </div>
                                <div className="ot-social-stat">
                                    <span className="ot-social-label">
                                        <TikTokIcon /> TikTok
                                    </span>
                                    <span className="ot-social-count">
                                        {formatFollowersID(
                                            desc?.followers_tiktok,
                                        )}
                                    </span>
                                </div>
                                <div className="ot-social-stat">
                                    <span className="ot-social-label">
                                        <TwitterIcon /> Twitter
                                    </span>
                                    <span className="ot-social-count">
                                        {formatFollowersID(
                                            desc?.followers_twitter,
                                        )}
                                    </span>
                                </div>
                            </div>

                            {hasPhysical && (
                                <div className="ot-modal-physical">
                                    {desc?.tinggi && (
                                        <span>{desc.tinggi} cm</span>
                                    )}
                                    {desc?.berat && (
                                        <span>{desc.berat} kg</span>
                                    )}
                                    {desc?.umur && <span>{desc.umur} thn</span>}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Section Utama ─────────────────────────────────────────────────────────────
export default function OfficialTalentSection() {
    const [talents, setTalents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selected, setSelected] = useState(null);

    const scrollRef = useRef(null);
    const [canLeft, setCanLeft] = useState(false);
    const [canRight, setCanRight] = useState(false);

    const fetchTalents = useCallback(() => {
        const controller = new AbortController();
        setLoading(true);
        setError("");

        fetch(`${API_URL}/load-official-talent`, {
            method: "GET",
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok)
                    throw new Error(`Gagal mengambil data (${res.status})`);
                return res.json();
            })
            .then((data) => setTalents(Array.isArray(data) ? data : []))
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Gagal fetch official talent:", err);
                    setError(
                        err.message ||
                            "Terjadi kesalahan saat memuat data talent.",
                    );
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, []);

    useEffect(() => {
        const cancelFetch = fetchTalents();
        return () => cancelFetch();
    }, [fetchTalents]);

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanLeft(el.scrollLeft > 4);
        setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        updateScrollState();
        window.addEventListener("resize", updateScrollState);
        return () => window.removeEventListener("resize", updateScrollState);
    }, [talents, loading, updateScrollState]);

    const handleScrollBy = (dir) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * (el.clientWidth * 0.7), behavior: "smooth" });
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --navy: #1a2744;
          --navy-light: #263660;
          --accent: #4f7cff;
          --accent-soft: #eef2ff;
          --danger: #ef4444;
          --border: #e9ecf0;
          --muted: #9ca3af;
          --text: #1e293b;
          --bg: #f4f6fb;
          --font: 'Plus Jakarta Sans', sans-serif;
          --radius: 16px;
          --shadow: 0 4px 20px rgba(26,39,68,0.08);
        }

        .ot-root {
          font-family: var(--font);
          background: #ffffff;
          padding: 48px 1rem 72px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .ot-title {
          font-size: clamp(1.3rem, 3vw, 1.9rem);
          font-weight: 800;
          letter-spacing: 0.01em;
          color: var(--navy);
          text-align: center;
          margin: 0 0 36px;
        }

        .ot-error-block {
          text-align: center;
          padding: 2.5rem 1rem;
          color: var(--danger);
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .ot-retry-btn {
          background: var(--navy);
          color: #fff;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .ot-retry-btn:hover { background: var(--accent); }

        .ot-empty-block {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--muted);
          font-size: 0.9rem;
          border: 1.5px dashed var(--border);
          border-radius: var(--radius);
        }

        /* ── Carousel / Grid ── */
        .ot-scroll-outer { position: relative; }

        .ot-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #ffffff;
          border: 1.5px solid var(--border);
          box-shadow: var(--shadow);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
          color: var(--navy);
          transition: background 0.2s, color 0.2s, transform 0.2s;
        }
        .ot-nav:hover { background: var(--accent-soft); color: var(--accent); transform: translateY(-50%) scale(1.05); }
        .ot-nav:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .ot-nav-left { left: -12px; }
        .ot-nav-right { right: -12px; }

        .ot-grid {
          display: grid;
          grid-auto-flow: column;
          grid-template-rows: repeat(2, 1fr);
          grid-auto-columns: 160px;
          gap: 16px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scroll-snap-type: x proximity;
          padding: 6px 4px 12px;
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .ot-grid::-webkit-scrollbar { display: none; }

        .ot-card {
          scroll-snap-align: start;
          border: 1.5px solid var(--border);
          background: none;
          padding: 0;
          cursor: pointer;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .ot-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(26,39,68,0.12);
          border-color: rgba(79,124,255,0.3);
        }
        .ot-card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .ot-card-photo-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          background: var(--bg);
        }
        .ot-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          filter: grayscale(100%) contrast(1.03);
          transition: filter 0.4s ease, transform 0.4s ease;
        }
        .ot-card:hover .ot-card-img { filter: grayscale(0%); transform: scale(1.05); }

        .ot-card-fallback {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--navy), var(--navy-light));
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ot-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,15,30,0.72), transparent 60%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .ot-card:hover .ot-card-overlay { opacity: 1; }

        .ot-card-hint {
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 5px;
          padding-bottom: 12px;
        }

        .ot-skel-card {
          border-radius: 14px;
          aspect-ratio: 1 / 1;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: otShimmer 1.4s infinite;
          scroll-snap-align: start;
        }
        @keyframes otShimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Modal ── */
        .ot-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10,15,30,0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: otFadeIn 0.2s ease;
        }
        @keyframes otFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .ot-modal-box {
          position: relative;
          background: #ffffff;
          border-radius: 20px;
          width: 100%;
          max-width: 650px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 2rem;
          box-shadow: 0 24px 64px rgba(10,15,30,0.22);
          animation: otSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes otSlideUp {
          from { transform: translateY(24px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }

        .ot-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: var(--bg);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          transition: background 0.15s, color 0.15s;
        }
        .ot-modal-close:hover { background: var(--border); color: var(--navy); }

        .ot-modal-content { display: flex; gap: 1.75rem; align-items: flex-start; }
        @media (max-width: 600px) { .ot-modal-content { flex-direction: column; } }

        .ot-modal-photo-wrap {
          flex: 0 0 200px;
          width: 200px;
          height: 200px;
          border-radius: 14px;
          overflow: hidden;
          background: var(--bg);
        }
        @media (max-width: 600px) {
          .ot-modal-photo-wrap { width: 100%; flex-basis: auto; height: 220px; }
        }
        .ot-modal-photo { width: 100%; height: 100%; object-fit: cover; display: block; }
        .ot-modal-photo-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--navy);
        }

        .ot-modal-info { flex: 1; min-width: 0; padding-top: 4px; }
        .ot-modal-name {
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          color: var(--navy);
          margin: 0 0 10px;
        }
        .ot-modal-bio { font-size: 0.88rem; line-height: 1.65; color: var(--text); margin: 0 0 20px; }

        .ot-modal-socials {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          padding-bottom: 16px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        .ot-social-stat { display: flex; flex-direction: column; gap: 4px; }
        .ot-social-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--muted);
        }
        .ot-social-count { font-size: 1.25rem; font-weight: 800; color: var(--navy); }

        .ot-modal-physical {
          display: flex;
          gap: 1.2rem;
          font-size: 0.88rem;
          color: var(--text);
          font-weight: 600;
        }

        .ot-modal-loading { display: flex; gap: 1.75rem; }
        @media (max-width: 600px) { .ot-modal-loading { flex-direction: column; } }
        .ot-modal-loading-info { flex: 1; display: flex; flex-direction: column; }
        .ot-skel {
          border-radius: 8px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: otShimmer 1.4s infinite;
        }
        .ot-skel-photo { width: 200px; height: 200px; border-radius: 14px; flex-shrink: 0; }
        @media (max-width: 600px) { .ot-skel-photo { width: 100%; height: 220px; } }

        .ot-modal-error-wrap { text-align: center; padding: 2rem 0; }
        .ot-modal-error { color: var(--danger); font-size: 0.88rem; font-weight: 500; margin-bottom: 12px; }

        @media (max-width: 600px) {
          .ot-grid { grid-template-rows: repeat(1, 1fr); grid-auto-columns: 135px; }
          .ot-nav { width: 36px; height: 36px; }
          .ot-nav-left { left: 0px; }
          .ot-nav-right { right: 0px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ot-card, .ot-card-img, .ot-card-overlay, .ot-modal-backdrop, .ot-modal-box {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

            <section
                id="officialTalent"
                className="ot-root"
                style={{ scrollMarginTop: "80px" }}
            >
                <h2 className="ot-title">Official Talent Hainick</h2>

                {error ? (
                    <div className="ot-error-block">
                        <p>{error}</p>
                        <button
                            className="ot-retry-btn"
                            onClick={fetchTalents}
                            type="button"
                        >
                            Coba Lagi
                        </button>
                    </div>
                ) : loading ? (
                    <div className="ot-scroll-outer">
                        <div className="ot-grid">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div className="ot-skel-card" key={i} />
                            ))}
                        </div>
                    </div>
                ) : talents.length === 0 ? (
                    <div className="ot-empty-block">
                        Belum ada talent yang ditambahkan.
                    </div>
                ) : (
                    <div className="ot-scroll-outer">
                        {canLeft && (
                            <button
                                className="ot-nav ot-nav-left"
                                onClick={() => handleScrollBy(-1)}
                                aria-label="Geser ke sebelumnya"
                                type="button"
                            >
                                <ChevronLeftIcon />
                            </button>
                        )}
                        <div
                            className="ot-grid"
                            ref={scrollRef}
                            onScroll={updateScrollState}
                        >
                            {talents.map((t) => (
                                <TalentPhotoCard
                                    key={t.id}
                                    talent={t}
                                    onClick={() => setSelected(t)}
                                />
                            ))}
                        </div>
                        {canRight && (
                            <button
                                className="ot-nav ot-nav-right"
                                onClick={() => handleScrollBy(1)}
                                aria-label="Geser ke selanjutnya"
                                type="button"
                            >
                                <ChevronRightIcon />
                            </button>
                        )}
                    </div>
                )}
            </section>

            {selected && (
                <OfficialTalentModal
                    talentId={selected.id}
                    thumbnailUrl={
                        selected.image_url
                            ? `${API_URL}${selected.image_url}`
                            : null
                    }
                    onClose={() => setSelected(null)}
                />
            )}
        </>
    );
}
