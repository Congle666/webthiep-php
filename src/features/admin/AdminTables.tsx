/** Tab Đơn hàng / Liên hệ / Người dùng — bảng đơn giản. */
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { adminApi } from '../../api/client';
import { formatPrice } from '../../data';
import { STATUS_VI, fmtDate } from './shared';

function useRows(loader: () => Promise<any>) {
  const [rows, setRows] = useState<any[] | null>(null);
  const load = () => loader().then((r) => r.success && setRows(r.data ?? []));
  useEffect(() => { load(); }, []);
  return { rows, reload: load };
}

const Spinner = () => <div className="adm-center" style={{ minHeight: 160 }}><Loader2 className="adm-spin" /></div>;
const badge = (s: string) => <span className={`adm-badge adm-badge--${s}`}>{STATUS_VI[s] ?? s}</span>;

export function AdminOrders() {
  const { rows, reload } = useRows(() => adminApi.orders());
  const setPaid = async (id: number) => { await adminApi.updateOrder(id, { paymentStatus: 'paid', status: 'active' }); reload(); };
  if (!rows) return <Spinner />;
  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead><tr><th>Mã đơn</th><th>Khách</th><th>Mẫu</th><th>Gói</th><th>Tiền</th><th>Thanh toán</th><th>Ngày</th><th></th></tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={8} className="adm-empty">Chưa có đơn hàng.</td></tr>}
          {rows.map((o) => (
            <tr key={o.id}>
              <td>{o.order_code}</td>
              <td>{o.customer_name}<br /><span className="adm-sub">{o.customer_email}</span></td>
              <td>{o.template_name}</td><td>{o.plan_name}</td>
              <td>{formatPrice(+o.amount)}</td>
              <td>{badge(o.payment_status)}</td>
              <td>{fmtDate(o.created_at)}</td>
              <td>{o.payment_status !== 'paid' && <button className="adm-mini-btn" onClick={() => setPaid(o.id)}>Xác nhận trả</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminContacts() {
  const { rows, reload } = useRows(() => adminApi.contacts());
  const mark = async (id: number, s: string) => { await adminApi.updateContact(id, s); reload(); };
  if (!rows) return <Spinner />;
  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead><tr><th>Tên</th><th>SĐT</th><th>Email</th><th>Mẫu</th><th>Ghi chú</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={7} className="adm-empty">Chưa có liên hệ.</td></tr>}
          {rows.map((c) => (
            <tr key={c.id}>
              <td>{c.full_name}</td><td>{c.phone}</td><td>{c.email || '—'}</td><td>{c.template_name || '—'}</td>
              <td className="adm-note">{c.note || '—'}</td>
              <td>{badge(c.status)}</td>
              <td>{c.status === 'new' && <button className="adm-mini-btn" onClick={() => mark(c.id, 'contacted')}>Đã liên hệ</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AdminUsers() {
  const { rows, reload } = useRows(() => adminApi.users());
  const toggle = async (id: number, status: string) => { await adminApi.updateUser(id, status === 'active' ? 'blocked' : 'active'); reload(); };
  if (!rows) return <Spinner />;
  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead><tr><th>Tên</th><th>Email</th><th>SĐT</th><th>Vai trò</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={6} className="adm-empty">Chưa có người dùng.</td></tr>}
          {rows.map((u) => (
            <tr key={u.id}>
              <td>{u.full_name}</td><td>{u.email}</td><td>{u.phone || '—'}</td>
              <td>{badge(u.role)}</td><td>{badge(u.status)}</td>
              <td>{u.role !== 'admin' && (
                <button className={`adm-mini-btn ${u.status === 'active' ? 'adm-mini-btn--danger' : ''}`} onClick={() => toggle(u.id, u.status)}>
                  {u.status === 'active' ? 'Khoá' : 'Mở khoá'}
                </button>
              )}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
