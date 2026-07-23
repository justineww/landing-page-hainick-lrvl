import { useState, useEffect, useRef } from "react";
import { API_URL, BASE_URL } from "../../../utils/api";

// ── Static Data ───────────────────────────────────────────────────────────────
const ABOUT_DATA = {
  companyName: "PT HAINICK KREATIF INDONESIA",
  description:
    "PT HAINICK KREATIF INDONESIA is a premier talent and creator management agency established in 2021. We specialize in discovering, nurturing, and representing talented individuals in various industries, including entertainment, digital content creation, and professional brand partnerships. Our mission is to bridge the gap between exceptional talent and leading brands, ensuring mutual growth and success.",
  services: [
    {
      id: 1,
      title: "Talent Management",
      description:
        "We represent and manage artists, influencers, and digital creators, helping them grow their careers and maximize their potential.",
    },
    {
      id: 2,
      title: "Brand Collaborations",
      description:
        "We connect talents with top-tier brands to create impactful marketing campaigns and endorsements.",
    },
  ],
  vision:
    "To be the leading talent and creator management agency that empowers individuals to reach their highest potential while delivering innovative and inspiring collaborations.",
  missions: [
    "To support and elevate emerging and established talent.",
    "To foster meaningful partnerships between creators and brands.",
    "To stay ahead of industry trends and provide top-tier management solutions.",
  ],
  whyChooseUs:
    "A dedicated team with expertise in talent and brand management. Strong industry connections and collaboration opportunities. Fast response and solution-driven service.",
  socials: {
    whatsapp: "https://wa.me/6282136358570",
    instagram: "https://www.instagram.com/hainickreatif/",
  },
  showcaseVideo: {
    thumbnail:
      "https://images.unsplash.com/photo-1598387993441-a364f854cfc9?w=900&q=80",
    label: "Hainick Talent Showcase",
    sublabel: "Watch our creators in action",
  },
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const WhatsappIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function AboutSection() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);

  // Ref ke elemen video dan wrapper-nya
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);

  const {
    description,
    services,
    vision,
    missions,
    whyChooseUs,
    socials,
    showcaseVideo,
  } = ABOUT_DATA;

  // ── Fetch talent_showcase dari API ────────────────────────────────
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`${API_URL}/hainick-assets`);
        if (!res.ok) throw new Error("Gagal fetch assets");
        const data = await res.json();
        const showcase = data.find(
          (item) => item.image_type === "talent_showcase",
        );
        if (showcase?.image_url) {
          setVideoUrl(`${BASE_URL}${showcase.image_url}`);
        }
      } catch (err) {
        console.error("Gagal memuat video showcase:", err);
      } finally {
        setVideoLoading(false);
      }
    };

    fetchVideo();
  }, []);

  // ── Intersection Observer: autoplay saat video masuk viewport ─────
  useEffect(() => {
    if (!videoUrl || videoLoading) return;

    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video terlihat → play
            video.play().catch(() => {
              // Browser blokir autoplay dengan suara → coba muted
              video.muted = true;
              video.play();
            });
          } else {
            // Video keluar viewport → pause
            video.pause();
          }
        });
      },
      {
        // Mulai play saat 30% video sudah kelihatan
        threshold: 0.3,
      },
    );

    observer.observe(wrapper);

    return () => observer.disconnect();
  }, [videoUrl, videoLoading]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        :root {
          --clr-bg: #ffffff;
          --clr-text: #1a1a1a;
          --clr-muted: #555555;
          --clr-border: #e5e5e5;
          --clr-accent: #2a6f4e;
          --clr-accent-light: #e8f5ee;
          --clr-tag-bg: #f4f4f4;
          --clr-tag-text: #333;
          --radius-btn: 6px;
          --radius-card: 10px;
          --font-display: 'Plus Jakarta Sans', sans-serif;
          --font-body: 'Plus Jakarta Sans', sans-serif;
          --section-max: 1060px;
        }

        .about-root {
          font-family: var(--font-body);
          color: var(--clr-text);
          background: var(--clr-bg);
          padding: 24px 1rem 64px;
          max-width: var(--section-max);
          margin: 0 auto;
          box-sizing: border-box;
        }

        .about-page-title {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 4vw, 2.4rem);
          font-weight: 800;
          margin: 0 0 18px;
          letter-spacing: 0.01em;
          line-height: 1.1;
        }

        .about-desc {
          font-size: clamp(0.875rem, 1.8vw, 0.96rem);
          line-height: 1.75;
          color: var(--clr-muted);
          margin: 0 0 40px;
          font-weight: 300;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: clamp(1.1rem, 2.5vw, 1.35rem);
          font-weight: 700;
          margin: 0 0 14px;
          letter-spacing: -0.02em;
          padding-bottom: 10px;
        }
        .section-title::after {
          content: '';
          display: block;
          width: 36px;
          height: 2px;
          background: #4a4a4a; 
          margin-top: 8px;
          border-radius: 2px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }
        .service-card {
          background: #dce8f5;
          border: 1px solid #ccd9ee;
          border-radius: var(--radius-card);
          padding: 20px 22px;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .service-card:hover {
          box-shadow: 0 6px 24px rgba(42,111,78,0.12);
          transform: translateY(-2px);
        }
        .service-card-title { font-size: 0.92rem; font-weight: 600; margin: 0 0 8px; color: #1a2f5e; }
        .service-card-desc { font-size: 0.865rem; line-height: 1.65; color: var(--clr-muted); margin: 0; font-weight: 300; }

        .vision-box {
          background: var(--clr-tag-bg);
          border-left: 3px solid #1a2f5e;
          border-radius: 0 var(--radius-card) var(--radius-card) 0;
          padding: 18px 22px;
          margin-bottom: 40px;
          font-size: 0.9rem;
          line-height: 1.75;
          color: var(--clr-muted);
          font-style: italic;
        }

        .mission-list { list-style: none; padding: 0; margin: 0 0 40px; display: flex; flex-direction: column; gap: 10px; }
        .mission-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; line-height: 1.65; color: var(--clr-muted); }
        .mission-list li::before { content: '✦'; color: var(--clr-accent); font-size: 0.65rem; margin-top: 5px; flex-shrink: 0; }

        .why-box { font-size: 0.9rem; line-height: 1.75; color: var(--clr-muted); margin-bottom: 32px; }

        .social-buttons { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 48px; }
        .social-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 18px; border: 1.5px solid var(--clr-border);
          border-radius: var(--radius-btn); background: white;
          color: var(--clr-text); font-family: var(--font-body);
          font-size: 0.85rem; font-weight: 500; text-decoration: none;
          cursor: pointer; transition: border-color 0.2s, background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .social-btn:hover { border-color: var(--clr-accent); color: var(--clr-accent); box-shadow: 0 2px 10px rgba(42,111,78,0.1); }
        .social-btn.whatsapp:hover { background: #e8f9ef; }
        .social-btn.instagram:hover { background: #fdf0f8; border-color: #c13584; color: #c13584; }

        /* ── Showcase ── */
        .showcase-wrapper {
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          aspect-ratio: 16/9;
          background: #111;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
        }

        /* skeleton shimmer saat loading */
        .showcase-skeleton {
          width: 100%; height: 100%;
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* Video inline — langsung ditampilkan penuh */
        .showcase-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Overlay info di bawah */
        .showcase-meta {
          position: absolute;
          bottom: 20px;
          left: 24px;
          pointer-events: none;
        }
        .showcase-meta-title { color: white; font-size: 1rem; font-weight: 600; margin: 0 0 2px; text-shadow: 0 1px 6px rgba(0,0,0,0.5); }
        .showcase-meta-sub { color: rgba(255,255,255,0.75); font-size: 0.8rem; margin: 0; }

        /* gradient gelap di bawah supaya teks terbaca */
        .showcase-gradient {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 80px;
          background: linear-gradient(to top, rgba(0,0,0,0.55), transparent);
          pointer-events: none;
        }

        /* badge "no video" */
        .no-video-badge {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 8px; color: rgba(255,255,255,0.45);
          font-size: 0.85rem;
        }
        .no-video-badge span { font-size: 2rem; }

        .about-divider { border: none; border-top: 1px solid var(--clr-border); margin: 0 0 36px; }

        @media (max-width: 600px) {
          .about-root { padding: 36px 18px 48px; }
          .services-grid { grid-template-columns: 1fr; }
          .social-buttons { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <section
        id="about"
        className="about-root"
        style={{ scrollMarginTop: "80px" }}
      >
        {/* Heading */}
        <h1 className="about-page-title">About Hainick</h1>
        <p className="about-desc">{description}</p>
        <hr className="about-divider" />

        {/* Services */}
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          {services.map((s) => (
            <div key={s.id} className="service-card">
              <p className="service-card-title">{s.title}</p>
              <p className="service-card-desc">{s.description}</p>
            </div>
          ))}
        </div>

        {/* Vision */}
        <h2 className="section-title">Our Vision</h2>
        <div className="vision-box">{vision}</div>

        {/* Mission */}
        <h2 className="section-title">Our Mission</h2>
        <ul className="mission-list">
          {missions.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>

        {/* Why Choose Us */}
        <h2 className="section-title">Why Choose Us?</h2>
        <p className="why-box">{whyChooseUs}</p>

        {/* Social Buttons */}
        <div className="social-buttons">
          <a
            href={socials.whatsapp}
            className="social-btn whatsapp"
            target="_blank"
            rel="noreferrer"
          >
            <WhatsappIcon /> Whatsapp
          </a>
          <a
            href={socials.instagram}
            className="social-btn instagram"
            target="_blank"
            rel="noreferrer"
          >
            <InstagramIcon /> Instagram
          </a>
        </div>

        {/* ── Video Showcase (inline autoplay) ── */}
        <div className="showcase-wrapper" ref={wrapperRef}>
          {videoLoading && <div className="showcase-skeleton" />}

          {!videoLoading && videoUrl && (
            <>
              <video
                ref={videoRef}
                className="showcase-video"
                src={videoUrl}
                muted // wajib muted agar browser izinkan autoplay
                loop
                playsInline // penting untuk iOS agar tidak fullscreen
                preload="auto"
              />
              {/* gradient + label */}
              <div className="showcase-gradient" />
              <div className="showcase-meta">
                <p className="showcase-meta-title">{showcaseVideo.label}</p>
                <p className="showcase-meta-sub">{showcaseVideo.sublabel}</p>
              </div>
            </>
          )}

          {!videoLoading && !videoUrl && (
            <div className="no-video-badge">
              <span>🎬</span>
              <p>Video belum tersedia</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
