// =============================================
// ICONS (SVG)
// =============================================

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

const ICON_MAP = {
  buzzer: BuzzerIcon,
  video: VideoIcon,
  store: StoreIcon,
};

// =============================================
// KONFIGURASI - Edit sesuai kebutuhan Anda
// =============================================

const WA_NUMBER = "6282136358570";

const CARDS = [
  {
    id: 1,
    icon: "buzzer",
    title: "Buzzer",
    buttonText: "Get the Buzzer Package",
    waMessage: "Halo, saya tertarik dengan paket Buzzer!",
    tiers: [
      {
        price: "IDR 5.000.000",
        label: null,
        features: [
          "200 Buzzer organik",
          "Likes",
          "Follow",
          "Repost",
          "Comment",
          "No Hate comment",
          "No black campaign",
        ],
      },
    ],
    footNote: null,
  },
  {
    id: 2,
    icon: "video",
    title: "Review Product",
    buttonText: "Get a Review Pack",
    waMessage: "Halo, saya tertarik dengan paket Review Product!",
    tiers: [
      {
        price: "IDR 3.500.000",
        label: "10 KOL",
        features: [
          "Nano kol IG/TIKTOK",
          "Start 1000 followers",
          "Post 1x video",
          "Revise 1x",
        ],
      },
      {
        price: "IDR 5.000.000",
        label: "10 KOL",
        features: [
          "Micro kol IG/TIKTOK",
          "Start 10K followers",
          "Post 1x video",
          "Revise 1x",
        ],
      },
    ],
    footNote: "*Min take 10 KOL per package",
  },
  {
    id: 3,
    icon: "store",
    title: "Visit Event/Store",
    buttonText: "Get a Visit Package",
    waMessage: "Halo, saya tertarik dengan paket Visit Event/Store!",
    tiers: [
      {
        price: "IDR 5.000.000",
        label: "10 KOL",
        features: [
          "Nano kol IG/TIKTOK",
          "Start 1000 followers",
          "Upload 1x video",
          "Revise 1x",
        ],
      },
      {
        price: "IDR 6.500.000",
        label: "10 KOL",
        features: [
          "Micro kol IG/TIKTOK",
          "Start 10K followers",
          "Post 1x video",
          "Revise 1x",
        ],
      },
    ],
    footNote: "*Min take 10 KOL per package",
  },
];

// =============================================
// KOMPONEN CARD
// =============================================

function PriceCard({ card }) {
  const Icon = ICON_MAP[card.icon] ?? BuzzerIcon;

  const handleWA = () => {
    const encoded = encodeURIComponent(card.waMessage);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, "_blank");
  };

  return (
    <div className="price-card">
      <div className="card-top">
        <div className="card-icon">
          <Icon />
        </div>
        <h2 className="card-title">{card.title}</h2>
        <button className="wa-button" onClick={handleWA}>
          {card.buttonText}
        </button>
      </div>

      <hr className="card-divider" />

      <div className="tiers-container">
        {card.tiers.map((tier, idx) => (
          <div key={idx} className={idx > 0 ? "tier-section" : ""}>
            <div className="price-row">
              <span className="price">{tier.price}</span>
              {tier.label && <span className="kol-badge">- {tier.label}</span>}
            </div>
            <ul className="feature-list">
              {tier.features.map((feat, fIdx) => (
                <li key={fIdx} className="feature-item">
                  <span className="bullet">•</span> {feat}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {card.footNote && <p className="foot-note">{card.footNote}</p>}
      </div>
    </div>
  );
}

// =============================================
// KOMPONEN UTAMA
// =============================================

export default function PricelistSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .pricelist-section {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #ffffff;
          padding: 60px 24px;
          box-sizing: border-box;
        }

        .pricelist-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .pricelist-title {
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0a0a0a;
          text-align: center;
          margin: 0 0 56px;
        }

        .pricelist-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .price-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 28px 24px 24px;
          box-shadow: 0 4px 24px rgba(13,27,75,0.08);
          border: 1px solid #e4e9f7;
          box-sizing: border-box;
        }

        .card-top {
          margin-bottom: 4px;
        }

        .card-icon {
          color: #0a0a0a;
          line-height: 0;
          margin-bottom: 10px;
        }

        .card-title {
          font-size: 22px;
          font-weight: 800;
          color: #0d1b4b;
          margin: 0 0 16px 0;
        }

        .wa-button {
          display: block;
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #0d2b8e 0%, #1a3fc4 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.2px;
          transition: opacity 0.2s ease, transform 0.1s ease;
          font-family: inherit;
        }

        .wa-button:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .card-divider {
          border: none;
          border-top: 1px solid #edf0f8;
          margin: 20px 0;
        }

        .tier-section {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px dashed #dde3f5;
        }

        .price-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .price {
          font-size: 15px;
          font-weight: 800;
          color: #0d1b4b;
        }

        .kol-badge {
          font-size: 13px;
          font-weight: 600;
          color: #4a5a8a;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-item {
          font-size: 13.5px;
          color: #3d4f72;
          padding: 4px 0;
          display: flex;
          align-items: flex-start;
          gap: 6px;
          line-height: 1.5;
        }

        .bullet {
          color: #000000;
          font-weight: 800;
          flex-shrink: 0;
        }

        .foot-note {
          font-size: 12px;
          color: #9aa5bf;
          margin-top: 14px;
          font-style: italic;
        }

        /* ── Tablet ── */
        @media (max-width: 1024px) {
          .pricelist-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .pricelist-section { padding: 48px 20px; }
          .pricelist-title { margin: 0 0 40px; }
        }

        /* ── Tablet kecil / landscape mobile ── */
        @media (max-width: 768px) {
          .pricelist-section { padding: 40px 16px; }
          .pricelist-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .pricelist-title { margin: 0 0 32px; }
          .card-title { font-size: 20px; }
        }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .pricelist-section { padding: 32px 14px; }
          .price-card { padding: 22px 18px 18px; }
          .card-title { font-size: 18px; }
          .price { font-size: 14px; }
          .feature-item { font-size: 13px; }
          .wa-button { font-size: 13px; padding: 12px; }
        }

        /* ── Mobile kecil ── */
        @media (max-width: 360px) {
          .pricelist-section { padding: 28px 12px; }
          .card-icon svg { width: 36px; height: 36px; }
        }
      `}</style>

      <section
        id="pricelist"
        className="pricelist-section"
        style={{ scrollMarginTop: "80px" }}
      >
        <div className="pricelist-header">
          <h2 className="pricelist-title">Our Pricelist</h2>
        </div>

        <div className="pricelist-grid">
          {CARDS.map((card) => (
            <PriceCard key={card.id} card={card} />
          ))}
        </div>
      </section>
    </>
  );
}
