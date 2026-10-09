'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, Clock3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { SubjectResult, SubjectStatus } from '@/lib/types';
import { number } from '@/lib/workspace/dates';

export const statusMeta: Record<SubjectStatus, { label: string; short: string; icon: typeof CheckCircle2; className: string; hex: string }> = {
  VALIDATED: { label: 'Validée', short: 'Validé', icon: CheckCircle2, className: 'status-validated', hex: '#0f9d6b' },
  WARNING: { label: 'À surveiller', short: 'À surveiller', icon: AlertTriangle, className: 'status-warning', hex: '#c77a0a' },
  FAILED: { label: 'Non validée', short: 'À risque', icon: XCircle, className: 'status-failed', hex: '#d6455a' },
  RETAKABLE: { label: 'Rattrapage possible', short: 'Rattrapage', icon: Info, className: 'status-retakable', hex: '#2f7fd1' },
  PENDING: { label: 'En attente de notes', short: 'Sans note', icon: Clock3, className: 'status-pending', hex: '#7a8197' },
};

export function StatusBadge({ status, short = false }: { status: SubjectStatus; short?: boolean }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return <span className={`badge status-bg ${meta.className}`}><Icon size={13} aria-hidden="true" />{short ? meta.short : meta.label}</span>;
}

export function gradeTone(value: number, passing = 10) {
  if (value >= passing + 2) return 'var(--ok)';
  if (value >= passing) return 'var(--text)';
  if (value >= 7) return 'var(--warn)';
  return 'var(--danger)';
}

export function Grade({ value, scale = 20, size = 'md' }: { value: number; scale?: number; size?: 'sm' | 'md' | 'lg' }) {
  const fontSize = size === 'lg' ? '2.4rem' : size === 'md' ? '1.35rem' : '1rem';
  return <span className="num" style={{ fontSize, fontWeight: 740, letterSpacing: '-0.05em', color: gradeTone(value) }}>{number(value)}<small className="faint" style={{ fontSize: '0.46em', marginLeft: 4, letterSpacing: 0 }}>/{scale}</small></span>;
}

export function PageHead({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return (
    <header className="page-head rise">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}

export function StatCard({ label, value, unit, icon, foot, tone = 'brand' }: { label: string; value: ReactNode; unit?: string; icon?: ReactNode; foot?: ReactNode; tone?: 'brand' | 'ok' | 'warn' | 'danger' }) {
  return (
    <article className={`stat-card ${tone === 'brand' ? '' : `stat-accent-${tone}`} rise`}>
      <div className="stat-label">{icon && <span className="stat-icon">{icon}</span>}{label}</div>
      <div className="stat-value">{value}{unit && <small>{unit}</small>}</div>
      {foot && <div className="stat-foot">{foot}</div>}
    </article>
  );
}

export function Delta({ value, suffix = '' }: { value: number; suffix?: string }) {
  if (Math.abs(value) < 0.005) return <span className="muted"><Minus size={14} style={{ verticalAlign: -2 }} /> stable</span>;
  const up = value > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return <span className={`delta ${up ? '' : 'down'}`}><Icon size={15} aria-hidden="true" />{up ? '+' : ''}{number(value, 2)}{suffix}</span>;
}

export function ChartTooltip({ active, payload, label, suffix = '/20' }: { active?: boolean; payload?: { value?: number | string; name?: string; color?: string }[]; label?: string | number; suffix?: string }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tip"><strong>{label}</strong>{payload.map((p, i) => <div key={i} className="num" style={{ color: p.color }}>{typeof p.value === 'number' ? number(p.value) : p.value}{suffix}</div>)}</div>;
}

export function EvolutionChart({ points, target, height = 260 }: { points: { label: string; value: number }[]; target?: number; height?: number }) {
  if (points.length === 0) return <p className="muted">Aucune évolution pour l’instant.</p>;
  return (
    <div className="chart-box" style={{ height }} role="img" aria-label={`Évolution : ${points.map(p => `${p.label} ${number(p.value)}`).join(', ')}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 12, right: 12, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="evo" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#4f46e5" stopOpacity={0.28} /><stop offset="100%" stopColor="#4f46e5" stopOpacity={0} /></linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 6" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-3)', fontSize: 12 }} />
          <YAxis domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-3)', fontSize: 12 }} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--line-strong)' }} />
          {target !== undefined && <Line type="monotone" dataKey={() => target} stroke="var(--warn)" strokeDasharray="6 6" dot={false} name="Objectif" strokeWidth={1.5} />}
          <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2.6} fill="url(#evo)" dot={{ r: 4, fill: 'var(--surface)', stroke: '#4f46e5', strokeWidth: 2 }} activeDot={{ r: 6 }} name="Moyenne" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubjectBars({ results, height = 300 }: { results: SubjectResult[]; height?: number }) {
  const rows = results.filter(r => r.grades.length).map(r => ({ name: r.subjectName, value: Number(r.average.toFixed(2)), hex: statusMeta[r.status].hex }));
  if (!rows.length) return <p className="muted">Ajoute des notes pour voir la répartition.</p>;
  return (
    <div className="chart-box" style={{ height }} role="img" aria-label={`Moyennes par matière : ${rows.map(r => `${r.name} ${number(r.value)}`).join(', ')}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 24, bottom: 0, left: 8 }}>
          <CartesianGrid horizontal={false} stroke="var(--line)" strokeDasharray="3 6" />
          <XAxis type="number" domain={[0, 20]} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-3)', fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={150} tickLine={false} axisLine={false} tick={{ fill: 'var(--text-2)', fontSize: 13 }} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--surface-2)' }} />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={14} name="Moyenne">{rows.map(row => <Cell key={row.name} fill={row.hex} />)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DistributionChart({ results }: { results: SubjectResult[] }) {
  const counts = (['VALIDATED', 'WARNING', 'FAILED', 'RETAKABLE', 'PENDING'] as SubjectStatus[]).map(status => ({ name: statusMeta[status].label, value: results.filter(r => r.status === status).length, hex: statusMeta[status].hex })).filter(d => d.value > 0);
  if (!counts.length) return <p className="muted">Aucune matière à répartir.</p>;
  return (
    <div className="chart-box" style={{ height: 240 }} role="img" aria-label={`Répartition : ${counts.map(c => `${c.name} ${c.value}`).join(', ')}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={counts} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3} stroke="none">
            {counts.map(c => <Cell key={c.name} fill={c.hex} />)}
          </Pie>
          <Tooltip content={<ChartTooltip suffix=" matière(s)" />} />
          <Legend verticalAlign="bottom" iconType="circle" formatter={value => <span style={{ color: 'var(--text-2)', fontSize: 13 }}>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MiniLine({ data, height = 120 }: { data: { label: string; value: number }[]; height?: number }) {
  return (
    <div className="chart-box" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2.4} dot={false} />
          <Tooltip content={<ChartTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProgressBarInline({ value, tone = 'brand' }: { value: number; tone?: 'brand' | 'ok' | 'warn' | 'danger' }) {
  const cls = tone === 'brand' ? '' : `progress-${tone}`;
  return <div className={`progress ${cls}`} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;
}

export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="text-link">{children}</Link>;
}
