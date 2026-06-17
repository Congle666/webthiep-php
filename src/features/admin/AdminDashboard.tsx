/** Tab Tổng quan — stat cards + biểu đồ Recharts. */
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { adminApi, AdminStats } from '../../api/client';
import { formatPrice } from '../../data';
import { PINK, CHART_COLORS, CATEGORY_VI, formatVNDShort } from './shared';

type Charts = {
  revenue: { month: string; orders: number; revenue: number }[];
  byCategory: { category: string; count: number }[];
  byStatus: { status: string; count: number }[];
};

const tipStyle = { background: '#161616', border: '1px solid #2a2a2a', borderRadius: 8, color: '#fafafa', fontSize: 13 };

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [charts, setCharts] = useState<Charts | null>(null);

  useEffect(() => {
    adminApi.stats().then((r) => r.success && r.data && setStats(r.data));
    adminApi.charts().then((r) => r.success && r.data && setCharts(r.data));
  }, []);

  if (!stats) return <div className="adm-center"><Loader2 className="adm-spin" /></div>;

  const cards = [
    ['Mẫu thiệp', stats.templates], ['Đơn hàng', stats.orders],
    ['Thiệp đã đăng', stats.invitations], ['Khách hàng', stats.customers],
    ['Liên hệ mới', stats.newContacts], ['Doanh thu', formatPrice(stats.revenuePaid)],
  ] as const;

  const pieData = (charts?.byCategory ?? []).map((c) => ({
    name: CATEGORY_VI[c.category] ?? c.category, value: c.count,
  }));

  return (
    <>
      <div className="adm-stats">
        {cards.map(([label, val]) => (
          <div className="adm-stat" key={label}>
            <span className="adm-stat-val">{val}</span>
            <span className="adm-stat-label">{label}</span>
          </div>
        ))}
      </div>

      {!charts ? (
        <div className="adm-center" style={{ minHeight: 200 }}><Loader2 className="adm-spin" /></div>
      ) : (
        <div className="adm-charts">
          <div className="adm-card adm-chart adm-chart--wide">
            <h3 className="adm-chart-title">Doanh thu theo tháng</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={charts.revenue} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#1f1f1f" />
                <XAxis dataKey="month" stroke="#777" fontSize={12} />
                <YAxis stroke="#777" fontSize={12} tickFormatter={formatVNDShort} />
                <Tooltip contentStyle={tipStyle} formatter={(v) => formatPrice(Number(v))} labelStyle={{ color: '#aaa' }} />
                <Line type="monotone" dataKey="revenue" name="Doanh thu" stroke={PINK} strokeWidth={2.5} dot={{ r: 3, fill: PINK }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="adm-card adm-chart">
            <h3 className="adm-chart-title">Số đơn theo tháng</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts.revenue} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#1f1f1f" vertical={false} />
                <XAxis dataKey="month" stroke="#777" fontSize={12} />
                <YAxis stroke="#777" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={tipStyle} cursor={{ fill: 'rgba(230,1,126,0.08)' }} labelStyle={{ color: '#aaa' }} />
                <Bar dataKey="orders" name="Đơn hàng" fill={PINK} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="adm-card adm-chart">
            <h3 className="adm-chart-title">Mẫu theo danh mục</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={45} paddingAngle={2}>
                  {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="#0a0a0a" />)}
                </Pie>
                <Tooltip contentStyle={tipStyle} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#aaa' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
