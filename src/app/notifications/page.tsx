'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { PageHead } from '@/components/academic';
import { useWorkspace } from '@/components/providers/workspace-provider';
import { Button } from '@/components/ui/button';
import { Segmented } from '@/components/ui/segmented';
import { EmptyState } from '@/components/ui/states';
import { getNotifications } from '@/lib/workspace/selectors';
import { Bell, CalendarClock, CheckCheck, Target, Brain, Circle } from 'lucide-react';
import type { Notification } from '@/lib/types';

const iconFor: Record<Notification['type'], typeof Bell> = { EXAM_SOON: CalendarClock, ASSIGNMENT_SOON: CalendarClock, GOAL_ACHIEVED: Target, GRADE_DROP: Circle, CREDIT_VALIDATED: Target, REVISION_REMINDER: Brain };

export default function NotificationsPage() {
  const { data, update } = useWorkspace();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const all = useMemo(() => getNotifications(data), [data]);
  const list = filter === 'unread' ? all.filter(n => !n.read) : all;

  function setRead(notification: Notification, read: boolean) {
    update(current => {
      const others = current.notifications.filter(n => n.id !== notification.id);
      return { ...current, notifications: [...others, { ...notification, read }] };
    });
  }
  function markAll() {
    update(current => ({ ...current, notifications: all.map(n => ({ ...n, read: true })) }), 'Toutes les notifications sont lues');
  }

  return (
    <AppLayout title="Notifications">
      <PageHead eyebrow="Activité" title="Notifications" description="Échéances, objectifs atteints et rappels de révision." actions={<><Segmented label="Filtrer" value={filter} onChange={setFilter} options={[{ value: 'all', label: 'Toutes' }, { value: 'unread', label: 'Non lues' }]} /><Button variant="outline" onClick={markAll} disabled={all.every(n => n.read)}><CheckCheck size={16} />Tout marquer comme lu</Button></>} />
      {list.length === 0 ? <EmptyState title={filter === 'unread' ? 'Tout est lu.' : 'Rien à signaler.'} description="Les rappels d’examen, les objectifs atteints et les révisions apparaîtront ici." /> : (
        <div className="stack" style={{ gap: 12 }}>
          {list.map(n => {
            const Icon = iconFor[n.type] ?? Bell;
            return (
              <article key={n.id} className={`notif rise ${n.read ? '' : 'is-unread'}`}>
                <span className={`notif-icon ${n.type === 'EXAM_SOON' ? 'warn' : n.type === 'GOAL_ACHIEVED' ? 'ok' : ''}`}><Icon size={19} /></span>
                <div style={{ minWidth: 0 }}>
                  <div className="row" style={{ gap: 8 }}><strong>{n.title}</strong>{!n.read && <span className="dot" aria-label="Non lue" />}</div>
                  <p className="small muted" style={{ marginTop: 4 }}>{n.message}</p>
                  {n.link && <Link href={n.link} className="text-link" style={{ marginTop: 8 }}>Ouvrir</Link>}
                </div>
                <Button size="sm" variant="ghost" onClick={() => setRead(n, !n.read)}>{n.read ? 'Marquer non lue' : 'Marquer lue'}</Button>
              </article>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
