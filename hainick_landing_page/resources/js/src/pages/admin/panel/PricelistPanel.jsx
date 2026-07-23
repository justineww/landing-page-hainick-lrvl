// TODO: Sambungkan ke API backend untuk fetch & update data Pricelist

const PricelistPanel = () => {
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
        .panel-page-sub {
          font-size: 0.82rem;
          color: #9ca3af;
        }
        .panel-add-btn {
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
        .panel-add-btn:hover { background: #263660; transform: translateY(-1px); }

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
        .panel-card-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1a2744;
        }
        .panel-search {
          padding: 0.45rem 0.9rem;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem;
          outline: none;
          width: 200px;
          transition: border-color 0.2s;
        }
        .panel-search:focus { border-color: #1a2744; }

        .panel-table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; font-size: 0.855rem; }
        thead tr { background: #f8fafc; }
        th {
          padding: 0.75rem 1.2rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 700;
          color: #6b7280;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        td {
          padding: 0.85rem 1.2rem;
          color: #374151;
          border-top: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        tr:hover td { background: #f8fafc; }

        .badge {
          display: inline-block;
          padding: 0.2rem 0.65rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .badge-active { background: #dcfce7; color: #16a34a; }
        .badge-draft  { background: #fef9c3; color: #ca8a04; }

        .action-btn {
          background: none;
          border: 1.5px solid #e5e7eb;
          border-radius: 7px;
          padding: 0.28rem 0.65rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          color: #374151;
        }
        .action-btn:hover { border-color: #1a2744; color: #1a2744; }
        .action-btn.del:hover { border-color: #ef4444; color: #ef4444; }

        .empty-state {
          padding: 3rem;
          text-align: center;
          color: #9ca3af;
          font-size: 0.9rem;
        }
        .empty-icon { font-size: 2rem; margin-bottom: 0.5rem; }

        @media (max-width: 600px) {
          .panel-search { width: 100%; }
          th, td { padding: 0.65rem 0.85rem; }
        }
      `}</style>

      <div className="panel-wrap">
        <div className="panel-header">
          <div className="panel-header-left">
            <h1 className="panel-page-title">◇ Pricelist</h1>
            <p className="panel-page-sub">Kelola paket harga layanan</p>
          </div>
          <button className="panel-add-btn">+ Tambah Pricelist</button>
        </div>

        <div className="panel-stats">
          <div className="stat-card">
            <span className="stat-label">Total</span>
            <span className="stat-value">0</span>
            {/* TODO: isi dari API */}
            <span className="stat-hint">item terdaftar</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Aktif</span>
            <span className="stat-value">0</span>
            <span className="stat-hint">ditampilkan di landing</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Draft</span>
            <span className="stat-value">0</span>
            <span className="stat-hint">belum dipublikasi</span>
          </div>
        </div>

        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Daftar Pricelist</span>
            <input
              className="panel-search"
              placeholder="Cari..."
              type="search"
            />
          </div>
          <div className="panel-table-wrap">
            {/* TODO: ganti dengan data dari API — contoh struktur tabel: */}
            {/*
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Contoh Item</td>
                  <td><span className="badge badge-active">Aktif</span></td>
                  <td style={{display:"flex", gap:"0.4rem"}}>
                    <button className="action-btn">Edit</button>
                    <button className="action-btn del">Hapus</button>
                  </td>
                </tr>
              </tbody>
            </table>
            */}
            <div className="empty-state">
              <div className="empty-icon">◇</div>
              <p>Belum ada data Pricelist.</p>
              <p>
                Klik <strong>+ Tambah Pricelist</strong> untuk mulai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PricelistPanel;
