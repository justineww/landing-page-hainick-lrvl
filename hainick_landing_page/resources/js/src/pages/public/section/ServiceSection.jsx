// ServiceSection.jsx
// TODO: Replace DUMMY_SERVICES with API call from backend
// Editable fields per card: icon (type), title, description

// ── Icons ─────────────────────────────────────────────────────────────────────
const BuzzerIcon = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 010 7.07" />
    <path d="M19.07 4.93a10 10 0 010 14.14" />
  </svg>
);

const VideoIcon = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="15" height="10" rx="2" />
    <path d="M17 9l5-2v10l-5-2V9z" />
  </svg>
);

const StoreIcon = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l1-5h16l1 5" />
    <path d="M3 9a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0 2 2 0 004 0" />
    <path d="M5 9v11h14V9" />
    <path d="M9 21v-6h6v6" />
  </svg>
);

const StarIcon = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="44"
    height="44"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// Map icon key → component
const ICON_MAP = {
  buzzer: <BuzzerIcon />,
  video: <VideoIcon />,
  store: <StoreIcon />,
  star: <StarIcon />,
  users: <UsersIcon />,
  calendar: <CalendarIcon />,
};

// ── Dummy Data (TODO: ganti dengan fetch API backend) ─────────────────────────
const DUMMY_SERVICES = [
  {
    id: 1,
    icon: "buzzer",
    title: "Buzzer",
    description:
      "We provide buzzer for comment, likes, follow and repost. Our buzzer is organic. We will share report for the campaign.",
  },
  {
    id: 2,
    icon: "video",
    title: "Review product",
    description:
      "We have 10,000++ content creator TikTok and Instagram, start followers 1000. This is category for Nano kol until makro kol. They can produce video with product and they have a good quality video.",
  },
  {
    id: 3,
    icon: "store",
    title: "Visit event/store",
    description:
      "We have 10,000++ content creator tiktok and instagram, start followers 1000. This is category for Nano kol until makro kol. They can visit store and event, include produce video with product and they have a good quality video.",
  },
];

// ── ServiceCard ───────────────────────────────────────────────────────────────
function ServiceCard({ service, isLast }) {
  return (
    <div className={`svc-card ${isLast ? "no-border" : ""}`}>
      <div className="svc-icon">{ICON_MAP[service.icon] ?? <StarIcon />}</div>
      <h3 className="svc-title">{service.title}</h3>
      <p className="svc-desc">{service.description}</p>
    </div>
  );
}

// ── ServiceSection ────────────────────────────────────────────────────────────
export default function ServiceSection() {
  // TODO: ganti DUMMY_SERVICES dengan data dari API
  const services = DUMMY_SERVICES;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .svc-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff;
          padding: 56px 1rem 72px;
          max-width: 1060px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .svc-heading {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0a0a0a;
          text-align: center;
          margin: 0 0 56px;
        }

        /* ── Grid ── */
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        /* ── Card ── */
        .svc-card {
          padding: 0 40px 0;
          border-right: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }
        .svc-card:first-child { padding-left: 0; }
        .svc-card.no-border { border-right: none; }

        .svc-icon {
          color: #0a0a0a;
          line-height: 0;
        }

        .svc-title {
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #0a0a0a;
          margin: 0;
        }

        .svc-desc {
          font-size: 0.875rem;
          line-height: 1.75;
          color: #555;
          font-weight: 400;
          margin: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .svc-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .svc-card {
            padding: 32px 0;
            border-right: none;
            border-bottom: 1px solid #e0e0e0;
          }
          .svc-card.no-border { border-bottom: none; }
          .svc-card:first-child { padding-top: 0; }
        }

        @media (max-width: 480px) {
          .svc-root { padding: 40px 1rem 56px; }
          .svc-heading { margin-bottom: 40px; }
        }
      `}</style>

      <section
        id="services"
        className="svc-root"
        style={{ scrollMarginTop: "80px" }}
      >
        <h2 className="svc-heading">Our Service</h2>
        <div className="svc-grid">
          {services.map((s, i) => (
            <ServiceCard
              key={s.id}
              service={s}
              isLast={i === services.length - 1}
            />
          ))}
        </div>
      </section>
    </>
  );
}
