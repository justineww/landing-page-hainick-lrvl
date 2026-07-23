import { useState, useEffect } from "react";
import { API_URL, BASE_URL } from "../../../utils/api";

const FALLBACK_IMG =
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=90";

const HomeSection = () => {
    const [heroImage, setHeroImage] = useState(FALLBACK_IMG);

    useEffect(() => {
        fetch(`${API_URL}/hainick-assets`)
            .then((res) => res.json())
            .then((data) => {
                const hero = data.find(
                    (item) => item.image_type === "hero_banner",
                );
                if (hero?.image_url) {
                    setHeroImage(`${BASE_URL}${hero.image_url}`);
                }
            })
            .catch((err) => console.error("Gagal memuat hero banner:", err));
    }, []);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }

        .hero-card {
          position: relative;
          width: 100%;
          max-width: 1060px;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 8px 48px rgba(0,0,0,0.10);
          animation: scaleIn 0.9s cubic-bezier(0.22,1,0.36,1) both;
          animation-delay: 0.3s;
        }

        .hero-img {
          width: 100%;
          height: 520px;
          object-fit: cover;
          object-position: center 20%;
          display: block;
        }

        .hero-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(255,255,255,0.82) 0%,
            rgba(255,255,255,0.45) 42%,
            rgba(255,255,255,0.02) 70%,
            transparent 100%
          );
        }

        .hero-text {
          position: absolute;
          top: 0; left: 0; right: 0;
          padding: 2.8rem 1.5rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .hero-sub {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem;
          font-weight: 400;
          color: #555;
          text-align: center;
          max-width: 460px;
          line-height: 1.65;
          animation: fadeUp 0.7s ease both;
          animation-delay: 0.72s;
        }

        @media (max-width: 768px) {
          .hero-img { height: 400px; object-position: center top; }
          .hero-text { padding: 2rem 1rem 0; gap: 0.75rem; }
          .hero-sub  { font-size: 0.9rem; max-width: 320px; }
        }

        @media (max-width: 480px) {
          .hero-card { border-radius: 14px; }
          .hero-img  { height: 320px; }
          .hero-text { padding: 1.4rem 0.75rem 0; gap: 0.6rem; }
          .hero-sub  { font-size: 0.82rem; max-width: 260px; }
        }
      `}</style>

            <section
                id="home"
                style={{
                    minHeight: "60vh",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    padding: "80px 1rem 0",
                }}
            >
                <div className="hero-card">
                    <img
                        className="hero-img"
                        src={heroImage}
                        alt="Hainick Creative Team"
                    />
                    <div className="hero-overlay" />
                    <div className="hero-text"></div>
                </div>
            </section>
        </>
    );
};

export default HomeSection;
