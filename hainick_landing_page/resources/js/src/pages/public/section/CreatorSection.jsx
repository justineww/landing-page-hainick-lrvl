import { useState, useEffect, useRef, useMemo, memo } from "react";
import { API_URL } from "../../../utils/api";

// ── Konstanta statis ──────────────────────────────────────────────────────────
const CARD_LAYOUT = [
  { id: 1, col: 0, row: 0 },
  { id: 2, col: 0, row: 1 },
  { id: 3, col: 0, row: 2 },
  { id: 4, col: 1, row: 0 },
  { id: 5, col: 1, row: 1 },
  { id: 6, col: 1, row: 2 },
  { id: 7, col: 2, row: 0 },
  { id: 8, col: 2, row: 1 },
  { id: 9, col: 3, row: 0 },
  { id: 10, col: 3, row: 1 },
  { id: 11, col: 4, row: 0 },
  { id: 12, col: 4, row: 1 },
  { id: 13, col: 5, row: 0 },
  { id: 14, col: 5, row: 1 },
  { id: 15, col: 6, row: 0 },
  { id: 16, col: 6, row: 1 },
  { id: 17, col: 6, row: 2 },
  { id: 18, col: 7, row: 0 },
  { id: 19, col: 7, row: 1 },
  { id: 20, col: 7, row: 2 },
];

const COL_WAVE_ORDER = [0, 7, 1, 6, 2, 5, 3, 4];
const COL_OFFSET_TOP = {
  0: -80,
  1: -40,
  2: -80,
  3: -20,
  4: -20,
  5: -80,
  6: -40,
  7: -80,
};
const ROW_OPACITY = { 0: 0.35, 1: 0.7, 2: 1.0 };
const COL_COUNT = 8;

const GROUPED_LAYOUT = CARD_LAYOUT.reduce((acc, card) => {
  if (!acc[card.col]) acc[card.col] = [];
  acc[card.col].push(card);
  return acc;
}, {});

const ANIM_DELAY_MAP = CARD_LAYOUT.reduce((acc, card) => {
  const waveIdx = COL_WAVE_ORDER.indexOf(card.col);
  acc[card.id] = waveIdx * 80 + card.row * 60;
  return acc;
}, {});

const CARD_CSS = `
  .tc {
    width: 100%;
    aspect-ratio: 3 / 4;
    border-radius: clamp(12px, 1.6vw, 22px);
    background: #e8e5df;
    overflow: hidden;
    cursor: pointer;
    will-change: transform, opacity;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5);
    transition:
      box-shadow .25s ease,
      transform  .25s ease,
      opacity    .25s ease;
  }
  .tc:hover {
    transform:  translateY(-3px) !important;
    opacity:    1 !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.5);
  }
  .tc img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: grayscale(100%);
    transition: filter .35s ease;
  }
  .tc:hover img {
    filter: grayscale(0%);
  }
`;

// ── TalentCard — ZERO state, ZERO event handler ───────────────────────────────
// Dua fase terpisah:
// 1. SEBELUM visible: kartu di luar layar (opacity:0, translateY(-50px)), transition: none
// 2. SAAT animasi masuk: inline style override transition dengan cubic-bezier + delay
// 3. SETELAH animasi selesai: inline transition di-strip via onTransitionEnd
//    → browser pakai transition dari CSS class .tc yang ringan untuk hover
const TalentCard = memo(function TalentCard({
  imageUrl,
  cardId,
  row,
  visible,
  animDelay,
}) {
  const baseOpacity = ROW_OPACITY[row] ?? 1;
  // useRef untuk akses langsung ke DOM — nol re-render
  const divRef = useRef(null);

  // Hapus inline transition setelah animasi masuk selesai
  // sehingga hover memakai transition CSS class yang lebih ringan
  const handleTransitionEnd = (e) => {
    // Hanya strip saat property 'transform' selesai (akhir animasi masuk)
    if (e.propertyName === "transform" && divRef.current) {
      divRef.current.style.transition = "";
    }
  };

  return (
    <div
      ref={divRef}
      className="tc"
      onTransitionEnd={handleTransitionEnd}
      style={{
        opacity: visible ? baseOpacity : 0,
        transform: visible ? "none" : "translateY(-50px)",
        transition: visible
          ? `opacity   .65s cubic-bezier(.22,1,.36,1) ${animDelay}ms,
             transform .65s cubic-bezier(.22,1,.36,1) ${animDelay}ms,
             box-shadow .3s ease`
          : "none",
      }}
    >
      {imageUrl ? (
        <img
          src={`${API_URL}${imageUrl}`}
          alt={`Talent ${cardId}`}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(160deg,#e0ddd7 0%,#ccc9c2 100%)",
          }}
        />
      )}
    </div>
  );
});

// ── StatItem ──────────────────────────────────────────────────────────────────
const StatItem = memo(function StatItem({ value, label, visible, delayIndex }) {
  return (
    <div
      style={{
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity .6s ease, transform .6s ease",
        transitionDelay: `${delayIndex * 0.12}s`,
      }}
    >
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontWeight: 800,
          fontSize: "clamp(2.2rem,5.5vw,4.5rem)",
          color: "#111",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: "clamp(0.6rem,1vw,0.75rem)",
          color: "#666",
          letterSpacing: ".08em",
          textTransform: "uppercase",
          marginTop: "5px",
          fontWeight: 400,
        }}
      >
        {label}
      </div>
    </div>
  );
});

// ── FadeOverlays — statis, tidak pernah re-render ─────────────────────────────
const FadeOverlays = memo(function FadeOverlays() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100px",
          background:
            "linear-gradient(to bottom,#fff 0%,#fff 20%,rgba(255,255,255,0) 100%)",
          zIndex: 20,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "220px",
          background:
            "linear-gradient(to top,#fff 30%,rgba(255,255,255,0) 100%)",
          zIndex: 8,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "calc(max(0px,(100% - 1060px) / 2))",
          background:
            "linear-gradient(to right,#fff 40%,rgba(255,255,255,0) 100%)",
          zIndex: 15,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "calc(max(0px,(100% - 1060px) / 2))",
          background:
            "linear-gradient(to left,#fff 40%,rgba(255,255,255,0) 100%)",
          zIndex: 15,
          pointerEvents: "none",
        }}
      />
    </>
  );
});

// ── Komponen utama ────────────────────────────────────────────────────────────
export default function CreatorsSection() {
  const [imageMap, setImageMap] = useState(() => new Map());
  const [stats, setStats] = useState({
    creators: "25",
    brand: "100",
    projects: "+78",
  });
  const [visibleSet, setVisibleSet] = useState(() => new Set());
  const [statsVisible, setStatsVisible] = useState(false);
  const [brandVisible, setBrandVisible] = useState(false);

  const sectionRef = useRef(null);
  const cleanupRef = useRef(null);
  const firedRef = useRef(false);

  // ── Inject CSS sekali saat mount ────────────────────────────────────────────
  // Memakai <style> di JSX menyebabkan string CSS di-parse ulang tiap render.
  // useEffect + document.head inject lebih efisien: hanya jalan satu kali.
  useEffect(() => {
    const el = document.createElement("style");
    el.setAttribute("data-tc", "1");
    // Hindari duplikasi (StrictMode double-mount)
    if (!document.querySelector("[data-tc]")) {
      el.textContent = CARD_CSS;
      document.head.appendChild(el);
    }
    return () => el.remove();
  }, []);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const ctrl = new AbortController();

    (async () => {
      try {
        const res = await fetch(`${API_URL}/creators-photocard`, {
          signal: ctrl.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        const map = new Map();
        data.forEach((d, i) => {
          const id = d.id ?? i + 1;
          if (d.image_url) map.set(id, d.image_url);
        });
        setImageMap(map);
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      }
    })();

    (async () => {
      try {
        const res = await fetch(`${API_URL}/creators-photocard-statistics`, {
          signal: ctrl.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        const row = Array.isArray(data) ? data[0] : data;
        if (row)
          setStats({
            creators: row.creators ?? "25",
            brand: row.brand ?? "100",
            projects: row.projects ?? "+78",
          });
      } catch (e) {
        if (e.name !== "AbortError") console.error(e);
      }
    })();

    return () => ctrl.abort();
  }, []);

  // ── Observer + animasi masuk ─────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const timeouts = [];
    const push = (fn, delay) => {
      timeouts.push(setTimeout(fn, delay));
    };

    function runAnimation() {
      if (firedRef.current) return;
      firedRef.current = true;

      push(() => setBrandVisible(true), 80);

      const buckets = new Map();
      COL_WAVE_ORDER.forEach((colIdx, waveIdx) => {
        (GROUPED_LAYOUT[colIdx] ?? []).forEach((card, rowIdx) => {
          const delay = waveIdx * 80 + rowIdx * 60;
          const bucket = Math.round(delay / 16) * 16;
          if (!buckets.has(bucket)) buckets.set(bucket, []);
          buckets.get(bucket).push(card.id);
        });
      });

      buckets.forEach((ids, delay) => {
        push(() => {
          setVisibleSet((prev) => {
            const next = new Set(prev);
            ids.forEach((id) => next.add(id));
            return next;
          });
        }, delay);
      });

      push(() => setStatsVisible(true), 800);
    }

    cleanupRef.current = () => timeouts.forEach(clearTimeout);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          runAnimation();
        }
      },
      { threshold: 0, rootMargin: "50px 0px 50px 0px" },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      cleanupRef.current?.();
      firedRef.current = false;
    };
  }, []);

  const statItems = useMemo(
    () => [
      { value: stats.creators, label: "TALENTS" },
      { value: stats.brand, label: "BRANDS" },
      { value: stats.projects, label: "PROJECTS" },
    ],
    [stats],
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');`}</style>

      <section
        ref={sectionRef}
        id="creator"
        style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          background: "#fff",
          width: "100%",
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <FadeOverlays />

        {/* Grid kartu */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(6px,0.9vw,12px)",
            width: "100%",
            boxSizing: "border-box",
            padding: "0 clamp(8px,1.5vw,20px)",
            paddingBottom: "200px",
          }}
        >
          {Array.from({ length: COL_COUNT }, (_, colIdx) => (
            <div
              key={colIdx}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "clamp(6px,0.9vw,12px)",
                flex: "1 1 0%",
                minWidth: 0,
                marginTop: `${COL_OFFSET_TOP[colIdx]}px`,
              }}
            >
              {(GROUPED_LAYOUT[colIdx] ?? []).map((card) => (
                <TalentCard
                  key={card.id}
                  cardId={card.id}
                  row={card.row}
                  imageUrl={imageMap.get(card.id) ?? null}
                  visible={visibleSet.has(card.id)}
                  animDelay={ANIM_DELAY_MAP[card.id]}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Brand + Stats */}
        <div
          style={{
            position: "absolute",
            bottom: "220px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "1060px",
            padding: "0 1rem",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: "clamp(0.9rem,1.8vw,1.2rem)",
              fontWeight: 700,
              color: "#111",
              letterSpacing: "-0.01em",
              margin: "0 0 clamp(8px,1.5vw,14px)",
              whiteSpace: "nowrap",
              opacity: brandVisible ? 1 : 0,
              transform: brandVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity .5s ease,transform .5s ease",
            }}
          >
            Kreator Hainick.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "clamp(24px,5vw,72px)",
            }}
          >
            {statItems.map((stat, i) => (
              <StatItem
                key={stat.label}
                value={stat.value}
                label={stat.label}
                visible={statsVisible}
                delayIndex={i}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
