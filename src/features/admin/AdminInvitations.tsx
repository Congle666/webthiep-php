/** Tab Thiệp sống — bảng + panel chi tiết RSVP/sổ lưu bút. */
import { useEffect, useState } from 'react';
import { Loader2, X, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { adminApi } from '../../api/client';
import { fmtDate } from './shared';

export default function AdminInvitations() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [detail, setDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => { adminApi.invitations().then((r) => r.success && setRows(r.data ?? [])); }, []);

  const open = async (id: number) => {
    setLoadingDetail(true); setDetail({});
    const r = await adminApi.invitationDetail(id);
    setLoadingDetail(false);
    if (r.success) setDetail(r.data);
  };

  const toggleWish = async (w: any) => {
    await adminApi.updateGuestbook(w.id, !w.is_approved);
    setDetail((d: any) => ({ ...d, guestbook: d.guestbook.map((g: any) => g.id === w.id ? { ...g, is_approved: !g.is_approved } : g) }));
  };

  if (!rows) return <div className="adm-center" style={{ minHeight: 160 }}><Loader2 className="adm-spin" /></div>;

  return (
    <>
      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead><tr><th>Cặp đôi</th><th>Chủ thiệp</th><th>Mẫu</th><th>Ngày cưới</th><th>Lượt xem</th><th>RSVP</th><th>Lời chúc</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={9} className="adm-empty">Chưa có thiệp nào.</td></tr>}
            {rows.map((iv) => (
              <tr key={iv.id} className="adm-row-click" onClick={() => open(iv.id)}>
                <td>{iv.groom_name} &amp; {iv.bride_name}</td>
                <td>{iv.owner}</td><td>{iv.template_name}</td>
                <td>{fmtDate(iv.wedding_date)}</td>
                <td>{iv.view_count}</td><td>{iv.rsvp_count}</td><td>{iv.wish_count}</td>
                <td><span className={`adm-badge adm-badge--${iv.is_published ? 'paid' : 'unpaid'}`}>{iv.is_published ? 'Đã đăng' : 'Nháp'}</span></td>
                <td><a href={`/thiep/${iv.slug}`} target="_blank" rel="noreferrer" className="adm-icon-link" onClick={(e) => e.stopPropagation()} aria-label="Mở thiệp"><ExternalLink size={15} /></a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div className="adm-modal-overlay" onClick={() => setDetail(null)}>
          <div className="adm-panel" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-head"><h3>Chi tiết thiệp</h3><button onClick={() => setDetail(null)}><X size={18} /></button></div>
            {loadingDetail || !detail.id ? <div className="adm-center" style={{ minHeight: 120 }}><Loader2 className="adm-spin" /></div> : (
              <>
                <p className="adm-panel-sub">{detail.groom_name} &amp; {detail.bride_name}</p>
                <h4 className="adm-chart-title">RSVP ({detail.rsvps?.length ?? 0})</h4>
                {(!detail.rsvps || detail.rsvps.length === 0) && <p className="adm-empty">Chưa có phản hồi.</p>}
                {detail.rsvps?.map((r: any, i: number) => (
                  <div className="adm-mini-row" key={i}>
                    <strong>{r.guest_name}</strong>
                    <span className={`adm-badge adm-badge--${r.attendance === 'yes' ? 'paid' : r.attendance === 'no' ? 'spam' : 'new'}`}>{r.attendance === 'yes' ? 'Tham dự' : r.attendance === 'no' ? 'Vắng' : 'Có thể'}</span>
                    <span className="adm-sub">{r.guest_count} khách</span>
                    {r.message && <em className="adm-sub">"{r.message}"</em>}
                  </div>
                ))}
                <h4 className="adm-chart-title" style={{ marginTop: 20 }}>Sổ lưu bút ({detail.guestbook?.length ?? 0})</h4>
                {(!detail.guestbook || detail.guestbook.length === 0) && <p className="adm-empty">Chưa có lời chúc.</p>}
                {detail.guestbook?.map((w: any) => (
                  <div className="adm-mini-row" key={w.id}>
                    <strong>{w.guest_name}</strong>
                    <span className="adm-sub" style={{ flex: 1 }}>{w.message}</span>
                    <button className="adm-mini-btn adm-mini-btn--ghost" onClick={() => toggleWish(w)} aria-label="Duyệt/ẩn">
                      {w.is_approved ? <><Eye size={13} /> Hiện</> : <><EyeOff size={13} /> Ẩn</>}
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
