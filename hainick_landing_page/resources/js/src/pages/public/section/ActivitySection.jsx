import { useState, useEffect, useRef, useCallback } from "react";
import avatarA from "../../../storage/picture/a.png";
import avatarB from "../../../storage/picture/b.png";
import avatarC from "../../../storage/picture/c.png";
import avatarD from "../../../storage/picture/d.png";
import avatarE from "../../../storage/picture/e.png";
import avatarF from "../../../storage/picture/f.png";
import avatarCenter from "../../../storage/picture/center.png";
import { API_URL } from "../../../utils/api";

// ── Interval polling (ms) ─────────────────────────────────────────────────────
const POLL_INTERVAL = 5000;

// ── Avatar placeholder untuk Community section ───────────────────────────────
const AVATARS = [
  { id: 1, src: avatarA },
  { id: 2, src: avatarB },
  { id: 3, src: avatarC },
  { id: 4, src: avatarD },
  { id: 5, src: avatarE },
  { id: 6, src: avatarF },
];

// ── Urutan posisi enum ke slot grid ──────────────────────────────────────────
const SLOT_ORDER = [
  "image_left",
  "image_center",
  "image_right",
  "image_bottom_left",
  "image_bottom_right",
];

const JOIN_LINK = "https://wa.me/6282136358570";

// ── Merge rows: gabungkan baris dengan image_type yang sama ──────────────────
function mergeRows(rawData) {
  const map = {};
  rawData.forEach((item) => {
    const key = item.image_type;
    if (!key || !SLOT_ORDER.includes(key)) return;
    if (!map[key]) {
      map[key] = { ...item };
    } else {
      if (!map[key].image_url && item.image_url)
        map[key].image_url = item.image_url;
      if (!map[key].description && item.description)
        map[key].description = item.description;
      if (item.is_active === 1) map[key].is_active = 1;
    }
  });
  return Object.values(map);
}

// ── ActivitySection ───────────────────────────────────────────────────────────
export default function ActivitySection({ title = "Hainick Update" }) {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Core fetch (tidak reset loading setelah fetch pertama, agar tidak flicker) ──
  const isMounted = useRef(true);

  const fetchData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await fetch(`${API_URL}/updates-section`);
      const data = await res.json();
      if (!isMounted.current) return;

      const raw = Array.isArray(data) ? data : [];
      const merged = mergeRows(raw);
      const activeItems = merged
        .filter((item) => item.is_active === 1)
        .slice(0, 5)
        .sort((a, b) => {
          const ai = SLOT_ORDER.indexOf(a.image_type);
          const bi = SLOT_ORDER.indexOf(b.image_type);
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        });

      setActivities(activeItems);
    } catch (e) {
      console.error("Gagal mengambil data activity:", e);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    // ── 1. Fetch pertama ──
    fetchData(true);

    // ── 2. Polling otomatis ──
    const pollTimer = setInterval(() => fetchData(false), POLL_INTERVAL);

    // ── 3. Refetch saat tab kembali aktif ──
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchData(false);
    };
    const handleFocus = () => fetchData(false);

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted.current = false;
      clearInterval(pollTimer);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchData]);

  const topItems = activities.slice(0, 3);
  const bottomItems = activities.slice(3);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        /* ───── UPDATE SECTION ───── */

        .act-outer {
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 1rem;
          box-sizing: border-box;
        }

        .act-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff;
          padding: 56px 0 0;
          box-sizing: border-box;
        }

        .act-heading {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0a0a0a;
          text-align: left;
          margin: 0 0 24px;
        }

        .act-grid-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .act-row-top {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .act-row-bottom {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        /* ── Activity Card (clickable) ── */
        .act-card {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          background: #111;
          aspect-ratio: 4/3;
          cursor: pointer;
        }

        .act-row-bottom .act-card {
          aspect-ratio: 16/9;
        }

        .act-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .act-card:hover img {
          transform: scale(1.04);
        }

        /* ── Hover overlay hint ── */
        .act-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.72) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 14px;
          pointer-events: none;
        }

        .act-card:hover .act-card-overlay {
          opacity: 1;
        }

        .act-card-hint {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: rgba(255,255,255,0.9);
          font-size: 0.78rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .act-card-hint::before {
          content: '';
          display: block;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.8);
          background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E") center/14px no-repeat;
          flex-shrink: 0;
        }

        /* ── Loading skeleton ── */
        .act-skeleton {
          border-radius: 8px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: act-shimmer 1.5s infinite;
          aspect-ratio: 4/3;
        }
        .act-row-bottom .act-skeleton { aspect-ratio: 16/9; }
        @keyframes act-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Caption teks di bawah grid ── */
        .act-caption {
          margin-top: 20px;
          font-size: 0.875rem;
          line-height: 1.75;
          color: #555;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ── Activity Detail Modal ── */
        .act-modal-bg {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(10, 10, 10, 0.65);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: act-fadein 0.2s ease;
        }
        @keyframes act-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .act-modal {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 560px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.28);
          animation: act-modal-up 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes act-modal-up {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .act-modal-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/9;
          background: #0a0a0a;
          overflow: hidden;
        }

        .act-modal-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .act-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0a0a0a;
          transition: background 0.15s, transform 0.15s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          line-height: 1;
        }
        .act-modal-close:hover {
          background: #fff;
          transform: scale(1.08);
        }

        .act-modal-body {
          padding: 1.5rem 1.6rem 1.8rem;
        }

        .act-modal-desc {
          font-size: 0.925rem;
          line-height: 1.8;
          color: #444;
          margin: 0;
        }

        .act-modal-empty {
          color: #9ca3af;
          font-style: italic;
          font-size: 0.875rem;
        }

        /* ───── COMMUNITY SECTION ───── */

        .community-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #eef0f8;
          border-radius: 20px;
          box-sizing: border-box;
          position: relative;
          padding: 64px 24px;
          text-align: center;
          overflow: hidden;
          margin-top: 56px;
          margin-bottom: 72px;
        }

        .community-title {
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          color: #0a0a0a;
          margin: 0 0 12px;
          position: relative;
          z-index: 1;
        }

        .community-subtitle {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #555;
          margin: 0 auto 32px;
          max-width: 440px;
          position: relative;
          z-index: 1;
        }

        .community-center-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 260px;
        }

        .community-center-avatar {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 8px 32px rgba(13,27,75,0.18);
          position: relative;
          z-index: 2;
        }

        .community-avatar {
          position: absolute;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          z-index: 2;
        }

        .av-1 { top: 8%;  left: 18%; }
        .av-2 { top: 40%; left: 6%;  }
        .av-3 { bottom: 4%; left: 22%; }
        .av-4 { top: 8%;  right: 18%; }
        .av-5 { top: 40%; right: 6%;  }
        .av-6 { bottom: 4%; right: 22%; }

        .community-join-btn {
          display: inline-block;
          padding: 14px 56px;
          background: #0d2b8e;
          color: #fff;
          font-family: inherit;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s ease, transform 0.15s ease;
          letter-spacing: 0.01em;
          position: relative;
          z-index: 1;
          margin-top: 8px;
        }

        .community-join-btn:hover {
          background: #1a3fc4;
          transform: translateY(-2px);
        }

        /* ── Responsive: tablet ── */
        @media (max-width: 768px) {
          .act-row-top { grid-template-columns: repeat(2, 1fr); }
          .act-row-top .act-card:last-child { grid-column: 1 / -1; aspect-ratio: 16/9; }
          .act-root { padding-top: 40px; }
          .community-root { padding: 48px 24px 56px; margin-top: 40px; margin-bottom: 56px; }
          .community-avatar { width: 56px; height: 56px; }
        }

        /* ── Responsive: mobile ── */
        @media (max-width: 480px) {
          .act-row-top, .act-row-bottom { grid-template-columns: 1fr; }
          .act-row-top .act-card:last-child { grid-column: auto; aspect-ratio: 4/3; }
          .act-card, .act-row-bottom .act-card { aspect-ratio: 4/3; }
          .act-grid-wrapper { gap: 8px; }
          .community-root { padding: 40px 24px 48px; }
          .community-avatar { width: 48px; height: 48px; }
          .av-1 { top: 5%;  left: 4%; }
          .av-2 { top: 38%; left: 2%; }
          .av-3 { bottom: 5%; left: 4%; }
          .av-4 { top: 5%;  right: 4%; }
          .av-5 { top: 38%; right: 2%; }
          .av-6 { bottom: 5%; right: 4%; }
        }
      `}</style>

      <div className="act-outer">
        {/* ── Update Section ── */}
        <section
          id="activity"
          className="act-root"
          style={{ scrollMarginTop: "80px" }}
        >
          <h2 className="act-heading">{title}</h2>

          {loading ? (
            <div className="act-grid-wrapper">
              <div className="act-row-top">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="act-skeleton" />
                ))}
              </div>
              <div className="act-row-bottom">
                {[0, 1].map((i) => (
                  <div key={i} className="act-skeleton" />
                ))}
              </div>
            </div>
          ) : activities.length > 0 ? (
            <>
              <div className="act-grid-wrapper">
                {topItems.length > 0 && (
                  <div className="act-row-top">
                    {topItems.map((item) => (
                      <ActivityCard
                        key={item.image_type}
                        item={item}
                        onClick={() => setSelectedActivity(item)}
                      />
                    ))}
                  </div>
                )}
                {bottomItems.length > 0 && (
                  <div className="act-row-bottom">
                    {bottomItems.map((item) => (
                      <ActivityCard
                        key={item.image_type}
                        item={item}
                        onClick={() => setSelectedActivity(item)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Caption teks di bawah grid ── */}
              <p className="act-caption">
                The Hainick team has traveled across Indonesia to Bali,
                Jogjakarta, Surabaya, Medan, and Balikpapan, connecting with
                talented creators in each city. These journeys have allowed us
                to discover unique local talents and showcase the incredible
                creative potential throughout our diverse archipelago. We're
                excited to demonstrate to our partners and clients that
                compelling campaigns can emerge from every corner of Indonesia.
                Thank you to all the amazing communities who welcomed us!
              </p>
            </>
          ) : null}
        </section>

        {/* ── Community / Join Section ── */}
        <div className="community-root">
          <h2 className="community-title">Join our community!</h2>
          <p className="community-subtitle">
            Grow together in a healthy KOL management — not just chasing
            virality.
            <br />
            Get the opportunity to collaborate with brands and events.
          </p>

          <div className="community-center-wrap">
            <img
              className="community-avatar av-1"
              src={AVATARS[0].src}
              alt="creator"
            />
            <img
              className="community-avatar av-2"
              src={AVATARS[1].src}
              alt="creator"
            />
            <img
              className="community-avatar av-3"
              src={AVATARS[2].src}
              alt="creator"
            />
            <img
              className="community-center-avatar"
              src={avatarCenter}
              alt="community"
            />
            <img
              className="community-avatar av-4"
              src={AVATARS[3].src}
              alt="creator"
            />
            <img
              className="community-avatar av-5"
              src={AVATARS[4].src}
              alt="creator"
            />
            <img
              className="community-avatar av-6"
              src={AVATARS[5].src}
              alt="creator"
            />
          </div>

          <a
            className="community-join-btn"
            href={JOIN_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join
          </a>
        </div>
      </div>

      {/* ── Activity Detail Modal ── */}
      {selectedActivity && (
        <div
          className="act-modal-bg"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedActivity(null)
          }
        >
          <div className="act-modal">
            <div className="act-modal-img-wrap">
              <img
                src={`http://localhost:8000${selectedActivity.image_url}`}
                alt={selectedActivity.image_type}
              />
              <button
                className="act-modal-close"
                onClick={() => setSelectedActivity(null)}
              >
                ✕
              </button>
            </div>
            <div className="act-modal-body">
              <p className="act-modal-desc">
                {selectedActivity.description ? (
                  selectedActivity.description
                ) : (
                  <span className="act-modal-empty">
                    Deskripsi belum tersedia.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Activity Card sub-component ───────────────────────────────────────────────
function ActivityCard({ item, onClick }) {
  return (
    <div
      className="act-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
    >
      <img
        src={`http://localhost:8000${item.image_url}`}
        alt={item.image_type}
        loading="lazy"
      />
      <div className="act-card-overlay">
        <span className="act-card-hint">Lihat detail</span>
      </div>
    </div>
  );
}
