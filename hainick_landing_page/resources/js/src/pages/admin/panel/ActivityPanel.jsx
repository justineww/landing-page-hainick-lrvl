import { useState, useEffect, useRef, useCallback } from "react";
import { API_URL } from "../../../utils/api";

const API = "http://localhost:8000/api";

const IMAGE_TYPE_OPTIONS = [
  "image_left",
  "image_center",
  "image_right",
  "image_bottom_left",
  "image_bottom_right",
];

const LABEL_MAP = {
  image_left: "Kiri Atas",
  image_center: "Tengah Atas",
  image_right: "Kanan Atas",
  image_bottom_left: "Kiri Bawah",
  image_bottom_right: "Kanan Bawah",
};

// ─────────────────────────────────────────────────────────────────────────────
// ActivityPanel
// ─────────────────────────────────────────────────────────────────────────────
const ActivityPanel = () => {
  const [savedRows, setSavedRows] = useState([]);
  const [pendingRows, setPendingRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  const [draggingId, setDraggingId] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [dragOverInactive, setDragOverInactive] = useState(false);

  // ── Derived: apakah ada perubahan belum disimpan?
  const isDirty = pendingRows.some((pr) => {
    const sr = savedRows.find((s) => s.id === pr.id);
    if (!sr) return true;
    return (
      Number(sr.is_active) !== Number(pr.is_active) ||
      (sr.image_type ?? null) !== (pr.image_type ?? null)
    );
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/updates-section`);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : [];
      setSavedRows(rows);
      setPendingRows(rows);
    } catch {
      showToast("Gagal memuat data", "error");
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const activeRows = pendingRows.filter((r) => Number(r.is_active) === 1);
  const inactiveRows = pendingRows.filter((r) => Number(r.is_active) !== 1);

  const slotMap = {};
  IMAGE_TYPE_OPTIONS.forEach((slot) => {
    // Hanya card yang is_active=1 yang bisa menempati slot
    slotMap[slot] = activeRows.find((r) => r.image_type === slot) || null;
  });

  // ── Drag handlers ──
  const handleDragStart = (e, row) => {
    setDraggingId(row.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverSlot(null);
    setDragOverInactive(false);
  };

  // ── Drop ke slot aktif ──
  const handleDropOnSlot = (e, slot) => {
    e.preventDefault();
    setDragOverSlot(null);
    if (!draggingId) return;

    const draggedRow = pendingRows.find((r) => r.id === draggingId);
    if (!draggedRow) return;

    // Sudah di slot ini → no-op
    if (Number(draggedRow.is_active) === 1 && draggedRow.image_type === slot)
      return;

    const occupant = slotMap[slot];
    const willDisplace = occupant && occupant.id !== draggedRow.id;

    const draggedOldImageType = draggedRow.image_type ?? null;
    const draggedWasActive = Number(draggedRow.is_active) === 1;

    setPendingRows((prev) =>
      prev.map((r) => {
        if (r.id === draggedRow.id) {
          return { ...r, is_active: 1, image_type: slot };
        }
        if (willDisplace && r.id === occupant.id) {
          if (draggedWasActive && draggedOldImageType) {
            return { ...r, is_active: 1, image_type: draggedOldImageType };
          }
          return { ...r, is_active: 0, image_type: null };
        }
        return r;
      }),
    );
  };

  // ── Drop ke zona non-aktif ──
  const handleDropOnInactive = (e) => {
    e.preventDefault();
    setDragOverInactive(false);
    if (!draggingId) return;
    const row = pendingRows.find((r) => r.id === draggingId);
    if (!row || Number(row.is_active) !== 1) return;

    setPendingRows((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, is_active: 0, image_type: null } : r,
      ),
    );
  };

  // ── Batal: reset ke saved ──
  const handleCancel = () => {
    setPendingRows(savedRows);
  };

  // ── Simpan: kirim semua perubahan ke API ──
  // FIX: ambil snapshot pendingRows saat ini via functional update / parameter
  const handleSaveChanges = async () => {
    setSaving(true);

    // Ambil snapshot terkini dari state (hindari stale closure)
    // Gunakan ref trick: simpan pendingRows ke variabel lokal sebelum async
    const currentPending = [...pendingRows];
    const currentSaved = [...savedRows];

    try {
      const changed = currentPending.filter((pr) => {
        const sr = currentSaved.find((s) => s.id === pr.id);
        if (!sr) return false;
        return (
          Number(sr.is_active) !== Number(pr.is_active) ||
          (sr.image_type ?? null) !== (pr.image_type ?? null)
        );
      });

      if (changed.length === 0) {
        showToast("Tidak ada perubahan");
        setSaving(false);
        return;
      }

      for (const pr of changed) {
        const res = await fetch(
          `${API_URL}/update-updates-section-status/${pr.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              // FIX: kirim sebagai number (0/1), bukan string
              is_active: Number(pr.is_active),
              image_type: pr.image_type ?? null,
            }),
          },
        );
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Gagal update ID ${pr.id}`);
        }
      }

      // FIX: update savedRows dengan snapshot yang sama yang kita kirim ke API
      setSavedRows(currentPending);
      showToast(`✓ ${changed.length} perubahan berhasil disimpan`);
    } catch (err) {
      console.error(err);
      showToast(err?.message || "Gagal menyimpan perubahan", "error");
    } finally {
      setSaving(false);
    }
  };

  // FIX: handleDelete — pastikan menggunakan row.id yang benar
  const handleDelete = async (row) => {
    if (!window.confirm(`Hapus activity ini (ID: ${row.id})?`)) return;
    try {
      const res = await fetch(`${API_URL}/delete-updates-section/${row.id}`, {
        method: "DELETE",
      });

      // FIX: cek response status, bukan abaikan error
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Gagal menghapus");
      }

      // FIX: filter berdasarkan id (number equality safe)
      setSavedRows((prev) => prev.filter((r) => r.id !== row.id));
      setPendingRows((prev) => prev.filter((r) => r.id !== row.id));
      showToast("Activity dihapus");
    } catch (err) {
      console.error(err);
      showToast(err?.message || "Gagal menghapus", "error");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .ap-wrap {
          font-family: 'Plus Jakarta Sans', sans-serif;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .ap-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .ap-header-left { display: flex; flex-direction: column; gap: 3px; }
        .ap-page-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
        }
        .ap-page-sub { font-size: 0.82rem; color: #9ca3af; }
        .ap-add-btn {
          background: #1a2744;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.6rem 1.2rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: background 0.2s, transform 0.15s;
        }
        .ap-add-btn:hover { background: #263660; transform: translateY(-1px); }

        .ap-section-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b7280;
          margin: 0 0 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ap-section-label .count-pill {
          background: #e0e7ff;
          color: #3730a3;
          border-radius: 100px;
          padding: 0.1rem 0.55rem;
          font-size: 0.68rem;
          font-weight: 800;
        }
        .ap-section-label .count-pill.green {
          background: #dcfce7;
          color: #15803d;
        }

        .ap-save-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          background: #fffbeb;
          border: 1.5px solid #fbbf24;
          border-radius: 12px;
          padding: 0.85rem 1.2rem;
          animation: ap-bar-in 0.25s ease;
        }
        @keyframes ap-bar-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ap-save-bar-msg {
          font-size: 0.83rem;
          font-weight: 600;
          color: #92400e;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ap-save-bar-actions { display: flex; gap: 0.6rem; }

        .btn-bar-cancel {
          background: #fff;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.45rem 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          color: #374151;
          transition: background 0.15s, border-color 0.15s;
        }
        .btn-bar-cancel:hover { background: #f9fafb; border-color: #d1d5db; }

        .btn-bar-save {
          background: #1a2744;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.45rem 1.2rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .btn-bar-save:hover:not(:disabled) { background: #263660; }
        .btn-bar-save:disabled { opacity: 0.55; cursor: not-allowed; }

        .ap-active-zone {
          background: #f8fafc;
          border: 1.5px dashed #cbd5e1;
          border-radius: 16px;
          padding: 1.1rem;
          transition: border-color 0.2s, background 0.2s;
        }
        .ap-slots-top {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 10px;
        }
        .ap-slots-bottom {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .ap-slot {
          position: relative;
          border-radius: 10px;
          border: 2px dashed #e2e8f0;
          background: #fff;
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 0.4rem;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }
        .ap-slots-bottom .ap-slot { aspect-ratio: 16/9; }
        .ap-slot.has-card { border-style: solid; border-color: transparent; }
        .ap-slot.drag-target {
          border-color: #1a2744;
          background: #eef2ff;
          box-shadow: 0 0 0 4px rgba(26,39,68,0.08);
        }
        .ap-slot-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.05em;
          text-align: center;
          pointer-events: none;
          user-select: none;
          padding: 0 0.5rem;
        }
        .ap-slot-empty-icon {
          font-size: 1.2rem;
          opacity: 0.35;
          pointer-events: none;
        }

        .ap-slot-card {
          position: absolute;
          inset: 0;
          border-radius: 8px;
          overflow: hidden;
          cursor: grab;
        }
        .ap-slot-card:active { cursor: grabbing; }
        .ap-slot-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
          user-select: none;
        }
        .ap-slot-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.2s;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 10px;
          gap: 6px;
        }
        .ap-slot-card:hover .ap-slot-card-overlay { opacity: 1; }
        .ap-slot-card-actions { display: flex; gap: 5px; }
        .ap-slot-card-btn {
          background: rgba(255,255,255,0.92);
          border: none;
          border-radius: 6px;
          padding: 0.2rem 0.55rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          color: #1a2744;
          transition: background 0.15s;
        }
        .ap-slot-card-btn:hover { background: #fff; }
        .ap-slot-card-btn.del { color: #ef4444; }
        .ap-slot-card-btn.del:hover { background: #fef2f2; }
        .ap-slot-card-drag-hint {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.75);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ap-slot-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(4px);
          border-radius: 6px;
          padding: 0.15rem 0.5rem;
          font-size: 0.65rem;
          font-weight: 700;
          color: #1a2744;
          pointer-events: none;
          z-index: 2;
        }
        .ap-slot-pending-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f59e0b;
          border: 2px solid #fff;
          z-index: 3;
          pointer-events: none;
        }
        .ap-slot-card.is-dragging { opacity: 0.4; }

        .ap-inactive-zone {
          border: 1.5px dashed #e2e8f0;
          border-radius: 16px;
          padding: 1.1rem;
          background: #fff;
          min-height: 120px;
          transition: border-color 0.2s, background 0.2s;
        }
        .ap-inactive-zone.drag-over {
          border-color: #f59e0b;
          background: #fffbeb;
        }
        .ap-inactive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
        }
        .ap-inactive-card {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          background: #f1f5f9;
          aspect-ratio: 4/3;
          cursor: grab;
          border: 2px solid transparent;
          transition: border-color 0.2s, transform 0.15s;
        }
        .ap-inactive-card:active { cursor: grabbing; }
        .ap-inactive-card:hover { transform: translateY(-2px); }
        .ap-inactive-card.is-dragging { opacity: 0.35; }
        .ap-inactive-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
          user-select: none;
        }
        .ap-inactive-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.65) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.2s;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 8px;
          gap: 5px;
        }
        .ap-inactive-card:hover .ap-inactive-card-overlay { opacity: 1; }
        .ap-inactive-card-actions { display: flex; gap: 4px; }
        .ap-inactive-card-btn {
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 5px;
          padding: 0.18rem 0.5rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          cursor: pointer;
          color: #1a2744;
          transition: background 0.15s;
        }
        .ap-inactive-card-btn:hover { background: #fff; }
        .ap-inactive-card-btn.del { color: #ef4444; }
        .ap-inactive-card-btn.del:hover { background: #fef2f2; }
        .ap-inactive-card-drag-hint {
          font-size: 0.6rem;
          color: rgba(255,255,255,0.75);
          font-weight: 600;
        }
        .ap-inactive-empty {
          padding: 2rem;
          text-align: center;
          color: #cbd5e1;
          font-size: 0.82rem;
        }

        .ap-legend {
          background: #f8fafc;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.78rem;
          color: #64748b;
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          line-height: 1.6;
        }
        .ap-legend-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }

        .ap-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9999;
          padding: 0.75rem 1.2rem;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          animation: ap-slidein 0.25s ease;
        }
        .ap-toast.success { background: #1a2744; color: #fff; }
        .ap-toast.error   { background: #ef4444; color: #fff; }
        @keyframes ap-slidein {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ap-modal-bg {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(10,10,10,0.45);
          backdrop-filter: blur(2px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .ap-modal {
          background: #fff;
          border-radius: 18px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.18);
          overflow: hidden;
        }
        .ap-modal-header {
          padding: 1.3rem 1.5rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ap-modal-title { font-size: 1rem; font-weight: 700; color: #1a2744; }
        .ap-modal-close {
          background: none; border: none; font-size: 1.2rem;
          cursor: pointer; color: #9ca3af; line-height: 1;
        }
        .ap-modal-close:hover { color: #374151; }
        .ap-modal-body { padding: 1.3rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .ap-modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #f1f5f9;
          display: flex; gap: 0.75rem; justify-content: flex-end;
        }
        .ap-field { display: flex; flex-direction: column; gap: 0.35rem; }
        .ap-field label { font-size: 0.8rem; font-weight: 600; color: #374151; }
        .ap-field select,
        .ap-field input[type="text"],
        .ap-field textarea {
          padding: 0.55rem 0.85rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
          color: #0a0a0a;
        }
        .ap-field select:focus,
        .ap-field input[type="text"]:focus,
        .ap-field textarea:focus { border-color: #1a2744; }
        .ap-field textarea { resize: vertical; min-height: 90px; }
        .ap-field input[type="file"] { font-size: 0.82rem; color: #6b7280; }
        .ap-img-preview {
          width: 100%;
          max-height: 140px;
          object-fit: cover;
          border-radius: 8px;
          margin-top: 0.4rem;
        }
        .btn-cancel {
          background: #f1f5f9; border: none; border-radius: 9px;
          padding: 0.6rem 1.2rem; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
          color: #374151; transition: background 0.2s;
        }
        .btn-cancel:hover { background: #e2e8f0; }
        .btn-save {
          background: #1a2744; color: #fff; border: none; border-radius: 9px;
          padding: 0.6rem 1.4rem; font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
          transition: background 0.2s;
        }
        .btn-save:hover { background: #263660; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 600px) {
          .ap-slots-top { grid-template-columns: repeat(2, 1fr); }
          .ap-inactive-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
          .ap-save-bar { flex-direction: column; align-items: stretch; }
          .ap-save-bar-actions { justify-content: flex-end; }
        }
      `}</style>

      <div className="ap-wrap">
        {/* ── Header ── */}
        <div className="ap-header">
          <div className="ap-header-left">
            <h1 className="ap-page-title">◉ Activity</h1>
            <p className="ap-page-sub">
              Drag kartu ke slot posisi untuk mengaktifkan · maks. 5 aktif
            </p>
          </div>
          <button
            className="ap-add-btn"
            onClick={() => setModal({ mode: "add" })}
          >
            + Tambah Activity
          </button>
        </div>

        {/* ── Legend ── */}
        <div className="ap-legend">
          <span className="ap-legend-icon">💡</span>
          <span>
            <strong>Cara pakai:</strong> Drag kartu dari <em>Non-aktif</em> ke
            slot posisi yang diinginkan di zona <em>Aktif</em> untuk
            menampilkannya di landing page. Drag kartu aktif ke zona{" "}
            <em>Non-aktif</em> untuk menyembunyikannya. Drag kartu aktif ke slot
            lain untuk menukar posisinya. Setelah selesai mengatur, klik{" "}
            <strong>Simpan Perubahan</strong> untuk menerapkan ke tampilan
            depan.
          </span>
        </div>

        {/* ── Save/Cancel bar ── */}
        {isDirty && (
          <div className="ap-save-bar">
            <span className="ap-save-bar-msg">
              ⚠️ Ada perubahan yang belum disimpan
            </span>
            <div className="ap-save-bar-actions">
              <button
                className="btn-bar-cancel"
                onClick={handleCancel}
                disabled={saving}
              >
                Batal
              </button>
              <button
                className="btn-bar-save"
                onClick={handleSaveChanges}
                disabled={saving}
              >
                {saving ? "⏳ Menyimpan…" : "✓ Simpan Perubahan"}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div
            style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}
          >
            ⏳ Memuat data…
          </div>
        ) : (
          <>
            {/* ═══ ZONA AKTIF ═══ */}
            <div>
              <p className="ap-section-label">
                Aktif
                <span className="count-pill green">
                  {activeRows.length} / 5
                </span>
              </p>
              <div className="ap-active-zone">
                <div className="ap-slots-top">
                  {IMAGE_TYPE_OPTIONS.slice(0, 3).map((slot) => (
                    <ActiveSlot
                      key={slot}
                      slot={slot}
                      label={LABEL_MAP[slot]}
                      card={slotMap[slot]}
                      draggingId={draggingId}
                      isDragTarget={dragOverSlot === slot}
                      savedRows={savedRows}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverSlot(slot);
                      }}
                      onDragLeave={() => setDragOverSlot(null)}
                      onDrop={(e) => handleDropOnSlot(e, slot)}
                      onEdit={(card) => setModal({ mode: "edit", data: card })}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
                <div className="ap-slots-bottom">
                  {IMAGE_TYPE_OPTIONS.slice(3).map((slot) => (
                    <ActiveSlot
                      key={slot}
                      slot={slot}
                      label={LABEL_MAP[slot]}
                      card={slotMap[slot]}
                      draggingId={draggingId}
                      isDragTarget={dragOverSlot === slot}
                      savedRows={savedRows}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverSlot(slot);
                      }}
                      onDragLeave={() => setDragOverSlot(null)}
                      onDrop={(e) => handleDropOnSlot(e, slot)}
                      onEdit={(card) => setModal({ mode: "edit", data: card })}
                      onDelete={handleDelete}
                      wide
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ ZONA NON-AKTIF ═══ */}
            <div>
              <p className="ap-section-label">
                Non-aktif
                <span className="count-pill">{inactiveRows.length}</span>
              </p>
              <div
                className={`ap-inactive-zone${dragOverInactive ? " drag-over" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverInactive(true);
                }}
                onDragLeave={() => setDragOverInactive(false)}
                onDrop={handleDropOnInactive}
              >
                {inactiveRows.length === 0 ? (
                  <div className="ap-inactive-empty">
                    Tidak ada kartu non-aktif.
                    <br />
                    Drag kartu aktif ke sini untuk menyembunyikannya.
                  </div>
                ) : (
                  <div className="ap-inactive-grid">
                    {inactiveRows.map((row) => (
                      <InactiveCard
                        key={row.id}
                        row={row}
                        draggingId={draggingId}
                        savedRows={savedRows}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onEdit={() => setModal({ mode: "edit", data: row })}
                        onDelete={() => handleDelete(row)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <ActivityModal
          mode={modal.mode}
          data={modal.data}
          activeCount={activeRows.length}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null);
            fetchData();
            showToast(
              modal.mode === "add"
                ? "Activity ditambahkan"
                : "Activity diperbarui",
            );
          }}
          showToast={showToast}
        />
      )}

      {/* ── Toast ── */}
      {toast && <div className={`ap-toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ActiveSlot
// ─────────────────────────────────────────────────────────────────────────────
function ActiveSlot({
  slot,
  label,
  card,
  draggingId,
  isDragTarget,
  savedRows,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onEdit,
  onDelete,
  wide,
}) {
  const isPending = card
    ? (() => {
        const saved = savedRows.find((s) => s.id === card.id);
        return (
          !saved ||
          Number(saved.is_active) !== Number(card.is_active) ||
          (saved.image_type ?? null) !== (card.image_type ?? null)
        );
      })()
    : false;

  return (
    <div
      className={`ap-slot${card ? " has-card" : ""}${isDragTarget ? " drag-target" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={wide ? { aspectRatio: "16/9" } : {}}
    >
      {!card ? (
        <>
          <span className="ap-slot-empty-icon">⊕</span>
          <span className="ap-slot-label">{label}</span>
        </>
      ) : (
        <div
          className={`ap-slot-card${draggingId === card.id ? " is-dragging" : ""}`}
          draggable
          onDragStart={(e) => onDragStart(e, card)}
          onDragEnd={onDragEnd}
        >
          <img src={`http://localhost:8000${card.image_url}`} alt={label} />
          <span className="ap-slot-badge">{label}</span>
          {isPending && (
            <span className="ap-slot-pending-dot" title="Belum disimpan" />
          )}
          <div className="ap-slot-card-overlay">
            <span className="ap-slot-card-drag-hint">⠿ Drag untuk pindah</span>
            <div className="ap-slot-card-actions">
              <button className="ap-slot-card-btn" onClick={() => onEdit(card)}>
                Edit
              </button>
              <button
                className="ap-slot-card-btn del"
                onClick={() => onDelete(card)}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// InactiveCard
// ─────────────────────────────────────────────────────────────────────────────
function InactiveCard({
  row,
  draggingId,
  savedRows,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
}) {
  const isPending = (() => {
    const saved = savedRows.find((s) => s.id === row.id);
    return saved && Number(saved.is_active) !== Number(row.is_active);
  })();

  return (
    <div
      className={`ap-inactive-card${draggingId === row.id ? " is-dragging" : ""}`}
      draggable
      onDragStart={(e) => onDragStart(e, row)}
      onDragEnd={onDragEnd}
      style={
        isPending ? { outline: "2px solid #f59e0b", outlineOffset: "2px" } : {}
      }
    >
      {row.image_url ? (
        <img src={`http://localhost:8000${row.image_url}`} alt="" />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.7rem",
            color: "#94a3b8",
          }}
        >
          No img
        </div>
      )}
      <div className="ap-inactive-card-overlay">
        <span className="ap-inactive-card-drag-hint">⠿ Drag ke slot aktif</span>
        <div className="ap-inactive-card-actions">
          <button className="ap-inactive-card-btn" onClick={onEdit}>
            Edit
          </button>
          <button className="ap-inactive-card-btn del" onClick={onDelete}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ActivityModal
// FIX: edit gambar sekarang menggunakan endpoint by ID, bukan by image_type
// ─────────────────────────────────────────────────────────────────────────────
const ActivityModal = ({
  mode,
  data,
  activeCount,
  onClose,
  onSuccess,
  showToast,
}) => {
  const isEdit = mode === "edit";
  const [imageType, setImageType] = useState(data?.image_type || "");
  const [description, setDescription] = useState(data?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(
    data?.image_url ? `http://localhost:8000${data.image_url}` : null,
  );
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!imageType) {
      showToast("Pilih image type", "error");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        // FIX: Update gambar menggunakan endpoint by ID agar tidak menimpa row lain
        // yang kebetulan punya image_type sama
        if (imageFile) {
          const fd = new FormData();
          fd.append("image", imageFile);
          // Gunakan endpoint baru by ID (lihat catatan backend di bawah)
          const res = await fetch(
            `${API_URL}/update-updates-section-image-by-id/${data.id}`,
            {
              method: "PUT",
              body: fd,
            },
          );
          if (!res.ok) {
            // Fallback ke endpoint lama jika endpoint baru belum ada
            const fd2 = new FormData();
            fd2.append("image", imageFile);
            fd2.append("image_type", imageType);
            await fetch(
              `${API_URL}/update-updates-section-image/${imageType}`,
              {
                method: "PUT",
                body: fd2,
              },
            );
          }
        }
        if (description !== (data?.description || "")) {
          await fetch(`${API_URL}/update-updates-section-description`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description, image_type: imageType }),
          });
        }
      } else {
        if (!imageFile) {
          showToast("Gambar harus diunggah", "error");
          setSaving(false);
          return;
        }
        const fd = new FormData();
        fd.append("image", imageFile);
        fd.append("image_type", imageType);
        fd.append("description", description);
        // FIX: new record selalu is_active=0, biarkan user drag ke slot
        fd.append("is_active", "0");
        await fetch(`${API_URL}/create-updates-section-image`, {
          method: "POST",
          body: fd,
        });
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      showToast("Gagal menyimpan", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="ap-modal-bg"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ap-modal">
        <div className="ap-modal-header">
          <span className="ap-modal-title">
            {isEdit ? "Edit Activity" : "Tambah Activity"}
          </span>
          <button className="ap-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="ap-modal-body">
          <div className="ap-field">
            <label>
              Image Type <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
              disabled={isEdit}
            >
              <option value="">— Pilih posisi —</option>
              {IMAGE_TYPE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {LABEL_MAP[opt]}
                </option>
              ))}
            </select>
          </div>
          <div className="ap-field">
            <label>
              Gambar {!isEdit && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleFile}
            />
            {preview && (
              <img className="ap-img-preview" src={preview} alt="preview" />
            )}
          </div>
          <div className="ap-field">
            <label>Deskripsi Aktivitas</label>
            <textarea
              placeholder="Ceritakan tentang aktivitas ini…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {!isEdit && activeCount >= 5 && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                fontSize: "0.82rem",
                color: "#ef4444",
              }}
            >
              ⚠️ Sudah ada 5 activity aktif. Activity baru akan disimpan sebagai{" "}
              <strong>non-aktif</strong>.
            </div>
          )}
        </div>
        <div className="ap-modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Batal
          </button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityPanel;
