import { useState, useEffect, useRef } from "react";
import { API_URL } from "../../../utils/api";

const AboutPanel = () => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);

  // ── Fetch data dari API ──────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/hainick-assets`);
      if (!res.ok) throw new Error("Gagal mengambil data dari server");
      const data = await res.json();
      const showcase = data.find(
        (item) => item.image_type === "talent_showcase",
      );
      setVideoUrl(showcase ? `${API_URL}${showcase.image_url}` : null);
    } catch (err) {
      setError("Gagal memuat data. Pastikan server berjalan di " + API_URL);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Auto-hide success message ────────────────────────────────────
  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(null), 3500);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  // ── Handle file pilihan ─────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("File harus berupa video (mp4, webm, dll.)");
      return;
    }
    setError(null);
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShowModal(true);
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setPreviewFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Upload / Update ke backend ───────────────────────────────────
  const handleUpload = async () => {
    if (!previewFile) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", previewFile); // backend pakai key "image"

    try {
      // Cek apakah sudah ada talent_showcase
      const checkRes = await fetch(`${API_URL}/hainick-assets`);
      const assets = await checkRes.json();
      const exists = assets.find(
        (item) => item.image_type === "talent_showcase",
      );

      let res;
      if (exists) {
        // UPDATE — PUT /api/update-hainick-assets/:image_type
        res = await fetch(`${API_URL}/update-hainick-assets/talent_showcase`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // CREATE — POST /api/create-hainick-assets
        formData.append("image_type", "talent_showcase");
        res = await fetch(`${API_URL}/create-hainick-assets`, {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menyimpan video");
      }

      setSuccessMsg("✅ Video Talent Showcase berhasil diperbarui!");
      handleCancelModal();
      await fetchData(); // refresh tampilan
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
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

        /* ── Header ── */
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

        /* ── Stats ── */
        .panel-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }
        .stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 1.2rem 1.4rem;
          border: 1px solid #e9ecf0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .stat-label {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1a2744;
          line-height: 1;
        }
        .stat-hint { font-size: 0.75rem; color: #6b7280; }

        /* ── Card ── */
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

        /* ── Video area ── */
        .video-section { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

        .video-preview-wrap {
          position: relative;
          width: 100%;
          max-width: 640px;
          aspect-ratio: 16/9;
          background: #f1f5f9;
          border-radius: 12px;
          overflow: hidden;
          border: 1.5px dashed #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .video-preview-wrap video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }
        .video-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #9ca3af;
        }
        .video-empty-icon { font-size: 2.5rem; }
        .video-empty-text { font-size: 0.85rem; font-weight: 500; }

        .video-meta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .badge {
          display: inline-block;
          padding: 0.2rem 0.65rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .badge-active { background: #dcfce7; color: #16a34a; }
        .badge-empty  { background: #f3f4f6; color: #6b7280; }

        .video-filename {
          font-size: 0.78rem;
          color: #6b7280;
          word-break: break-all;
        }

        /* ── Buttons ── */
        .btn-primary {
          background: #1a2744;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.6rem 1.2rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover:not(:disabled) { background: #263660; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

        .btn-outline {
          background: none;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          padding: 0.55rem 1.1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
          transition: border-color 0.18s, color 0.18s;
        }
        .btn-outline:hover { border-color: #1a2744; color: #1a2744; }

        /* ── Alerts ── */
        .alert {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.84rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .alert-error   { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .alert-success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }

        /* ── Loading skeleton ── */
        .skeleton {
          border-radius: 12px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── Modal ── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,10,10,0.55);
          backdrop-filter: blur(3px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .modal-box {
          background: #fff;
          border-radius: 18px;
          width: 100%;
          max-width: 520px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
          animation: modalIn 0.22s ease;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .modal-title { font-size: 1rem; font-weight: 800; color: #0a0a0a; }
        .modal-sub   { font-size: 0.8rem; color: #9ca3af; margin-top: 2px; }
        .modal-preview {
          width: 100%;
          aspect-ratio: 16/9;
          border-radius: 10px;
          overflow: hidden;
          background: #0a0a0a;
        }
        .modal-preview video { width: 100%; height: 100%; object-fit: contain; }
        .modal-preview-filename {
          font-size: 0.78rem;
          color: #6b7280;
          word-break: break-all;
        }
        .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; flex-wrap: wrap; }

        .hidden-input { display: none; }

        @media (max-width: 600px) {
          .video-section { padding: 1rem; }
          .modal-box { padding: 1.25rem; }
        }
      `}</style>

      <div className="panel-wrap">
        {/* ── Header ── */}
        <div className="panel-header">
          <div className="panel-header-left">
            <h1 className="panel-page-title">◎ About Us</h1>
            <p className="panel-page-sub">
              Kelola konten tentang Hainick Creative
            </p>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="panel-stats">
          <div className="stat-card">
            <span className="stat-label">Konten</span>
            <span className="stat-value">1</span>
            <span className="stat-hint">Talent Showcase Video</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Status</span>
            <span
              className="stat-value"
              style={{ fontSize: "1rem", paddingTop: "0.3rem" }}
            >
              {loading ? (
                "—"
              ) : videoUrl ? (
                <span className="badge badge-active">Aktif</span>
              ) : (
                <span className="badge badge-empty">Kosong</span>
              )}
            </span>
            <span className="stat-hint">ditampilkan di landing</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Tipe</span>
            <span
              className="stat-value"
              style={{
                fontSize: "0.9rem",
                paddingTop: "0.35rem",
                color: "#6b7280",
              }}
            >
              talent_showcase
            </span>
            <span className="stat-hint">enum website_assets</span>
          </div>
        </div>

        {/* ── Alert ── */}
        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {/* ── Video Card ── */}
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Talent Showcase Video</span>
            <button
              className="btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || loading}
            >
              {videoUrl ? "🔄 Ganti Video" : "＋ Upload Video"}
            </button>
          </div>

          <div className="video-section">
            {/* Hidden file input — hanya menerima video */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden-input"
              onChange={handleFileChange}
            />

            {/* Preview video */}
            {loading ? (
              <div
                className="skeleton"
                style={{ width: "100%", maxWidth: 640, aspectRatio: "16/9" }}
              />
            ) : (
              <div className="video-preview-wrap">
                {videoUrl ? (
                  <video src={videoUrl} controls />
                ) : (
                  <div className="video-empty-state">
                    <div className="video-empty-icon">🎬</div>
                    <div className="video-empty-text">
                      Belum ada video diunggah
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Meta info */}
            {!loading && (
              <div className="video-meta">
                {videoUrl ? (
                  <>
                    <span className="badge badge-active">Aktif</span>
                    <span className="video-filename">
                      {videoUrl.split("/").pop()}
                    </span>
                  </>
                ) : (
                  <span className="badge badge-empty">Belum ada video</span>
                )}
              </div>
            )}

            {/* Info tabel */}
            <p style={{ fontSize: "0.78rem", color: "#9ca3af", margin: 0 }}>
              Tabel: <code>website_assets</code> · image_type:{" "}
              <code>talent_showcase</code>
            </p>
          </div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && handleCancelModal()}
        >
          <div className="modal-box">
            <div>
              <div className="modal-title">Konfirmasi Ganti Video</div>
              <div className="modal-sub">
                Preview video baru sebelum disimpan ke server
              </div>
            </div>

            {previewUrl && (
              <div className="modal-preview">
                <video src={previewUrl} controls autoPlay muted />
              </div>
            )}

            <div className="modal-preview-filename">
              📁 {previewFile?.name} &nbsp;·&nbsp;
              {previewFile
                ? (previewFile.size / (1024 * 1024)).toFixed(2) + " MB"
                : ""}
            </div>

            {videoUrl && (
              <p style={{ fontSize: "0.8rem", color: "#f59e0b", margin: 0 }}>
                ⚠️ Video lama (<strong>{videoUrl.split("/").pop()}</strong>)
                akan diganti.
              </p>
            )}

            <div className="modal-actions">
              <button
                className="btn-outline"
                onClick={handleCancelModal}
                disabled={uploading}
              >
                Batal
              </button>
              <button
                className="btn-primary"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "⏳ Mengupload..." : "✅ Simpan Video"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AboutPanel;
