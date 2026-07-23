import { useState, useEffect, useCallback } from "react";
import { API_URL } from "../../../utils/api";

const API = `${API_URL}/api/contact`;
const UPDATE_API = `${API_URL}/api/update-contact`;
const CONTACT_FORM_API = `${API_URL}/api/contact-form`;

async function putFormData(url, payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, val]) => {
    if (val !== undefined && val !== null) formData.append(key, val);
  });
  const res = await fetch(url, { method: "PUT", body: formData });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `HTTP ${res.status}`);
  }
  return res.status !== 204 ? res.json() : null;
}

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const EMPTY_FORM = {
  instagram: "",
  gmail: "",
  phone_number1: "",
  phone_number2: "",
};

// ── PENTING: InputField harus di luar ContactModal ────────────────────────────
// Kalau didefinisikan di dalam ContactModal, setiap render akan membuat
// komponen baru sehingga input kehilangan fokus setiap kali mengetik.
function InputField({
  label,
  type = "text",
  field,
  placeholder,
  icon,
  value,
  onChange,
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="input-wrap">
        <span className="input-icon">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
        />
      </div>
    </div>
  );
}

function ContactModal({ item, mode, onClose, onSave }) {
  const [form, setForm] = useState(
    item
      ? {
          instagram: item.instagram_account ?? item.instagram ?? "",
          gmail: item.gmail_account ?? item.gmail ?? "",
          phone_number1: item.phone_number1 ?? "",
          phone_number2: item.phone_number2 ?? "",
        }
      : { ...EMPTY_FORM },
  );

  const handleChange = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const IGIcon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
  const MailIcon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
  const PhoneIcon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
    </svg>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-box" role="dialog" aria-modal="true">
        <div className="modal-head">
          <h3 className="modal-title">
            {mode === "add" ? "➕ Tambah Kontak" : "✎ Edit Kontak"}
          </h3>
          <button className="modal-close" onClick={onClose} aria-label="Tutup">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Instagram"
            field="instagram"
            placeholder="@username"
            icon={IGIcon}
            value={form.instagram}
            onChange={handleChange}
          />
          <InputField
            label="Gmail / Email"
            type="email"
            field="gmail"
            placeholder="email@domain.com"
            icon={MailIcon}
            value={form.gmail}
            onChange={handleChange}
          />
          <InputField
            label="Nomor Telepon 1"
            field="phone_number1"
            placeholder="+62 878-xxxx-xxxx"
            icon={PhoneIcon}
            value={form.phone_number1}
            onChange={handleChange}
          />
          <InputField
            label="Nomor Telepon 2"
            field="phone_number2"
            placeholder="+62 821-xxxx-xxxx"
            icon={PhoneIcon}
            value={form.phone_number2}
            onChange={handleChange}
          />
          <div className="modal-foot">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {mode === "add" ? "➕ Tambah" : "✎ Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Komponen pesan masuk ──────────────────────────────────────────────────────
function InboxPanel() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getJSON(CONTACT_FORM_API)
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="inbox-wrap">
      <div className="inbox-header">
        <span className="panel-card-title">📨 Pesan Masuk</span>
        <span className="badge badge-gray">{messages.length} pesan</span>
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Memuat pesan…</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <polyline points="2,4 12,13 22,4" />
            </svg>
          </div>
          <p className="empty-state-title">Belum ada pesan masuk</p>
          <p className="empty-state-sub">
            Pesan dari form kontak akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="inbox-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`inbox-item ${selected?.id === msg.id ? "inbox-item-active" : ""}`}
              onClick={() => setSelected(selected?.id === msg.id ? null : msg)}
            >
              <div className="inbox-item-top">
                <span className="inbox-name">
                  {msg.first_name} {msg.last_name}
                </span>
                <span className="inbox-id">#{msg.id}</span>
              </div>
              <span className="inbox-email">{msg.email}</span>
              {selected?.id === msg.id && (
                <div className="inbox-message">
                  <p>{msg.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Komponen utama ────────────────────────────────────────────────────────────
const ContactPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [activeTab, setActiveTab] = useState("info");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await getJSON(API);
      setData(Array.isArray(rows) ? (rows[0] ?? null) : rows);
    } catch (err) {
      console.error("Gagal fetch contacts:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 2500);
  };

  const handleSave = async (payload) => {
    try {
      await putFormData(UPDATE_API, payload);
      await fetchData();
      showToast(
        modalMode === "add"
          ? "✓ Data kontak berhasil ditambahkan"
          : "✓ Data kontak berhasil diperbarui",
      );
    } catch (err) {
      showToast(`✕ ${err.message || "Gagal menyimpan, coba lagi."}`, "error");
    }
    setModalMode(null);
  };

  const fields = [
    {
      key: "instagram_account",
      fallbackKey: "instagram",
      label: "Instagram",
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle
            cx="17.5"
            cy="6.5"
            r="0.8"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      ),
    },
    {
      key: "gmail_account",
      fallbackKey: "gmail",
      label: "Gmail / Email",
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <polyline points="2,4 12,13 22,4" />
        </svg>
      ),
    },
    {
      key: "phone_number1",
      label: "Nomor Telepon 1",
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
        </svg>
      ),
    },
    {
      key: "phone_number2",
      label: "Nomor Telepon 2",
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
        </svg>
      ),
    },
  ];

  const getVal = (item, key, fallbackKey) =>
    item?.[key] ?? (fallbackKey ? item?.[fallbackKey] : undefined);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .panel-wrap { font-family: 'Plus Jakarta Sans', sans-serif; display: flex; flex-direction: column; gap: 1.5rem; }
        .panel-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
        .panel-page-title { font-size: 1.25rem; font-weight: 800; color: #0a0a0a; letter-spacing: -0.02em; margin: 0; }
        .panel-page-sub { font-size: 0.8rem; color: #9ca3af; margin: 2px 0 0; }
        .panel-card { background: #fff; border-radius: 16px; border: 1px solid #e9ecf0; overflow: hidden; }
        .panel-card-header { padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
        .panel-card-title { font-size: 0.875rem; font-weight: 700; color: #1a2744; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0; }
        .info-item { padding: 1.25rem 1.5rem; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
        .info-item:last-child { border-right: none; }
        .info-label { font-size: 0.7rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.07em; display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
        .info-label svg { opacity: 0.6; }
        .info-value { font-size: 0.9rem; font-weight: 600; color: #1a2744; word-break: break-all; }
        .info-value.empty { color: #d1d5db; font-style: italic; font-weight: 400; }
        .panel-foot { padding: 1rem 1.25rem; display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid #f1f5f9; }
        .empty-state { padding: 3rem 1.5rem; text-align: center; }
        .empty-state-icon { width: 56px; height: 56px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; }
        .empty-state-title { font-size: 0.95rem; font-weight: 700; color: #1a2744; margin: 0 0 4px; }
        .empty-state-sub { font-size: 0.8rem; color: #9ca3af; margin: 0 0 1.25rem; }
        .loading-state { padding: 3rem; text-align: center; color: #9ca3af; font-size: 0.875rem; }
        .btn { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 600; border-radius: 8px; padding: 7px 14px; cursor: pointer; border: 1.5px solid; transition: all 0.15s; display: inline-flex; align-items: center; gap: 5px; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-primary { background: #1a2744; color: #fff; border-color: #1a2744; }
        .btn-primary:hover:not(:disabled) { background: #263660; }
        .btn-success { background: #0d9e6f; color: #fff; border-color: #0d9e6f; }
        .btn-success:hover:not(:disabled) { background: #0b8a60; }
        .btn-outline { background: none; color: #374151; border-color: #e5e7eb; }
        .btn-outline:hover:not(:disabled) { border-color: #1a2744; color: #1a2744; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-box { background: #fff; border-radius: 16px; padding: 1.75rem; width: 440px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
        .modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
        .modal-title { font-size: 1rem; font-weight: 800; color: #0a0a0a; margin: 0; letter-spacing: -0.02em; }
        .modal-close { background: none; border: none; font-size: 1rem; cursor: pointer; color: #9ca3af; padding: 2px 6px; border-radius: 6px; transition: all 0.15s; }
        .modal-close:hover { background: #f1f5f9; color: #1a2744; }
        .field { margin-bottom: 14px; }
        .field label { display: block; font-size: 0.75rem; font-weight: 600; color: #374151; margin-bottom: 5px; }
        .input-wrap { position: relative; }
        .input-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: #9ca3af; display: flex; align-items: center; pointer-events: none; }
        .input-wrap input { width: 100%; box-sizing: border-box; padding: 9px 12px 9px 34px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.84rem; color: #0a0a0a; outline: none; transition: border-color 0.2s; }
        .input-wrap input:focus { border-color: #1a2744; }
        .modal-foot { display: flex; justify-content: flex-end; gap: 8px; margin-top: 1.25rem; }
        .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); padding: 10px 22px; border-radius: 10px; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.82rem; font-weight: 600; pointer-events: none; z-index: 2000; animation: fadeInUp 0.2s ease; white-space: nowrap; }
        .toast.success { background: #1a2744; color: #fff; }
        .toast.error { background: #dc2626; color: #fff; }
        @keyframes fadeInUp { from { opacity:0; transform: translateX(-50%) translateY(8px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
        .badge { font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; letter-spacing: 0.04em; text-transform: uppercase; }
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-gray { background: #f1f5f9; color: #64748b; }
        .tab-bar { display: flex; gap: 4px; border-bottom: 1px solid #e9ecf0; padding: 0 1.25rem; }
        .tab-btn { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.8rem; font-weight: 600; padding: 10px 14px; border: none; background: none; cursor: pointer; color: #9ca3af; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; }
        .tab-btn.active { color: #1a2744; border-bottom-color: #1a2744; }
        .tab-btn:hover:not(.active) { color: #374151; }
        .inbox-wrap { display: flex; flex-direction: column; }
        .inbox-header { padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
        .inbox-list { display: flex; flex-direction: column; }
        .inbox-item { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: background 0.12s; display: flex; flex-direction: column; gap: 3px; }
        .inbox-item:hover { background: #f8fafc; }
        .inbox-item-active { background: #f0f4ff; }
        .inbox-item-top { display: flex; align-items: center; justify-content: space-between; }
        .inbox-name { font-size: 0.875rem; font-weight: 700; color: #1a2744; }
        .inbox-id { font-size: 0.7rem; color: #9ca3af; }
        .inbox-email { font-size: 0.78rem; color: #6b7280; }
        .inbox-message { margin-top: 10px; padding: 10px 14px; background: #fff; border: 1px solid #e9ecf0; border-radius: 10px; }
        .inbox-message p { font-size: 0.84rem; color: #374151; line-height: 1.6; margin: 0; white-space: pre-wrap; }
      `}</style>

      <div className="panel-wrap">
        <div className="panel-header">
          <div>
            <h1 className="panel-page-title">✉ Contact Us</h1>
            <p className="panel-page-sub">
              Kelola informasi kontak yang tampil di landing page
            </p>
          </div>
          {!loading && !data && activeTab === "info" && (
            <button
              className="btn btn-success"
              onClick={() => setModalMode("add")}
            >
              ➕ Tambah Kontak
            </button>
          )}
        </div>

        <div className="panel-card">
          <div className="tab-bar">
            <button
              className={`tab-btn ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              Informasi Kontak
            </button>
            <button
              className={`tab-btn ${activeTab === "inbox" ? "active" : ""}`}
              onClick={() => setActiveTab("inbox")}
            >
              Pesan Masuk
            </button>
          </div>

          {activeTab === "info" && (
            <>
              <div className="panel-card-header">
                <span className="panel-card-title">Informasi Kontak</span>
                <span
                  className={`badge ${data ? "badge-success" : "badge-gray"}`}
                >
                  {data ? "Aktif" : "Belum ada data"}
                </span>
              </div>

              {loading ? (
                <div className="loading-state">
                  <p>Memuat data…</p>
                </div>
              ) : !data ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="3" />
                      <polyline points="2,4 12,13 22,4" />
                    </svg>
                  </div>
                  <p className="empty-state-title">Belum ada data kontak</p>
                  <p className="empty-state-sub">
                    Tambahkan informasi kontak untuk ditampilkan di landing
                    page.
                  </p>
                  <button
                    className="btn btn-success"
                    onClick={() => setModalMode("add")}
                  >
                    ➕ Tambah Kontak Sekarang
                  </button>
                </div>
              ) : (
                <div className="info-grid">
                  {fields.map(({ key, fallbackKey, label, icon }) => {
                    const val = getVal(data, key, fallbackKey);
                    return (
                      <div className="info-item" key={key}>
                        <div className="info-label">
                          {icon}
                          {label}
                        </div>
                        <div className={`info-value ${!val ? "empty" : ""}`}>
                          {val || "Belum diisi"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {data && (
                <div className="panel-foot">
                  <button
                    className="btn btn-primary"
                    onClick={() => setModalMode("edit")}
                    disabled={loading}
                  >
                    ✎ Edit Kontak
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "inbox" && <InboxPanel />}
        </div>
      </div>

      {modalMode && (
        <ContactModal
          item={data}
          mode={modalMode}
          onClose={() => setModalMode(null)}
          onSave={handleSave}
        />
      )}

      {toast.msg && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
};

export default ContactPanel;
