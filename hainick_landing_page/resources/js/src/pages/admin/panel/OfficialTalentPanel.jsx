import { useState, useEffect } from "react";
import { API_URL, BASE_URL } from "../../../utils/api";

const TalentModal = ({ mode, talent, onClose, onSaved }) => {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    nama: "",
    bio: "",
    followers_ig: "",
    followers_tiktok: "",
    followers_twitter: "",
    tinggi: "",
    berat: "",
    umur: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(
    talent?.image_url ? `${API_URL}${talent.image_url}` : null,
  );
  const [prefillLoading, setPrefillLoading] = useState(isEdit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil detail yang sudah ada ketika mode edit
  useEffect(() => {
    if (!isEdit || !talent?.id) return;
    let active = true;
    setPrefillLoading(true);
    fetch(`${API_URL}/load-official-talent-desc/${talent.id}`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil detail talent");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        const d = Array.isArray(data) ? data[0] : data;
        if (d) {
          setForm({
            nama: d.nama || "",
            bio: d.bio || "",
            followers_ig: d.followers_ig ?? "",
            followers_tiktok: d.followers_tiktok ?? "",
            followers_twitter: d.followers_twitter ?? "",
            tinggi: d.tinggi ?? "",
            berat: d.berat ?? "",
            umur: d.umur ?? "",
          });
        }
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setPrefillLoading(false);
      });
    return () => {
      active = false;
    };
  }, [isEdit, talent?.id]);

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
    if (!isEdit && !imageFile) {
      setError("Foto talent harus diunggah.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      let talentId = talent?.id;

      // Langkah 1: simpan foto ── membuat row baru (trigger otomatis membuat
      // row official_talent_desc) atau memperbarui foto yang sudah ada.
      if (!isEdit) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const res = await fetch(`${API_URL}/create-official-talent`, {
          method: "POST",
          body: fd,
        });
        if (!res.ok) throw new Error("Gagal mengunggah foto talent");
        const data = await res.json();
        talentId = data.id;
      } else if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const res = await fetch(
          `${API_URL}/update-official-talent/${talentId}`,
          {
            method: "PUT",
            body: fd,
          },
        );
        if (!res.ok) throw new Error("Gagal memperbarui foto talent");
      }

      // Langkah 2: simpan detail talent (nama, bio, followers, dst)
      const descRes = await fetch(
        `${API_URL}/update-official-talent-desc/${talentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama: form.nama,
            bio: form.bio,
            followers_ig: form.followers_ig || 0,
            followers_tiktok: form.followers_tiktok || 0,
            followers_twitter: form.followers_twitter || 0,
            tinggi: form.tinggi || null,
            berat: form.berat || null,
            umur: form.umur || null,
          }),
        },
      );
      if (!descRes.ok) throw new Error("Gagal menyimpan detail talent");

      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const textFields = [
    { label: "Nama Lengkap", name: "nama", placeholder: "Nama lengkap talent" },
    {
      label: "Followers Instagram",
      name: "followers_ig",
      placeholder: "misal: 50000",
    },
    {
      label: "Followers TikTok",
      name: "followers_tiktok",
      placeholder: "misal: 120000",
    },
    {
      label: "Followers Twitter",
      name: "followers_twitter",
      placeholder: "misal: 8000",
    },
    { label: "Tinggi (cm)", name: "tinggi", placeholder: "misal: 180" },
    { label: "Berat (kg)", name: "berat", placeholder: "misal: 71" },
    { label: "Umur (tahun)", name: "umur", placeholder: "misal: 27" },
  ];

  return (
    <div className="otp-modal-backdrop" onClick={onClose}>
      <div className="otp-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="otp-modal-header">
          <h2 className="otp-modal-title">
            {isEdit ? "Edit Talent" : "Tambah Talent"}
          </h2>
          <button className="otp-modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {prefillLoading ? (
          <div className="otp-prefill-loading">Memuat data talent...</div>
        ) : (
          <>
            {/* Upload foto */}
            <div className="otp-avatar-upload-wrap">
              <div
                className="otp-avatar-upload-square"
                style={{
                  backgroundImage: preview ? `url(${preview})` : "none",
                }}
              >
                {!preview && <span className="otp-avatar-placeholder">📷</span>}
              </div>
              <label className="otp-avatar-change-btn">
                {isEdit ? "Ganti Foto" : "Pilih Foto"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImage}
                />
              </label>
            </div>

            <div className="otp-modal-fields">
              {textFields.slice(0, 1).map((f) => (
                <div className="otp-field-group" key={f.name}>
                  <label className="otp-field-label">{f.label}</label>
                  <input
                    className="otp-field-input"
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}

              <div className="otp-field-group">
                <label className="otp-field-label">Bio</label>
                <textarea
                  className="otp-field-input otp-field-textarea"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Deskripsi singkat mengenai talent"
                  rows={3}
                />
              </div>

              <div className="otp-field-row">
                {textFields.slice(1, 4).map((f) => (
                  <div className="otp-field-group" key={f.name}>
                    <label className="otp-field-label">{f.label}</label>
                    <input
                      className="otp-field-input"
                      name={f.name}
                      value={form[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      inputMode="numeric"
                    />
                  </div>
                ))}
              </div>

              <div className="otp-field-row">
                {textFields.slice(4, 7).map((f) => (
                  <div className="otp-field-group" key={f.name}>
                    <label className="otp-field-label">{f.label}</label>
                    <input
                      className="otp-field-input"
                      name={f.name}
                      value={form[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      inputMode="numeric"
                    />
                  </div>
                ))}
              </div>
            </div>

            {error && <p className="otp-modal-error">{error}</p>}

            <div className="otp-modal-actions">
              <button
                className="otp-btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Batal
              </button>
              <button
                className="otp-btn-save"
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
          </>
        )}
      </div>
    </div>
  );
};

// ── Konfirmasi Hapus ──────────────────────────────────────────────────────────
const DeleteConfirm = ({ talent, desc, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}/delete-official-talent/${talent.id}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) throw new Error("Gagal menghapus talent");
      onDeleted();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-modal-backdrop" onClick={onClose}>
      <div
        className="otp-modal-box otp-confirm-box"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="otp-confirm-icon">🗑️</p>
        <h3 className="otp-confirm-title">Hapus Talent?</h3>
        <p className="otp-confirm-desc">
          <strong>{desc?.nama?.trim() || `Talent #${talent.id}`}</strong> akan
          dihapus permanen beserta seluruh detailnya dan tidak bisa
          dikembalikan.
        </p>
        {error && <p className="otp-modal-error">{error}</p>}
        <div className="otp-modal-actions">
          <button
            className="otp-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </button>
          <button
            className="otp-btn-delete"
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

// ── Talent Card (admin grid) ──────────────────────────────────────────────────
const AdminTalentCard = ({ talent, desc, index, onEdit, onDelete }) => {
  const [imgError, setImgError] = useState(false);
  const photo = talent.image_url ? `${API_URL}${talent.image_url}` : null;
  const showFallback = !photo || imgError;
  const name = desc?.nama?.trim();

  return (
    <div className="otp-card" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="otp-card-photo-wrap">
        {showFallback ? (
          <div className="otp-card-fallback">🧑</div>
        ) : (
          <img
            src={photo}
            alt={name || "Talent"}
            className="otp-card-img"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <div className="otp-card-body">
        <p className={`otp-card-name ${!name ? "otp-card-name-empty" : ""}`}>
          {name || "Belum diisi"}
        </p>
        {desc &&
        (desc.followers_ig ||
          desc.followers_tiktok ||
          desc.followers_twitter) ? (
          <p className="otp-card-sub">
            IG {desc.followers_ig || 0} · TT {desc.followers_tiktok || 0} · TW{" "}
            {desc.followers_twitter || 0}
          </p>
        ) : (
          <p className="otp-card-sub otp-card-sub-empty">
            Detail belum lengkap
          </p>
        )}
      </div>

      <div className="otp-card-actions">
        <button className="otp-action-btn" onClick={() => onEdit(talent)}>
          Edit
        </button>
        <button
          className="otp-action-btn otp-action-del"
          onClick={() => onDelete(talent)}
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

// ── Panel Utama ────────────────────────────────────────────────────────────────
const OfficialTalentPanel = () => {
  const [talents, setTalents] = useState([]);
  const [descMap, setDescMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const fetchTalents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/load-official-talent`, {
        method: "POST",
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setTalents(list);

      // Ambil detail masing-masing talent (nama dkk) untuk ditampilkan di grid admin
      const entries = await Promise.all(
        list.map(async (t) => {
          try {
            const r = await fetch(
              `${API_URL}/load-official-talent-desc/${t.id}`,
              {
                method: "POST",
              },
            );
            const d = await r.json();
            return [t.id, Array.isArray(d) ? d[0] : d];
          } catch {
            return [t.id, null];
          }
        }),
      );
      setDescMap(Object.fromEntries(entries));
    } catch (err) {
      console.error("Gagal fetch official talent:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTalents();
  }, []);

  const handleSaved = () => {
    setModal(null);
    fetchTalents();
  };
  const handleDeleted = () => {
    setModal(null);
    fetchTalents();
  };

  const filtered = talents.filter((t) => {
    const name = descMap[t.id]?.nama || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

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

        .otp-wrap { font-family: var(--font); display: flex; flex-direction: column; gap: 1.6rem; }

        .otp-header {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
        }
        .otp-page-title { font-size: 1.4rem; font-weight: 800; color: var(--navy); letter-spacing: -0.03em; margin: 0 0 2px; }
        .otp-page-sub { font-size: 0.8rem; color: var(--muted); margin: 0; }
        .otp-add-btn {
          background: var(--navy); color: #fff; border: none; border-radius: 10px;
          padding: 0.6rem 1.25rem; font-family: var(--font); font-weight: 700; font-size: 0.85rem;
          cursor: pointer; transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(26,39,68,0.2);
        }
        .otp-add-btn:hover { background: var(--navy-light); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,39,68,0.25); }

        .otp-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1rem; }
        .otp-stat-card { background: var(--card-bg); border-radius: 14px; padding: 1.1rem 1.3rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
        .otp-stat-label { font-size: 0.7rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.07em; display: block; margin-bottom: 6px; }
        .otp-stat-value { font-size: 1.9rem; font-weight: 800; color: var(--navy); line-height: 1; display: block; }
        .otp-stat-hint { font-size: 0.72rem; color: var(--muted); margin-top: 4px; display: block; }

        .otp-search-row { display: flex; align-items: center; gap: 0.75rem; }
        .otp-search {
          flex: 1; max-width: 320px; padding: 0.5rem 0.95rem;
          border: 1.5px solid var(--border); border-radius: 10px;
          font-family: var(--font); font-size: 0.84rem; outline: none; background: #fff;
          transition: border-color 0.2s, box-shadow 0.2s; color: var(--text);
        }
        .otp-search:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(79,124,255,0.12); }
        .otp-count-label { font-size: 0.8rem; color: var(--muted); font-weight: 500; white-space: nowrap; }

        .otp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }

        .otp-card {
          background: var(--card-bg); border-radius: var(--radius); border: 1px solid var(--border);
          box-shadow: var(--shadow); overflow: hidden; display: flex; flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s; animation: otpCardIn 0.35s ease both;
        }
        .otp-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(26,39,68,0.12); }
        @keyframes otpCardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

        .otp-card-photo-wrap { width: 100%; aspect-ratio: 1 / 1; background: #f0f0f0; }
        .otp-card-img { width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block; }
        .otp-card-fallback {
          width: 100%; height: 100%; background: linear-gradient(135deg, var(--navy), var(--accent));
          display: flex; align-items: center; justify-content: center; font-size: 2rem;
        }

        .otp-card-body { padding: 0.85rem 0.9rem 0.4rem; flex: 1; }
        .otp-card-name { font-size: 0.9rem; font-weight: 700; color: var(--text); margin: 0 0 4px; }
        .otp-card-name-empty { color: var(--muted); font-style: italic; font-weight: 500; }
        .otp-card-sub { font-size: 0.72rem; color: var(--muted); margin: 0; }
        .otp-card-sub-empty { font-style: italic; }

        .otp-card-actions { display: flex; gap: 0.5rem; padding: 0.7rem 0.9rem 0.9rem; }
        .otp-action-btn {
          flex: 1; background: none; border: 1.5px solid var(--border); border-radius: 8px;
          padding: 0.35rem 0; font-family: var(--font); font-size: 0.78rem; font-weight: 600;
          color: var(--text); cursor: pointer; transition: all 0.18s;
        }
        .otp-action-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
        .otp-action-del:hover { border-color: var(--danger); color: var(--danger); background: var(--danger-soft); }

        .otp-empty-state {
          grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 4rem 1rem; color: var(--muted); text-align: center; gap: 0.5rem;
        }
        .otp-empty-icon { font-size: 2.5rem; }
        .otp-empty-title { font-weight: 700; color: var(--text); font-size: 1rem; margin: 0; }
        .otp-empty-sub { font-size: 0.85rem; margin: 0; }

        .otp-skeleton-card { background: #fff; border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; }
        .otp-skel { border-radius: 8px; background: linear-gradient(90deg, #f1f5f9 25%, #e9edf4 50%, #f1f5f9 75%); background-size: 200% 100%; animation: otpShimmer 1.4s infinite; }
        .otp-skel-photo { width: 100%; aspect-ratio: 1 / 1; border-radius: 0; }
        @keyframes otpShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── Modal ── */
        .otp-modal-backdrop {
          position: fixed; inset: 0; background: rgba(10,15,30,0.55);
          display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem;
          animation: otpFadeIn 0.2s ease;
        }
        @keyframes otpFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .otp-modal-box {
          background: #fff; border-radius: 20px; width: 100%; max-width: 480px; max-height: 90vh;
          overflow-y: auto; padding: 1.8rem; animation: otpSlideUp 0.25s ease;
          box-shadow: 0 24px 64px rgba(10,15,30,0.2);
        }
        @keyframes otpSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }

        .otp-modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.4rem; }
        .otp-modal-title { font-size: 1.05rem; font-weight: 800; color: var(--navy); margin: 0; }
        .otp-modal-close-btn {
          background: var(--bg); border: none; border-radius: 8px; width: 30px; height: 30px;
          cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; justify-content: center;
          color: var(--muted); transition: background 0.15s;
        }
        .otp-modal-close-btn:hover { background: var(--border); }

        .otp-prefill-loading { padding: 2rem 0; text-align: center; color: var(--muted); font-size: 0.85rem; }

        .otp-avatar-upload-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; margin-bottom: 1.2rem; }
        .otp-avatar-upload-square {
          width: 100px; height: 100px; border-radius: 14px; background-color: var(--accent-soft);
          background-size: cover; background-position: center top;
          display: flex; align-items: center; justify-content: center; border: 2px dashed var(--accent);
        }
        .otp-avatar-placeholder { font-size: 1.8rem; }
        .otp-avatar-change-btn {
          font-size: 0.78rem; font-weight: 600; color: var(--accent); cursor: pointer;
          padding: 4px 12px; border-radius: 8px; background: var(--accent-soft); font-family: var(--font);
          transition: background 0.2s;
        }
        .otp-avatar-change-btn:hover { background: #dde8ff; }

        .otp-modal-fields { display: flex; flex-direction: column; gap: 0.85rem; }
        .otp-field-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
        @media (max-width: 420px) { .otp-field-row { grid-template-columns: 1fr; } }
        .otp-field-group { display: flex; flex-direction: column; gap: 4px; }
        .otp-field-label { font-size: 0.7rem; font-weight: 700; color: #6b7280; letter-spacing: 0.03em; text-transform: uppercase; }
        .otp-field-input {
          padding: 0.55rem 0.85rem; border: 1.5px solid var(--border); border-radius: 10px;
          font-family: var(--font); font-size: 0.875rem; color: var(--text); outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; width: 100%;
        }
        .otp-field-textarea { resize: vertical; min-height: 64px; font-family: var(--font); }
        .otp-field-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(79,124,255,0.12); }

        .otp-modal-error { font-size: 0.82rem; color: var(--danger); margin: 0.8rem 0 0; font-weight: 500; }

        .otp-modal-actions { display: flex; gap: 0.6rem; margin-top: 1.4rem; }
        .otp-btn-cancel {
          flex: 1; padding: 0.65rem; border-radius: 10px; border: 1.5px solid var(--border); background: none;
          font-family: var(--font); font-size: 0.87rem; font-weight: 600; color: var(--text); cursor: pointer;
          transition: background 0.15s;
        }
        .otp-btn-cancel:hover { background: var(--bg); }
        .otp-btn-save {
          flex: 2; padding: 0.65rem; border-radius: 10px; border: none; background: var(--navy);
          font-family: var(--font); font-size: 0.87rem; font-weight: 700; color: #fff; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .otp-btn-save:hover:not(:disabled) { background: var(--navy-light); transform: translateY(-1px); }
        .otp-btn-save:disabled, .otp-btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }

        .otp-confirm-box { text-align: center; }
        .otp-confirm-icon { font-size: 2.4rem; margin: 0 0 0.5rem; }
        .otp-confirm-title { font-size: 1.05rem; font-weight: 800; color: var(--text); margin: 0 0 0.5rem; }
        .otp-confirm-desc { font-size: 0.87rem; color: var(--muted); margin: 0 0 0.5rem; line-height: 1.6; }
        .otp-btn-delete {
          flex: 2; padding: 0.65rem; border-radius: 10px; border: none; background: var(--danger);
          font-family: var(--font); font-size: 0.87rem; font-weight: 700; color: #fff; cursor: pointer;
          transition: background 0.2s;
        }
        .otp-btn-delete:hover:not(:disabled) { background: #dc2626; }
        .otp-btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 600px) {
          .otp-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
          .otp-stats { grid-template-columns: repeat(1, 1fr); }
        }
      `}</style>

      <div className="otp-wrap">
        {/* Header */}
        <div className="otp-header">
          <div>
            <h1 className="otp-page-title">Official Talent</h1>
            <p className="otp-page-sub">
              Kelola foto & detail Official Talent Hainick
            </p>
          </div>
          <button
            className="otp-add-btn"
            onClick={() => setModal({ mode: "add" })}
          >
            + Tambah Talent
          </button>
        </div>

        {/* Stats */}
        <div className="otp-stats">
          <div className="otp-stat-card">
            <span className="otp-stat-label">Total</span>
            <span className="otp-stat-value">{talents.length}</span>
            <span className="otp-stat-hint">
              {talents.length > 10
                ? "Publik akan menampilkan carousel geser"
                : "talent terdaftar"}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="otp-search-row">
          <input
            className="otp-search"
            type="search"
            placeholder="Cari nama talent..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {!loading && (
            <span className="otp-count-label">
              {filtered.length} dari {talents.length} talent
            </span>
          )}
        </div>

        {/* Grid */}
        <div className="otp-grid">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div className="otp-skeleton-card" key={i}>
                <div className="otp-skel otp-skel-photo" />
                <div style={{ padding: "0.85rem 0.9rem" }}>
                  <div
                    className="otp-skel"
                    style={{ width: "60%", height: 12, marginBottom: 6 }}
                  />
                  <div
                    className="otp-skel"
                    style={{ width: "80%", height: 10 }}
                  />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="otp-empty-state">
              <span className="otp-empty-icon">🎬</span>
              <p className="otp-empty-title">
                {search ? "Talent tidak ditemukan" : "Belum ada talent"}
              </p>
              <p className="otp-empty-sub">
                {search
                  ? `Tidak ada hasil untuk "${search}"`
                  : "Klik + Tambah Talent untuk mulai"}
              </p>
            </div>
          ) : (
            filtered.map((t, i) => (
              <AdminTalentCard
                key={t.id}
                talent={t}
                desc={descMap[t.id]}
                index={i}
                onEdit={(tal) => setModal({ mode: "edit", talent: tal })}
                onDelete={(tal) => setModal({ mode: "delete", talent: tal })}
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
          desc={descMap[modal.talent.id]}
          onClose={() => setModal(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
};

export default OfficialTalentPanel;
