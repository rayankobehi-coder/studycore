'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Download,
  ThumbsUp,
  Flag,
  Search,
  Filter,
  FileText,
  Book,
  FileSpreadsheet,
  Video,
  Link,
} from 'lucide-react';

const resources = [
  {
    id: '1',
    title: 'Cours complet - Algorithmique',
    type: 'PDF',
    subject: 'Algorithmique',
    author: 'M. Dupont',
    downloads: 234,
    votes: 45,
    level: 'BTS',
  },
  {
    id: '2',
    title: 'Exercices - Base de données',
    type: 'EXERCICE',
    subject: 'Base de données',
    author: 'Mme Martin',
    downloads: 189,
    votes: 32,
    level: 'BTS',
  },
  {
    id: '3',
    title: 'Annales - Réseaux 2025',
    type: 'ANNALE',
    subject: 'Réseaux',
    author: 'M. Bernard',
    downloads: 156,
    votes: 28,
    level: 'BTS',
  },
  {
    id: '4',
    title: 'Fiche de révision - Anglais',
    type: 'FICHE',
    subject: 'Anglais',
    author: 'Mme Petit',
    downloads: 98,
    votes: 22,
    level: 'BTS',
  },
  {
    id: '5',
    title: 'Corrigé - Examen Algorithmique',
    type: 'CORRIGE',
    subject: 'Algorithmique',
    author: 'M. Dupont',
    downloads: 312,
    votes: 67,
    level: 'BTS',
  },
  {
    id: '6',
    title: 'Tutoriel vidéo - SQL',
    type: 'VIDEO',
    subject: 'Base de données',
    author: 'Communauté',
    downloads: 445,
    votes: 89,
    level: 'BTS',
  },
];

const typeIcons = {
  PDF: FileText,
  FICHE: Book,
  EXERCICE: FileSpreadsheet,
  ANNALE: FileText,
  CORRIGE: FileText,
  VIDEO: Video,
  LIEN: Link,
};

const typeColors = {
  PDF: 'text-red-600 bg-red-50',
  FICHE: 'text-green-600 bg-green-50',
  EXERCICE: 'text-blue-600 bg-blue-50',
  ANNALE: 'text-purple-600 bg-purple-50',
  CORRIGE: 'text-orange-600 bg-orange-50',
  VIDEO: 'text-rose-600 bg-rose-50',
  LIEN: 'text-gray-600 bg-gray-50',
};

export default function ResourcesPage() {
  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ressources</h1>
          <p className="mt-1 text-gray-500">Bibliothèque de ressources pédagogiques</p>
        </div>
        <Button>
          <BookOpen className="h-4 w-4 mr-2" />
          Partager une ressource
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une ressource..."
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Resources Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => {
          const Icon = typeIcons[resource.type as keyof typeof typeIcons];
          const colorClass = typeColors[resource.type as keyof typeof typeColors];
          return (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`rounded-lg p-2 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline">{resource.type}</Badge>
                </div>
                <h3 className="font-semibold mb-1">{resource.title}</h3>
                <p className="text-sm text-gray-500 mb-1">
                  {resource.subject} · {resource.level}
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  par {resource.author}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {resource.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {resource.votes}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded p-1 text-gray-400 hover:text-indigo-600">
                      <ThumbsUp className="h-4 w-4" />
                    </button>
                    <button className="rounded p-1 text-gray-400 hover:text-red-600">
                      <Flag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AppLayout>
  );
}