import { useEffect, useRef } from "react";

// ── CSS loading screen — di-inject sekali ─────────────────────────────────────
const LOADING_CSS = `
  .ld-root {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 28px;
    /* Fade out saat visible=false */
    transition: opacity 0.55s cubic-bezier(0.4, 0, 0.2, 1),
                visibility 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* State: tampil */
  .ld-root.ld-show {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
  }

  /* State: sembunyi — fade out lalu benar-benar hilang */
  .ld-root.ld-hide {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  /* Logo */
  .ld-logo {
    width: clamp(50px, 22vw, 100px);
    height: auto;
    object-fit: contain;
    /* Muncul dari bawah dengan sedikit bounce */
    animation: ld-logo-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  @keyframes ld-logo-in {
    from { opacity: 0; transform: translateY(18px) scale(0.92); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }

  /* Bar progress tipis di bawah logo */
  .ld-bar-wrap {
    width: clamp(80px, 18vw, 120px);
    height: 2px;
    background: #e5e7eb;
    border-radius: 99px;
    overflow: hidden;
    animation: ld-logo-in 0.7s 0.1s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .ld-bar-fill {
    height: 100%;
    background: #0d2b8e;
    border-radius: 99px;
    /* Animasi bar mengisi dari 0% → 85% dalam ~1.8s,
       lalu berhenti di sana sampai halaman benar-benar siap */
    animation: ld-progress 1.8s cubic-bezier(0.1, 0.4, 0.6, 1) forwards;
  }

  @keyframes ld-progress {
    from { width: 0%;  }
    to   { width: 85%; }
  }

  /* Saat halaman sudah ready, langsung fill 100% sebelum fade-out */
  .ld-root.ld-hide .ld-bar-fill {
    width: 100% !important;
    transition: width 0.25s ease;
  }
`;

export default function LoadingScreen({ visible, logo }) {
  const styleRef = useRef(null);

  // Inject CSS sekali
  useEffect(() => {
    if (document.querySelector("[data-ld]")) return;
    const el = document.createElement("style");
    el.setAttribute("data-ld", "1");
    el.textContent = LOADING_CSS;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => el.remove();
  }, []);

  return (
    <div className={`ld-root ${visible ? "ld-show" : "ld-hide"}`}>
      {logo && (
        <img className="ld-logo" src={logo} alt="Hainick" draggable={false} />
      )}
      <div className="ld-bar-wrap">
        <div className="ld-bar-fill" />
      </div>
    </div>
  );
}
