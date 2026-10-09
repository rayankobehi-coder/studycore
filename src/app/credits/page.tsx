'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
} from 'lucide-react';

const creditsData = [
  { id: '1', name: 'Algorithmique', credits: 6, earned: 6, status: 'VALIDATED' as const },
  { id: '2', name: 'Base de données', credits: 6, earned: 0, status: 'FAILED' as const },
  { id: '3', name: 'Réseaux', credits: 6, earned: 6, status: 'VALIDATED' as const },
  { id: '4', name: 'Anglais', credits: 3, earned: 3, status: 'VALIDATED' as const },
  { id: '5', name: 'Mathématiques', credits: 6, earned: 0, status: 'PENDING' as const },
];

const statusIcons = {
  VALIDATED: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Acquis' },
  FAILED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Non acquis' },
  PENDING: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'En attente' },
  WARNING: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', label: 'À risque' },
};

export default function CreditsPage() {
  const totalCredits = creditsData.reduce((sum, c) => sum + c.credits, 0);
  const earnedCredits = creditsData.reduce((sum, c) => sum + c.earned, 0);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crédits</h1>
        <p className="mt-1 text-gray-500">Suivi de tes crédits ECTS</p>
      </div>

      {/* Overview */}
      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Crédits obtenus</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{earnedCredits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Crédits restants</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalCredits - earnedCredits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500">Progression</p>
            <div className="mt-2">
              <Progress value={(earnedCredits / totalCredits) * 100} />
              <p className="text-sm text-gray-500 mt-1">
                {Math.round((earnedCredits / totalCredits) * 100)}% complété
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credits List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-indigo-600" />
            Détail des crédits par matière
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creditsData.map((credit) => {
              const status = statusIcons[credit.status];
              const StatusIcon = status.icon;
              return (
                <div
                  key={credit.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-2 ${status.bg}`}>
                      <StatusIcon className={`h-5 w-5 ${status.color}`} />
                    </div>
                    <div>
                      <p className="font-medium">{credit.name}</p>
                      <p className="text-sm text-gray-500">
                        {credit.earned}/{credit.credits} crédits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress
                      value={(credit.earned / credit.credits) * 100}
                      className="w-24"
                    />
                    <Badge
                      variant={
                        credit.status === 'VALIDATED'
                          ? 'success'
                          : credit.status === 'FAILED'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {status.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}