import { useState, useEffect, useRef } from "react";
import { API_URL, BASE_URL } from "../../../utils/api";

const API = "http://localhost:8000";

// ─── Helpers ───────────────────────────────────────────────────────────────
const fmtPhoto = (url) =>
  url ? (url.startsWith("http") ? url : `${API_URL}${url}`) : null;

// ─── Modal ─────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <>
      <style>{`
        .modal-backdrop {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(10,10,20,0.45);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.18s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .modal-box {
          background: #fff;
          border-radius: 18px;
          width: 100%; max-width: 500px;
          padding: 2rem;
          box-shadow: 0 20px 60px rgba(10,20,80,0.18);
          animation: slideUp 0.2s ease;
          max-height: 90vh;
          overflow-y: auto;
        }
        @keyframes slideUp { from { transform:translateY(16px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        .modal-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 1.5rem;
        }
        .modal-title { font-size: 1rem; font-weight: 800; color: #1a2744; }
        .modal-close {
          background: none; border: none; font-size: 1.3rem;
          cursor: pointer; color: #9ca3af; line-height: 1;
          padding: 0.2rem 0.4rem; border-radius: 6px;
          transition: background 0.15s;
        }
        .modal-close:hover { background: #f1f5f9; color: #374151; }
        .field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.1rem; }
        .field label { font-size: 0.78rem; font-weight: 700; color: #6b7280; letter-spacing: 0.04em; text-transform: uppercase; }
        .field input, .field textarea {
          padding: 0.6rem 0.85rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 9px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.87rem;
          outline: none;
          transition: border-color 0.18s;
          resize: vertical;
        }
        .field input:focus, .field textarea:focus { border-color: #1a2744; }
        .field textarea { min-height: 110px; }
        .photo-preview {
          width: 60px; height: 60px; border-radius: 50%;
          object-fit: cover; border: 2px solid #e4e9f7;
          margin-bottom: 0.5rem;
        }
        .photo-placeholder {
          width: 60px; height: 60px; border-radius: 50%;
          background: #f0f3fa; display: flex; align-items: center;
          justify-content: center; color: #b0bbd4;
          font-size: 20px; font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .modal-actions { display: flex; gap: 0.65rem; justify-content: flex-end; margin-top: 0.5rem; }
        .btn-cancel {
          padding: 0.55rem 1.2rem; border-radius: 9px;
          border: 1.5px solid #e5e7eb; background: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.85rem; font-weight: 600;
          cursor: pointer; color: #374151;
          transition: all 0.18s;
        }
        .btn-cancel:hover { border-color: #9ca3af; }
        .btn-save {
          padding: 0.55rem 1.4rem; border-radius: 9px;
          border: none; background: #1a2744;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.85rem; font-weight: 700;
          cursor: pointer; color: #fff;
          transition: background 0.18s, transform 0.15s;
        }
        .btn-save:hover { background: #263660; transform: translateY(-1px); }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
      `}</style>
      <div
        className="modal-backdrop"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal-box">
          <div className="modal-head">
            <span className="modal-title">{title}</span>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}

// ─── Main Panel ────────────────────────────────────────────────────────────
const TestimonyPanel = () => {
  // ── Testimony state ──
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | "edit"
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [fName, setFName] = useState("");
  const [fText, setFText] = useState("");
  const [fFile, setFFile] = useState(null);
  const [fPreview, setFPreview] = useState(null);
  const fileRef = useRef();

  // ── Logo state ──
  const [logos, setLogos] = useState([]);
  const [logoLoading, setLogoLoading] = useState(true);
  const [logoModal, setLogoModal] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoSaving, setLogoSaving] = useState(false);
  const logoFileRef = useRef();

  // ── Active tab ──
  const [activeTab, setActiveTab] = useState("testimony"); // "testimony" | "logo"

  // ── Fetch testimony ──
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/testimonials`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch {
      showToast("Gagal memuat data.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch logos ──
  const fetchLogos = async () => {
    setLogoLoading(true);
    try {
      const res = await fetch(`${API_URL}/load-logo`, { method: "POST" });
      const json = await res.json();
      setLogos(Array.isArray(json) ? json : []);
    } catch {
      showToast("Gagal memuat logo.", "error");
    } finally {
      setLogoLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLogos();
  }, []);

  // ── Toast ──
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Testimony handlers ──
  const openAdd = () => {
    setSelected(null);
    setFName("");
    setFText("");
    setFFile(null);
    setFPreview(null);
    setModal("add");
  };
  const openEdit = (row) => {
    setSelected(row);
    setFName(row.name || "");
    setFText(row.testimonial || "");
    setFFile(null);
    setFPreview(fmtPhoto(row.profile_image));
    setModal("edit");
  };
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFFile(f);
    setFPreview(URL.createObjectURL(f));
  };
  const handleSave = async () => {
    if (!fName.trim() || !fText.trim()) {
      showToast("Nama dan testimoni wajib diisi.", "error");
      return;
    }
    setSaving(true);
    const fd = new FormData();
    fd.append("name", fName.trim());
    fd.append("testimonial", fText.trim());
    if (fFile) fd.append("image", fFile);
    try {
      const url =
        modal === "add"
          ? `${API_URL}/create-testimonials`
          : `${API_URL}/update-testimonials/${selected.id}`;
      const method = modal === "add" ? "POST" : "PUT";
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error();
      showToast(
        modal === "add"
          ? "Testimony berhasil ditambahkan!"
          : "Testimony berhasil diperbarui!",
      );
      setModal(null);
      fetchData();
    } catch {
      showToast("Gagal menyimpan data.", "error");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus testimony ini?")) return;
    try {
      const res = await fetch(`${API_URL}/delete-testimonials/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      showToast("Testimony berhasil dihapus.");
      fetchData();
    } catch {
      showToast("Gagal menghapus data.", "error");
    }
  };

  // ── Logo handlers ──
  const handleLogoFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  };
  const openLogoModal = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoModal(true);
  };
  const handleLogoSave = async () => {
    if (!logoFile) {
      showToast("File logo harus dipilih.", "error");
      return;
    }
    setLogoSaving(true);
    const fd = new FormData();
    fd.append("logo", logoFile);
    try {
      const res = await fetch(`${API_URL}/create-logo`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error();
      showToast("Logo berhasil ditambahkan!");
      setLogoModal(false);
      fetchLogos();
    } catch {
      showToast("Gagal menyimpan logo.", "error");
    } finally {
      setLogoSaving(false);
    }
  };
  const handleLogoDelete = async (id) => {
    if (!window.confirm("Yakin hapus logo ini?")) return;
    try {
      const res = await fetch(`${API_URL}/delete-logo/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      showToast("Logo berhasil dihapus.");
      fetchLogos();
    } catch {
      showToast("Gagal menghapus logo.", "error");
    }
  };

  // ── Filtered ──
  const filtered = data.filter(
    (d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.testimonial?.toLowerCase().includes(search.toLowerCase()),
  );
  const total = data.length;

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
          justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
        }
        .panel-header-left { display: flex; flex-direction: column; gap: 2px; }
        .panel-page-title {
          font-size: 1.35rem; font-weight: 800;
          color: #0a0a0a; letter-spacing: -0.02em;
        }
        .panel-page-sub { font-size: 0.82rem; color: #9ca3af; }
        .panel-add-btn {
          background: #1a2744; color: #fff; border: none;
          border-radius: 10px; padding: 0.6rem 1.2rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600; font-size: 0.875rem;
          cursor: pointer; display: flex; align-items: center;
          gap: 0.4rem; transition: background 0.2s, transform 0.15s;
        }
        .panel-add-btn:hover { background: #263660; transform: translateY(-1px); }

        .panel-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }
        .stat-card {
          background: #fff; border-radius: 14px;
          padding: 1.2rem 1.4rem; border: 1px solid #e9ecf0;
          display: flex; flex-direction: column; gap: 0.4rem;
        }
        .stat-label {
          font-size: 0.75rem; color: #9ca3af; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .stat-value {
          font-size: 1.8rem; font-weight: 800;
          color: #1a2744; line-height: 1;
        }
        .stat-hint { font-size: 0.75rem; color: #6b7280; }

        .panel-card {
          background: #fff; border-radius: 16px;
          border: 1px solid #e9ecf0; overflow: hidden;
        }
        .panel-card-header {
          padding: 1.1rem 1.4rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem;
        }
        .panel-card-title { font-size: 0.9rem; font-weight: 700; color: #1a2744; }
        .panel-search {
          padding: 0.45rem 0.9rem;
          border: 1.5px solid #e5e7eb; border-radius: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem; outline: none; width: 200px;
          transition: border-color 0.2s;
        }
        .panel-search:focus { border-color: #1a2744; }

        .panel-table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.855rem; }
        thead tr { background: #f8fafc; }
        th {
          padding: 0.75rem 1.2rem; text-align: left;
          font-size: 0.75rem; font-weight: 700; color: #6b7280;
          letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap;
        }
        td {
          padding: 0.85rem 1.2rem; color: #374151;
          border-top: 1px solid #f1f5f9; vertical-align: middle;
        }
        tr:hover td { background: #f8fafc; }

        .td-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          object-fit: cover; border: 2px solid #e4e9f7;
        }
        .td-avatar-placeholder {
          width: 40px; height: 40px; border-radius: 50%;
          background: #f0f3fa; display: flex; align-items: center;
          justify-content: center; color: #b0bbd4;
          font-size: 16px; font-weight: 800;
        }
        .td-quote {
          max-width: 360px;
          white-space: nowrap; overflow: hidden;
          text-overflow: ellipsis; color: #6b7280;
          font-style: italic; font-size: 0.82rem;
        }

        .action-btn {
          background: none; border: 1.5px solid #e5e7eb;
          border-radius: 7px; padding: 0.28rem 0.65rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem; font-weight: 600;
          cursor: pointer; transition: all 0.18s; color: #374151;
        }
        .action-btn:hover { border-color: #1a2744; color: #1a2744; }
        .action-btn.del:hover { border-color: #ef4444; color: #ef4444; }

        .empty-state {
          padding: 3rem; text-align: center;
          color: #9ca3af; font-size: 0.9rem;
        }
        .empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }

        .skeleton-row td { animation: pulse 1.4s infinite; }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
        .skel {
          display: inline-block; background: #e9ecf0;
          border-radius: 6px; height: 14px;
        }

        /* Toast */
        .toast {
          position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
          padding: 0.75rem 1.2rem; border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.855rem; font-weight: 600;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          animation: toastIn 0.25s ease;
        }
        @keyframes toastIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
        .toast-success { background: #1a2744; color: #fff; }
        .toast-error   { background: #ef4444; color: #fff; }

        /* Tab navigation */
        .tab-nav {
          display: flex; gap: 0;
          border-bottom: 1.5px solid #e9ecf0;
        }
        .tab-btn {
          padding: 0.7rem 1.4rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.85rem; font-weight: 600;
          border: none; background: none; cursor: pointer;
          color: #9ca3af;
          border-bottom: 2.5px solid transparent;
          margin-bottom: -1.5px;
          transition: color 0.18s, border-color 0.18s;
        }
        .tab-btn.active { color: #1a2744; border-bottom-color: #1a2744; }
        .tab-btn:hover:not(.active) { color: #374151; }

        /* Logo grid */
        .logo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 1rem;
          padding: 1.4rem;
        }
        .logo-card {
          border: 1.5px solid #e9ecf0;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          background: #fafbfc;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .logo-card:hover { border-color: #c8d0e0; box-shadow: 0 2px 10px rgba(26,39,68,0.07); }
        .logo-card img {
          height: 40px; max-width: 120px;
          object-fit: contain;
        }
        .logo-card-id {
          font-size: 0.7rem; color: #b0bbd4; font-weight: 600;
        }
        .logo-empty { padding: 3rem; text-align: center; color: #9ca3af; font-size: 0.9rem; }
        .logo-skel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 1rem;
          padding: 1.4rem;
        }
        .logo-skel-card {
          border: 1.5px solid #e9ecf0;
          border-radius: 12px;
          height: 90px;
          animation: pulse 1.4s infinite;
          background: #f3f4f6;
        }

        /* Logo upload area in modal */
        .logo-upload-area {
          border: 2px dashed #e5e7eb;
          border-radius: 12px;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
          margin-bottom: 1rem;
        }
        .logo-upload-area:hover { border-color: #1a2744; background: #f8faff; }
        .logo-upload-area img { height: 48px; max-width: 160px; object-fit: contain; }
        .logo-upload-hint { font-size: 0.78rem; color: #9ca3af; text-align: center; }

        @media (max-width: 600px) {
          .panel-search { width: 100%; }
          th, td { padding: 0.65rem 0.85rem; }
        }
      `}</style>

      {/* Toast */}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="panel-wrap">
        {/* Header */}
        <div className="panel-header">
          <div className="panel-header-left">
            <h1 className="panel-page-title">
              {activeTab === "testimony" ? "❝ Testimony" : "🏷️ Logo Klien"}
            </h1>
            <p className="panel-page-sub">
              {activeTab === "testimony"
                ? "Kelola testimoni klien"
                : "Kelola logo klien yang tampil di website"}
            </p>
          </div>
          {activeTab === "testimony" ? (
            <button className="panel-add-btn" onClick={openAdd}>
              + Tambah Testimony
            </button>
          ) : (
            <button className="panel-add-btn" onClick={openLogoModal}>
              + Tambah Logo
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="panel-stats">
          <div className="stat-card">
            <span className="stat-label">
              {activeTab === "testimony" ? "Total Testimony" : "Total Logo"}
            </span>
            <span className="stat-value">
              {activeTab === "testimony"
                ? loading
                  ? "—"
                  : total
                : logoLoading
                  ? "—"
                  : logos.length}
            </span>
            <span className="stat-hint">item terdaftar</span>
          </div>
        </div>

        {/* Tab card */}
        <div className="panel-card" style={{ overflow: "visible" }}>
          <div className="tab-nav">
            <button
              className={`tab-btn ${activeTab === "testimony" ? "active" : ""}`}
              onClick={() => setActiveTab("testimony")}
            >
              ❝ Testimony
            </button>
            <button
              className={`tab-btn ${activeTab === "logo" ? "active" : ""}`}
              onClick={() => setActiveTab("logo")}
            >
              🏷️ Logo Klien
            </button>
          </div>

          {/* ── Testimony tab ── */}
          {activeTab === "testimony" && (
            <>
              <div
                className="panel-card-header"
                style={{ borderTop: "1px solid #f1f5f9" }}
              >
                <span className="panel-card-title">Daftar Testimony</span>
                <input
                  className="panel-search"
                  placeholder="Cari nama / teks…"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="panel-table-wrap">
                {loading ? (
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Foto</th>
                        <th>Nama</th>
                        <th>Testimoni</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3].map((i) => (
                        <tr key={i} className="skeleton-row">
                          <td>
                            <span className="skel" style={{ width: 20 }} />
                          </td>
                          <td>
                            <span
                              className="skel"
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                display: "inline-block",
                              }}
                            />
                          </td>
                          <td>
                            <span className="skel" style={{ width: 120 }} />
                          </td>
                          <td>
                            <span className="skel" style={{ width: 220 }} />
                          </td>
                          <td>
                            <span className="skel" style={{ width: 80 }} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : filtered.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">❝</div>
                    <p>
                      {search
                        ? "Tidak ada hasil pencarian."
                        : "Belum ada data Testimony."}
                    </p>
                    {!search && (
                      <p>
                        Klik <strong>+ Tambah Testimony</strong> untuk mulai.
                      </p>
                    )}
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Foto</th>
                        <th>Nama</th>
                        <th>Testimoni</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((row, i) => {
                        const photo = fmtPhoto(row.profile_image);
                        const initial = (row.name || "?")
                          .charAt(0)
                          .toUpperCase();
                        return (
                          <tr key={row.id}>
                            <td
                              style={{ color: "#9ca3af", fontSize: "0.8rem" }}
                            >
                              {i + 1}
                            </td>
                            <td>
                              {photo ? (
                                <img
                                  src={photo}
                                  alt={row.name}
                                  className="td-avatar"
                                />
                              ) : (
                                <div className="td-avatar-placeholder">
                                  {initial}
                                </div>
                              )}
                            </td>
                            <td
                              style={{
                                fontWeight: 600,
                                color: "#1a2744",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {row.name}
                            </td>
                            <td>
                              <div className="td-quote">
                                "{row.testimonial}"
                              </div>
                            </td>
                            <td>
                              <div style={{ display: "flex", gap: "0.4rem" }}>
                                <button
                                  className="action-btn"
                                  onClick={() => openEdit(row)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="action-btn del"
                                  onClick={() => handleDelete(row.id)}
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ── Logo tab ── */}
          {activeTab === "logo" && (
            <>
              <div
                className="panel-card-header"
                style={{ borderTop: "1px solid #f1f5f9" }}
              >
                <span className="panel-card-title">Daftar Logo Klien</span>
                <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
                  Logo ditampilkan sebagai ticker bergerak di website
                </span>
              </div>
              {logoLoading ? (
                <div className="logo-skel-grid">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="logo-skel-card" />
                  ))}
                </div>
              ) : logos.length === 0 ? (
                <div className="logo-empty">
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                    🏷️
                  </div>
                  <p>Belum ada logo yang ditambahkan.</p>
                  <p>
                    Klik <strong>+ Tambah Logo</strong> untuk mulai.
                  </p>
                </div>
              ) : (
                <div className="logo-grid">
                  {logos.map((logo, i) => {
                    const src = fmtPhoto(logo.image_url);
                    return (
                      <div key={logo.id} className="logo-card">
                        {src ? (
                          <img src={src} alt={`Logo ${i + 1}`} />
                        ) : (
                          <div
                            style={{
                              height: 40,
                              display: "flex",
                              alignItems: "center",
                              color: "#b0bbd4",
                              fontSize: "0.8rem",
                            }}
                          >
                            No image
                          </div>
                        )}
                        <span className="logo-card-id">ID #{logo.id}</span>
                        <button
                          className="action-btn del"
                          onClick={() => handleLogoDelete(logo.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Modal Testimony Add/Edit ── */}
      {modal && (
        <Modal
          title={modal === "add" ? "Tambah Testimony" : "Edit Testimony"}
          onClose={() => setModal(null)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.2rem",
            }}
          >
            {fPreview ? (
              <img src={fPreview} alt="preview" className="photo-preview" />
            ) : (
              <div className="photo-placeholder">
                {fName ? fName.charAt(0).toUpperCase() : "?"}
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Foto Profil
              </span>
              <button
                style={{
                  padding: "0.35rem 0.8rem",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: "7px",
                  background: "none",
                  cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#374151",
                  transition: "all 0.18s",
                }}
                onClick={() => fileRef.current.click()}
              >
                {fPreview ? "Ganti Foto" : "Pilih Foto"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFile}
              />
              <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                JPG / PNG / WebP
              </span>
            </div>
          </div>

          <div className="field">
            <label>Nama</label>
            <input
              type="text"
              placeholder="Nama klien"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Testimoni</label>
            <textarea
              placeholder="Tulis testimoni di sini…"
              value={fText}
              onChange={(e) => setFText(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setModal(null)}>
              Batal
            </button>
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Modal Logo Add ── */}
      {logoModal && (
        <Modal title="Tambah Logo Klien" onClose={() => setLogoModal(false)}>
          <div
            className="logo-upload-area"
            onClick={() => logoFileRef.current.click()}
          >
            {logoPreview ? (
              <img src={logoPreview} alt="preview logo" />
            ) : (
              <>
                <span style={{ fontSize: "2rem" }}>🖼️</span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#374151",
                  }}
                >
                  Klik untuk pilih file logo
                </span>
              </>
            )}
            <span className="logo-upload-hint">
              PNG / SVG / WebP — rekomendasi rasio landscape, background
              transparan
            </span>
          </div>
          <input
            ref={logoFileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleLogoFile}
          />

          <div className="modal-actions">
            <button className="btn-cancel" onClick={() => setLogoModal(false)}>
              Batal
            </button>
            <button
              className="btn-save"
              onClick={handleLogoSave}
              disabled={logoSaving}
            >
              {logoSaving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default TestimonyPanel;
