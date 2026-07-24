import { useState, useEffect, useRef } from "react";
import { API_URL } from "../../../utils/api";

const ROLE_OPTIONS = [
  "Actor",
  "Host",
  "MC",
  "Content Creator",
  "Model",
  "Momfluencer",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => {
  if (!n && n !== 0) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
};

// ── Icons ─────────────────────────────────────────────────────────────────────
const TikTokIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);
const IGIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);
const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: "transform 0.2s",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Multi-Select Roles Dropdown ───────────────────────────────────────────────
const RolesDropdown = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Tutup dropdown ketika klik di luar
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (role) => {
    if (selected.includes(role)) {
      onChange(selected.filter((r) => r !== role));
    } else {
      onChange([...selected, role]);
    }
  };

  const removeRole = (role, e) => {
    e.stopPropagation();
    onChange(selected.filter((r) => r !== role));
  };

  return (
    <div className="roles-dropdown-wrap" ref={ref}>
      {/* Trigger */}
      <div
        className={`roles-trigger ${open ? "roles-trigger-open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="roles-trigger-content">
          {selected.length === 0 ? (
            <span className="roles-placeholder">Pilih roles...</span>
          ) : (
            <div className="roles-tags">
              {selected.map((r) => (
                <span key={r} className="roles-tag">
                  {r}
                  <button
                    className="roles-tag-remove"
                    onClick={(e) => removeRole(r, e)}
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="roles-chevron">
          <ChevronIcon open={open} />
        </span>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="roles-menu">
          {ROLE_OPTIONS.map((role) => {
            const checked = selected.includes(role);
            return (
              <div
                key={role}
                className={`roles-option ${checked ? "roles-option-checked" : ""}`}
                onClick={() => toggle(role)}
              >
                <span
                  className={`roles-checkbox ${checked ? "roles-checkbox-checked" : ""}`}
                >
                  {checked && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <polyline
                        points="2,6 5,9 10,3"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="roles-option-label">{role}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Modal Tambah / Edit ───────────────────────────────────────────────────────
const TalentModal = ({ mode, talent, onClose, onSaved }) => {
  const isEdit = mode === "edit";

  // Parse roles string menjadi array
  const parseRoles = (rolesStr) => {
    if (!rolesStr) return [];
    return rolesStr
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
  };

  const [form, setForm] = useState({
    name: talent?.name || "",
    followers_instagram: talent?.followers_ig || "",
    url_instagram: talent?.url_instagram || "",
    followers_tiktok: talent?.followers_tiktok || "",
    url_tiktok: talent?.url_tiktok || "",
    followers_x: talent?.followers_x || "",
    url_x: talent?.url_x || "",
  });
  const [selectedRoles, setSelectedRoles] = useState(parseRoles(talent?.roles));
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(
    talent?.profile_image ? `${API_URL}${talent.profile_image}` : null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Nama harus diisi.");
      return;
    }
    setLoading(true);
    setError("");

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("followers_instagram", form.followers_instagram || 0);
    fd.append("url_instagram", form.url_instagram || "");
    fd.append("followers_tiktok", form.followers_tiktok || 0);
    fd.append("url_tiktok", form.url_tiktok || "");
    fd.append("followers_x", form.followers_x || 0);
    fd.append("url_x", form.url_x || "");
    // Gabungkan array roles menjadi string dipisah koma
    fd.append("roles", selectedRoles.join(", "));
    if (imageFile) fd.append("profile_image", imageFile);

    try {
      const url = isEdit
        ? `${API_URL}/update-creators/${talent.id}`
        : `${API_URL}/create-creators`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error("Gagal menyimpan data");
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const textFields = [
    { label: "Nama", name: "name", placeholder: "Nama lengkap talent" },
    {
      label: "Followers Instagram",
      name: "followers_instagram",
      placeholder: "misal: 50000",
    },
    {
      label: "URL Instagram",
      name: "url_instagram",
      placeholder: "https://instagram.com/username",
    },
    {
      label: "Followers TikTok",
      name: "followers_tiktok",
      placeholder: "misal: 120000",
    },
    {
      label: "URL TikTok",
      name: "url_tiktok",
      placeholder: "https://tiktok.com/@username",
    },
    { label: "Followers X", name: "followers_x", placeholder: "misal: 8000" },
    { label: "URL X", name: "url_x", placeholder: "https://x.com/username" },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? "Edit Talent" : "Tambah Talent"}
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Avatar upload */}
        <div className="avatar-upload-wrap">
          <div
            className="avatar-upload-circle"
            style={{ backgroundImage: preview ? `url(${preview})` : "none" }}
          >
            {!preview && <span className="avatar-placeholder">📷</span>}
          </div>
          <label className="avatar-change-btn">
            Pilih Foto
            <input type="file" accept="image/*" hidden onChange={handleImage} />
          </label>
        </div>

        <div className="modal-fields">
          {textFields.map((f) => (
            <div className="field-group" key={f.name}>
              <label className="field-label">{f.label}</label>
              <input
                className="field-input"
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
              />
            </div>
          ))}

          {/* Roles multi-select dropdown */}
          <div className="field-group">
            <label className="field-label">Roles</label>
            <RolesDropdown
              selected={selectedRoles}
              onChange={setSelectedRoles}
            />
            {selectedRoles.length === 0 && (
              <span className="field-hint">Pilih satu atau lebih roles</span>
            )}
          </div>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button
            className="btn-save"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Talent"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Konfirmasi Hapus ──────────────────────────────────────────────────────────
const DeleteConfirm = ({ talent, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/delete-creators/${talent.id}`, {
        method: "DELETE",
      });
      onDeleted();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-box confirm-box"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="confirm-icon">🗑️</p>
        <h3 className="confirm-title">Hapus Talent?</h3>
        <p className="confirm-desc">
          <strong>{talent.name}</strong> akan dihapus permanen dan tidak bisa
          dikembalikan.
        </p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button
            className="btn-delete"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Talent Card ───────────────────────────────────────────────────────────────
const TalentCard = ({ talent, index, onEdit, onDelete }) => {
  const roles = talent.roles
    ? talent.roles
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  const imgSrc = talent.profile_image
    ? `${API_URL}${talent.profile_image}`
    : null;

  return (
    <div className="t-card" style={{ animationDelay: `${index * 60}ms` }}>
      {/* Avatar */}
      <div className="t-card-avatar">
        {imgSrc ? (
          <img src={imgSrc} alt={talent.name} className="t-card-img" />
        ) : (
          <div className="t-card-img-fallback">
            {talent.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="t-card-body">
        <p className="t-card-name">{talent.name}</p>

        {roles.length > 0 && (
          <div className="t-card-roles">
            {roles.map((r) => (
              <span key={r} className="t-role-badge">
                {r}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="t-card-stats">
          <div className="t-stat">
            <span className="t-stat-icon t-stat-ig">
              <IGIcon />
            </span>
            <span className="t-stat-val">{fmt(talent.followers_ig)}</span>
          </div>
          <div className="t-stat">
            <span className="t-stat-icon t-stat-tt">
              <TikTokIcon />
            </span>
            <span className="t-stat-val">{fmt(talent.followers_tiktok)}</span>
          </div>
          <div className="t-stat">
            <span className="t-stat-icon t-stat-x">
              <XIcon />
            </span>
            <span className="t-stat-val">{fmt(talent.followers_x)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="t-card-actions">
        <button className="t-action-btn" onClick={() => onEdit(talent)}>
          Edit
        </button>
        <button
          className="t-action-btn t-action-del"
          onClick={() => onDelete(talent)}
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

// ── Main Panel ────────────────────────────────────────────────────────────────
const CreatorPlusPanel = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/creators`);
      const data = await res.json();
      setCreators(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal fetch creators:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const handleSaved = () => {
    setModal(null);
    fetchCreators();
  };
  const handleDeleted = () => {
    setModal(null);
    fetchCreators();
  };

  const filtered = creators.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.roles?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          --navy: #1a2744;
          --navy-light: #263660;
          --accent: #4f7cff;
          --accent-soft: #eef2ff;
          --danger: #ef4444;
          --danger-soft: #fef2f2;
          --green: #16a34a;
          --green-soft: #dcfce7;
          --border: #e9ecf0;
          --muted: #9ca3af;
          --text: #1e293b;
          --bg: #f4f6fb;
          --card-bg: #fff;
          --font: 'Plus Jakarta Sans', sans-serif;
          --radius: 16px;
          --shadow: 0 2px 16px rgba(26,39,68,0.07);
        }

        * { box-sizing: border-box; }

        .panel-wrap {
          font-family: var(--font);
          display: flex;
          flex-direction: column;
          gap: 1.6rem;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .panel-page-title {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--navy);
          letter-spacing: -0.03em;
          margin: 0 0 2px;
        }
        .panel-page-sub { font-size: 0.8rem; color: var(--muted); margin: 0; }
        .panel-add-btn {
          background: var(--navy);
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.6rem 1.25rem;
          font-family: var(--font);
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(26,39,68,0.2);
        }
        .panel-add-btn:hover { background: var(--navy-light); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,39,68,0.25); }

        .panel-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }
        .stat-card {
          background: var(--card-bg);
          border-radius: 14px;
          padding: 1.1rem 1.3rem;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
        }
        .stat-label { font-size: 0.7rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; display: block; margin-bottom: 6px; }
        .stat-value { font-size: 1.9rem; font-weight: 800; color: var(--navy); line-height: 1; display: block; }
        .stat-hint { font-size: 0.72rem; color: var(--muted); margin-top: 4px; display: block; }

        .search-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .panel-search {
          flex: 1;
          max-width: 320px;
          padding: 0.5rem 0.95rem;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-family: var(--font);
          font-size: 0.84rem;
          outline: none;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          color: var(--text);
        }
        .panel-search:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(79,124,255,0.12); }

        .count-label {
          font-size: 0.8rem;
          color: var(--muted);
          font-weight: 500;
          white-space: nowrap;
        }

        .talent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }

        .t-card {
          background: var(--card-bg);
          border-radius: var(--radius);
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          padding: 1.4rem 1.2rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: cardIn 0.35s ease both;
        }
        .t-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(26,39,68,0.12); }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .t-card-avatar { position: relative; }
        .t-card-img {
          width: 76px; height: 76px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--accent-soft);
          display: block;
        }
        .t-card-img-fallback {
          width: 76px; height: 76px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--navy), var(--accent));
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 1.6rem; font-weight: 800;
          border: 3px solid var(--accent-soft);
        }

        .t-card-body { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; width: 100%; }
        .t-card-name { font-size: 0.95rem; font-weight: 700; color: var(--text); margin: 0; text-align: center; }

        .t-card-roles { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; }
        .t-role-badge {
          background: var(--accent-soft);
          color: var(--accent);
          font-size: 0.67rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 100px;
          letter-spacing: 0.03em;
        }

        .t-card-stats {
          display: flex;
          gap: 0.6rem;
          justify-content: center;
          flex-wrap: wrap;
          width: 100%;
          padding-top: 6px;
          border-top: 1px solid var(--border);
        }
        .t-stat { display: flex; align-items: center; gap: 4px; }
        .t-stat-icon {
          width: 22px; height: 22px;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .t-stat-ig { background: #fce4ec; color: #e91e63; }
        .t-stat-tt { background: #e8eaf6; color: #3d5afe; }
        .t-stat-x  { background: #f3f4f6; color: #374151; }
        .t-stat-val { font-size: 0.75rem; font-weight: 700; color: var(--text); }

        .t-card-actions { display: flex; gap: 0.5rem; width: 100%; }
        .t-action-btn {
          flex: 1;
          background: none;
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 0.35rem 0;
          font-family: var(--font);
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text);
          cursor: pointer;
          transition: all 0.18s;
        }
        .t-action-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
        .t-action-del:hover { border-color: var(--danger); color: var(--danger); background: var(--danger-soft); }

        .empty-state {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 1rem;
          color: var(--muted);
          text-align: center;
          gap: 0.5rem;
        }
        .empty-icon { font-size: 2.5rem; }
        .empty-title { font-weight: 700; color: var(--text); font-size: 1rem; margin: 0; }
        .empty-sub { font-size: 0.85rem; margin: 0; }

        .skeleton-card {
          background: #fff;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          padding: 1.4rem 1.2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
        }
        .skel {
          border-radius: 8px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e9edf4 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .skel-circle { width: 76px; height: 76px; border-radius: 50%; }
        .skel-line  { height: 12px; }
        .skel-sm    { height: 10px; }

        /* ── Modal ── */
        .modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(10,15,30,0.55);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 1rem;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .modal-box {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 440px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 1.8rem;
          animation: slideUp 0.25s ease;
          box-shadow: 0 24px 64px rgba(10,15,30,0.2);
        }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:none;opacity:1} }

        .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.4rem; }
        .modal-title { font-size: 1.05rem; font-weight: 800; color: var(--navy); margin: 0; }
        .modal-close-btn {
          background: var(--bg); border: none; border-radius: 8px;
          width: 30px; height: 30px; cursor: pointer; font-size: 0.85rem;
          display: flex; align-items: center; justify-content: center;
          color: var(--muted); transition: background 0.15s;
        }
        .modal-close-btn:hover { background: var(--border); }

        .avatar-upload-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; }
        .avatar-upload-circle {
          width: 84px; height: 84px; border-radius: 50%;
          background-color: var(--accent-soft);
          background-size: cover; background-position: center;
          display: flex; align-items: center; justify-content: center;
          border: 2px dashed var(--accent);
        }
        .avatar-placeholder { font-size: 1.6rem; }
        .avatar-change-btn {
          font-size: 0.78rem; font-weight: 600; color: var(--accent);
          cursor: pointer; padding: 4px 12px; border-radius: 8px;
          background: var(--accent-soft); font-family: var(--font);
          transition: background 0.2s;
        }
        .avatar-change-btn:hover { background: #dde8ff; }

        .modal-fields { display: flex; flex-direction: column; gap: 0.85rem; }
        .field-group { display: flex; flex-direction: column; gap: 4px; }
        .field-label { font-size: 0.76rem; font-weight: 700; color: #6b7280; letter-spacing: 0.04em; text-transform: uppercase; }
        .field-input {
          padding: 0.55rem 0.85rem;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          font-family: var(--font);
          font-size: 0.875rem;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .field-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(79,124,255,0.12); }
        .field-hint { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }

        /* ── Roles Dropdown ── */
        .roles-dropdown-wrap {
          position: relative;
          font-family: var(--font);
        }

        .roles-trigger {
          min-height: 40px;
          padding: 0.4rem 0.85rem;
          border: 1.5px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s;
          user-select: none;
        }
        .roles-trigger:hover { border-color: #c8d0dc; }
        .roles-trigger-open {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(79,124,255,0.12);
        }

        .roles-trigger-content {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          min-width: 0;
        }

        .roles-placeholder {
          font-size: 0.875rem;
          color: var(--muted);
          line-height: 1.6;
        }

        .roles-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .roles-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--accent-soft);
          color: var(--accent);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 6px 2px 8px;
          border-radius: 100px;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        .roles-tag-remove {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          cursor: pointer;
          color: var(--accent);
          font-size: 1rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          transition: background 0.15s, color 0.15s;
          font-family: var(--font);
        }
        .roles-tag-remove:hover { background: rgba(79,124,255,0.2); }

        .roles-chevron {
          color: var(--muted);
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .roles-menu {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: #fff;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(26,39,68,0.14);
          z-index: 100;
          overflow: hidden;
          animation: menuIn 0.18s ease;
        }
        @keyframes menuIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .roles-option {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.6rem 1rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: var(--text);
          font-weight: 500;
          transition: background 0.12s;
        }
        .roles-option:hover { background: var(--bg); }
        .roles-option-checked { background: var(--accent-soft); color: var(--accent); font-weight: 600; }
        .roles-option-checked:hover { background: #e0e9ff; }

        .roles-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid var(--border);
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.15s, background 0.15s;
        }
        .roles-checkbox-checked {
          background: var(--accent);
          border-color: var(--accent);
        }

        .roles-option-label { flex: 1; }

        /* ── Modal actions ── */
        .modal-error { font-size: 0.82rem; color: var(--danger); margin: 0.8rem 0 0; font-weight: 500; }

        .modal-actions { display: flex; gap: 0.6rem; margin-top: 1.4rem; }
        .btn-cancel {
          flex: 1; padding: 0.65rem; border-radius: 10px;
          border: 1.5px solid var(--border); background: none;
          font-family: var(--font); font-size: 0.87rem; font-weight: 600;
          color: var(--text); cursor: pointer; transition: background 0.15s;
        }
        .btn-cancel:hover { background: var(--bg); }
        .btn-save {
          flex: 2; padding: 0.65rem; border-radius: 10px;
          border: none; background: var(--navy);
          font-family: var(--font); font-size: 0.87rem; font-weight: 700;
          color: #fff; cursor: pointer; transition: background 0.2s, transform 0.15s;
        }
        .btn-save:hover:not(:disabled) { background: var(--navy-light); transform: translateY(-1px); }
        .btn-save:disabled, .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

        .confirm-box { text-align: center; }
        .confirm-icon { font-size: 2.4rem; margin: 0 0 0.5rem; }
        .confirm-title { font-size: 1.05rem; font-weight: 800; color: var(--text); margin: 0 0 0.5rem; }
        .confirm-desc { font-size: 0.87rem; color: var(--muted); margin: 0 0 0.5rem; line-height: 1.6; }
        .btn-delete {
          flex: 2; padding: 0.65rem; border-radius: 10px;
          border: none; background: var(--danger);
          font-family: var(--font); font-size: 0.87rem; font-weight: 700;
          color: #fff; cursor: pointer; transition: background 0.2s;
        }
        .btn-delete:hover:not(:disabled) { background: #dc2626; }
        .btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 600px) {
          .talent-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
          .panel-stats { grid-template-columns: repeat(1, 1fr); }
        }
      `}</style>

      <div className="panel-wrap">
        {/* Header */}
        <div className="panel-header">
          <div>
            <h1 className="panel-page-title">Talent</h1>
            <p className="panel-page-sub">Kelola data talent dan creator</p>
          </div>
          <button
            className="panel-add-btn"
            onClick={() => setModal({ mode: "add" })}
          >
            + Tambah Talent
          </button>
        </div>

        {/* Stats */}
        <div className="panel-stats">
          <div className="stat-card">
            <span className="stat-label">Total</span>
            <span className="stat-value">{creators.length}</span>
            <span className="stat-hint">talent terdaftar</span>
          </div>
        </div>

        {/* Search */}
        <div className="search-row">
          <input
            className="panel-search"
            type="search"
            placeholder="Cari nama atau role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {!loading && (
            <span className="count-label">
              {filtered.length} dari {creators.length} talent
            </span>
          )}
        </div>

        {/* Cards */}
        <div className="talent-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div className="skeleton-card" key={i}>
                <div className="skel skel-circle" />
                <div className="skel skel-line" style={{ width: "60%" }} />
                <div className="skel skel-sm" style={{ width: "80%" }} />
                <div className="skel skel-sm" style={{ width: "50%" }} />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎭</span>
              <p className="empty-title">
                {search ? "Talent tidak ditemukan" : "Belum ada talent"}
              </p>
              <p className="empty-sub">
                {search
                  ? `Tidak ada hasil untuk "${search}"`
                  : "Klik + Tambah Talent untuk mulai"}
              </p>
            </div>
          ) : (
            filtered.map((c, i) => (
              <TalentCard
                key={c.id}
                talent={c}
                index={i}
                onEdit={(t) => setModal({ mode: "edit", talent: t })}
                onDelete={(t) => setModal({ mode: "delete", talent: t })}
              />
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {modal?.mode === "add" && (
        <TalentModal
          mode="add"
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {modal?.mode === "edit" && (
        <TalentModal
          mode="edit"
          talent={modal.talent}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
      {modal?.mode === "delete" && (
        <DeleteConfirm
          talent={modal.talent}
          onClose={() => setModal(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
};

export default CreatorPlusPanel;
