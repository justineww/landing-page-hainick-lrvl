import { useState, useEffect, useRef } from "react";
import { API_URL } from "../../../utils/api";

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

// ── Komponen kartu foto — pilih dulu, lalu simpan ───────────────────────────
function PhotoCardItem({ card, onUpdated }) {
  const fileRef = useRef(null);
  const [pendingFile, setPendingFile] = useState(null); // file belum disimpan
  const [pendingPreview, setPendingPreview] = useState(null); // blob URL sementara
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState(null); // {type,text}

  // Preview yang ditampilkan: pending dulu, fallback ke gambar tersimpan
  const displayPreview = pendingPreview
    ? pendingPreview
    : card.image_url
      ? `${API_URL}${card.image_url}`
      : null;

  const hasPending = !!pendingFile;
  const hasChange = hasPending;

  // Pilih file — hanya simpan ke state, belum upload
  const handlePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
    setMsg(null);
    e.target.value = "";
  };

  // Batal — kembalikan ke gambar lama
  const handleCancel = () => {
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
    setMsg(null);
  };

  // Simpan — baru upload ke server
  const handleSave = async () => {
    if (!pendingFile) return;
    setUploading(true);
    setMsg(null);
    const formData = new FormData();
    formData.append("image_url", pendingFile);
    try {
      const res = await fetch(
        `${API_URL}/api/update-creators-photocard/${card.id}`,
        { method: "PUT", body: formData },
      );
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      onUpdated(card.id, data.imageUrl ?? null);
      setPendingFile(null);
      setPendingPreview(null);
      setMsg({ type: "ok", text: "✓" });
      setTimeout(() => setMsg(null), 2500);
    } catch (err) {
      console.error(err);
      setMsg({ type: "err", text: "✗ Gagal" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.35rem",
      }}
    >
      {/* Thumbnail */}
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        title="Klik untuk pilih foto baru"
        style={{
          width: "100%",
          aspectRatio: "3/4",
          borderRadius: "10px",
          background: "#f1f5f9",
          border: hasPending ? "2px solid #1a2744" : "1.5px dashed #d1d5db",
          overflow: "hidden",
          cursor: uploading ? "wait" : "pointer",
          position: "relative",
          transition: "border-color .2s, border-width .15s",
        }}
        onMouseEnter={(e) => {
          if (!hasPending) e.currentTarget.style.borderColor = "#94a3b8";
        }}
        onMouseLeave={(e) => {
          if (!hasPending) e.currentTarget.style.borderColor = "#d1d5db";
        }}
      >
        {displayPreview ? (
          <img
            src={displayPreview}
            alt={`Kartu ${card.id}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              opacity: uploading ? 0.4 : 1,
              transition: "opacity .2s",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              color: "#cbd5e1",
            }}
          >
            ＋
          </div>
        )}

        {/* Badge "pending" */}
        {hasPending && !uploading && (
          <div
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              background: "#1a2744",
              color: "#fff",
              fontSize: "0.6rem",
              fontWeight: 700,
              borderRadius: "4px",
              padding: "1px 5px",
              lineHeight: 1.6,
            }}
          >
            BARU
          </div>
        )}

        {/* Overlay uploading */}
        {uploading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.6)",
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#1a2744",
            }}
          >
            Upload…
          </div>
        )}
      </div>

      {/* Nomor */}
      <span style={{ fontSize: "0.65rem", color: "#9ca3af", fontWeight: 600 }}>
        #{card.id}
      </span>

      {/* Tombol Simpan + Batal — muncul hanya jika ada perubahan */}
      {hasChange && (
        <div style={{ display: "flex", gap: "0.3rem", width: "100%" }}>
          <button
            onClick={handleSave}
            disabled={uploading}
            style={{
              flex: 1,
              padding: "0.28rem 0",
              background: "#1a2744",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.65rem",
              fontWeight: 700,
              cursor: uploading ? "wait" : "pointer",
              transition: "background .15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              if (!uploading) e.currentTarget.style.background = "#263660";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1a2744";
            }}
          >
            Simpan
          </button>
          <button
            onClick={handleCancel}
            disabled={uploading}
            style={{
              flex: 1,
              padding: "0.28rem 0",
              background: "none",
              color: "#6b7280",
              border: "1.5px solid #e5e7eb",
              borderRadius: "6px",
              fontSize: "0.65rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "border-color .15s, color .15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ef4444";
              e.currentTarget.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.color = "#6b7280";
            }}
          >
            Batal
          </button>
        </div>
      )}

      {/* Pesan sukses/gagal */}
      {msg && (
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 700,
            color: msg.type === "ok" ? "#16a34a" : "#dc2626",
          }}
        >
          {msg.text}
        </span>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handlePick}
      />
    </div>
  );
}

// ── Panel utama ──────────────────────────────────────────────────────────────
const CreatorPanel = () => {
  const [cards, setCards] = useState(
    CARD_LAYOUT.map((l) => ({ ...l, image_url: null })),
  );
  const [stats, setStats] = useState({
    creators: "25",
    brand: "100",
    projects: "+78",
  });
  const [statsEdit, setStatsEdit] = useState({
    creators: "25",
    brand: "100",
    projects: "+78",
  });
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsMsg, setStatsMsg] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedMsg, setSeedMsg] = useState(null);
  const [search, setSearch] = useState("");

  // ── Fetch awal ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setPageLoading(true);
    try {
      const resCards = await fetch(`${API_URL}/api/creators-photocard`);
      if (resCards.ok) {
        const data = await resCards.json();
        setCards((prev) =>
          prev.map((card) => {
            const apiItem =
              data.find((d) => Number(d.id) === card.id) ?? data[card.id - 1];
            return apiItem
              ? { ...card, image_url: apiItem.image_url ?? null }
              : card;
          }),
        );
      }

      const resStats = await fetch(
        `${API_URL}/api/creators-photocard-statistics`,
      );
      if (resStats.ok) {
        const data = await resStats.json();
        const row = Array.isArray(data) ? data[0] : data;
        if (row) {
          const s = {
            creators: String(row.creators ?? "25"),
            brand: String(row.brand ?? "100"),
            projects: String(row.projects ?? "+78"),
          };
          setStats(s);
          setStatsEdit(s);
        }
      }
    } catch (err) {
      console.error("Gagal fetch:", err);
    } finally {
      setPageLoading(false);
    }
  };

  // ── Seed — buat 20 row photocard + 1 row statistik jika belum ada ──────────
  const handleSeed = async () => {
    if (
      !window.confirm(
        "Ini akan membuat 20 row kosong di creators_photocard dan 1 row di creators_photocard_statistics (jika belum ada). Lanjutkan?",
      )
    )
      return;

    setSeedLoading(true);
    setSeedMsg(null);
    try {
      const res = await fetch(`${API_URL}/api/seed-creators-photocard`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Gagal seed");
      const data = await res.json();
      setSeedMsg({
        type: "ok",
        text: data.message ?? "Seed berhasil! Silakan refresh.",
      });
      // Reload data
      await fetchAll();
    } catch (err) {
      console.error(err);
      setSeedMsg({
        type: "err",
        text: "Gagal seed. Pastikan endpoint /api/seed-creators-photocard sudah ditambahkan di server.",
      });
    } finally {
      setSeedLoading(false);
    }
  };

  const handleCardUpdated = (id, newImageUrl) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, image_url: newImageUrl } : c)),
    );
  };

  // ── Simpan stats ───────────────────────────────────────────────────────────
  const handleSaveStats = async () => {
    setStatsLoading(true);
    setStatsMsg(null);
    try {
      const res = await fetch(
        `${API_URL}/api/update-creators-photocard-statistics`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creators: statsEdit.creators,
            brand: statsEdit.brand,
            projects: statsEdit.projects,
          }),
        },
      );
      if (!res.ok) throw new Error("Gagal menyimpan");
      setStats({ ...statsEdit });
      setStatsMsg({ type: "ok", text: "Statistik berhasil disimpan!" });
    } catch (err) {
      console.error(err);
      setStatsMsg({ type: "err", text: "Gagal menyimpan statistik." });
    } finally {
      setStatsLoading(false);
      setTimeout(() => setStatsMsg(null), 3000);
    }
  };

  const statsChanged =
    statsEdit.creators !== stats.creators ||
    statsEdit.brand !== stats.brand ||
    statsEdit.projects !== stats.projects;

  const filledCount = cards.filter((c) => c.image_url).length;
  const rowCount = cards.length; // seberapa banyak row di DB yang sudah ada
  const dbIsEmpty = filledCount === 0 && !pageLoading;
  const filteredCards = cards.filter((c) =>
    search.trim() === "" ? true : String(c.id).includes(search.trim()),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .panel-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex; flex-direction: column; gap: 1.5rem;
        }
        .panel-header {
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 1rem;
        }
        .panel-header-left { display: flex; flex-direction: column; gap: 2px; }
        .panel-page-title { font-size: 1.35rem; font-weight: 800; color: #0a0a0a; letter-spacing: -0.02em; }
        .panel-page-sub   { font-size: 0.82rem; color: #9ca3af; }

        .panel-stats {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem;
        }
        .stat-card {
          background: #fff; border-radius: 14px; padding: 1.2rem 1.4rem;
          border: 1px solid #e9ecf0; display: flex; flex-direction: column; gap: 0.4rem;
        }
        .stat-label {
          font-size: 0.75rem; color: #9ca3af; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .stat-value  { font-size: 1.8rem; font-weight: 800; color: #1a2744; line-height: 1; }
        .stat-hint   { font-size: 0.75rem; color: #6b7280; }

        .panel-card  { background: #fff; border-radius: 16px; border: 1px solid #e9ecf0; overflow: hidden; }
        .panel-card-header {
          padding: 1.1rem 1.4rem; border-bottom: 1px solid #f1f5f9;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem;
        }
        .panel-card-title { font-size: 0.9rem; font-weight: 700; color: #1a2744; }

        .panel-search {
          padding: 0.45rem 0.9rem; border: 1.5px solid #e5e7eb;
          border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem; outline: none; width: 180px; transition: border-color .2s;
        }
        .panel-search:focus { border-color: #1a2744; }

        .photo-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 1rem; padding: 1.2rem 1.4rem;
        }

        .seed-banner {
          margin: 1rem 1.4rem;
          padding: 1rem 1.2rem;
          background: #fffbeb;
          border: 1.5px solid #fde68a;
          border-radius: 10px;
          display: flex; align-items: flex-start; gap: 0.75rem;
          flex-wrap: wrap;
        }
        .seed-banner-text { flex: 1; font-size: 0.82rem; color: #92400e; line-height: 1.5; }
        .seed-btn {
          background: #1a2744; color: #fff; border: none;
          border-radius: 8px; padding: 0.5rem 1.1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.8rem; font-weight: 700; cursor: pointer;
          transition: background .15s; white-space: nowrap;
        }
        .seed-btn:disabled { opacity: 0.6; cursor: wait; }
        .seed-btn:hover:not(:disabled) { background: #263660; }

        .stats-edit-section { padding: 1.2rem 1.4rem; display: flex; flex-direction: column; gap: 1rem; }
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; }
        .stats-field { display: flex; flex-direction: column; gap: 0.35rem; }
        .stats-field label {
          font-size: 0.75rem; font-weight: 700; color: #6b7280;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .stats-input {
          padding: 0.6rem 0.9rem; border: 1.5px solid #e5e7eb;
          border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem; font-weight: 700; color: #1a2744;
          outline: none; transition: border-color .2s; width: 100%; box-sizing: border-box;
        }
        .stats-input:focus { border-color: #1a2744; }
        .stats-input-hint { font-size: 0.7rem; color: #9ca3af; }

        .save-btn {
          background: #1a2744; color: #fff; border: none; border-radius: 10px;
          padding: 0.6rem 1.4rem; font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600; font-size: 0.875rem; cursor: pointer;
          transition: background .2s, transform .15s; align-self: flex-start;
        }
        .save-btn:hover:not(:disabled) { background: #263660; transform: translateY(-1px); }
        .save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .msg-ok  { font-size: 0.8rem; color: #16a34a; font-weight: 600; }
        .msg-err { font-size: 0.8rem; color: #dc2626; font-weight: 600; }

        .info-hint {
          font-size: 0.75rem; color: #9ca3af;
          padding: 0.6rem 1.4rem 0;
          display: flex; align-items: center; gap: 0.4rem;
        }

        .loading-overlay { padding: 3rem; text-align: center; color: #9ca3af; font-size: 0.9rem; }

        @media (max-width: 600px) {
          .panel-search { width: 100%; }
          .photo-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 0.65rem; padding: 0.9rem; }
        }
      `}</style>

      <div className="panel-wrap">
        {/* Header */}
        <div className="panel-header">
          <div className="panel-header-left">
            <h1 className="panel-page-title">✦ Creator</h1>
            <p className="panel-page-sub">
              Kelola foto photocard & statistik kreator
            </p>
          </div>
        </div>

        {/* Stat cards ringkasan */}
        <div className="panel-stats">
          <div className="stat-card">
            <span className="stat-label">Total Slot</span>
            <span className="stat-value">20</span>
            <span className="stat-hint">jumlah kartu tetap</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Terisi</span>
            <span
              className="stat-value"
              style={{ color: filledCount === 20 ? "#16a34a" : "#1a2744" }}
            >
              {pageLoading ? "—" : filledCount}
            </span>
            <span className="stat-hint">sudah ada foto</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Kosong</span>
            <span
              className="stat-value"
              style={{ color: 20 - filledCount > 0 ? "#ca8a04" : "#16a34a" }}
            >
              {pageLoading ? "—" : 20 - filledCount}
            </span>
            <span className="stat-hint">belum ada foto</span>
          </div>
        </div>

        {/* Kartu foto */}
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">
              Foto Photocard
              <span
                style={{
                  fontWeight: 400,
                  color: "#9ca3af",
                  fontSize: "0.8rem",
                  marginLeft: "0.5rem",
                }}
              >
                — klik kartu untuk pilih foto, lalu tekan Simpan
              </span>
            </span>
            <input
              className="panel-search"
              placeholder="Cari nomor kartu…"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Banner seed — muncul jika semua foto masih kosong */}
          {dbIsEmpty && (
            <div className="seed-banner">
              <div className="seed-banner-text">
                <strong>Database belum diinisialisasi.</strong>
                <br />
                Tabel <code>creators_photocard</code> perlu 20 row kosong dan{" "}
                <code>creators_photocard_statistics</code> perlu 1 row default
                sebelum bisa digunakan.
                <br />
                Klik tombol di samping untuk membuatnya otomatis,{" "}
                <strong>atau tambahkan endpoint seed</strong> di server.js
                terlebih dahulu (lihat komentar di bawah tombol).
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  alignItems: "flex-end",
                }}
              >
                <button
                  className="seed-btn"
                  onClick={handleSeed}
                  disabled={seedLoading}
                >
                  {seedLoading ? "Memproses…" : "⚡ Inisialisasi Database"}
                </button>
                {seedMsg && (
                  <span
                    className={seedMsg.type === "ok" ? "msg-ok" : "msg-err"}
                    style={{ fontSize: "0.75rem", textAlign: "right" }}
                  >
                    {seedMsg.text}
                  </span>
                )}
              </div>
            </div>
          )}

          <p className="info-hint">
            ℹ️ Jumlah kartu tetap 20 — tidak bisa ditambah atau dihapus, hanya
            foto yang bisa diganti.
          </p>

          {pageLoading ? (
            <div className="loading-overlay">Memuat data…</div>
          ) : (
            <div className="photo-grid">
              {filteredCards.map((card) => (
                <PhotoCardItem
                  key={card.id}
                  card={card}
                  onUpdated={handleCardUpdated}
                />
              ))}
              {filteredCards.length === 0 && (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "2rem",
                    color: "#9ca3af",
                    fontSize: "0.875rem",
                  }}
                >
                  Kartu #{search} tidak ditemukan.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit statistik */}
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Statistik Kreator</span>
            <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
              Ditampilkan di bagian bawah section Creator
            </span>
          </div>
          <div className="stats-edit-section">
            <div className="stats-row">
              {[
                { key: "creators", label: "Talents", placeholder: "25" },
                { key: "brand", label: "Brands", placeholder: "100" },
                { key: "projects", label: "Projects", placeholder: "+78" },
              ].map(({ key, label, placeholder }) => (
                <div className="stats-field" key={key}>
                  <label>{label}</label>
                  <input
                    className="stats-input"
                    type="text"
                    maxLength={10}
                    value={statsEdit[key]}
                    placeholder={placeholder}
                    onChange={(e) =>
                      setStatsEdit((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    style={{
                      borderColor:
                        statsEdit[key] !== stats[key] ? "#1a2744" : undefined,
                    }}
                  />
                  <span className="stats-input-hint">
                    Tersimpan: <strong>{stats[key]}</strong>
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <button
                className="save-btn"
                onClick={handleSaveStats}
                disabled={statsLoading || !statsChanged}
                title={!statsChanged ? "Belum ada perubahan" : ""}
              >
                {statsLoading ? "Menyimpan…" : "Simpan Statistik"}
              </button>
              {!statsChanged && !statsLoading && (
                <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
                  Belum ada perubahan
                </span>
              )}
              {statsMsg && (
                <span className={statsMsg.type === "ok" ? "msg-ok" : "msg-err"}>
                  {statsMsg.text}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatorPanel;
