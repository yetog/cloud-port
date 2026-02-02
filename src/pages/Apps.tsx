import { useState } from 'react';
import { Link } from 'react-router-dom';
import { finishedApps, testingApps, upgradingApps, App, AppStatus } from '../data/apps';
import {
  ExternalLink, Github, Search, CheckCircle, FlaskConical, Wrench,
  LayoutGrid, List, ArrowLeft, ChevronDown
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FF7Panel } from '@/components/rpg';

const statusConfig = {
  finished: {
    label: 'Finished',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    dotColor: 'bg-green-500',
  },
  testing: {
    label: 'Testing',
    icon: FlaskConical,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    dotColor: 'bg-yellow-500',
  },
  upgrading: {
    label: 'Upgrading',
    icon: Wrench,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    dotColor: 'bg-blue-500',
  }
};

// Compact List Row
const AppListItem = ({ app }: { app: App }) => {
  const config = statusConfig[app.status];

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all group">
      {/* Status Dot */}
      <div className={`w-2 h-2 rounded-full ${config.dotColor} flex-shrink-0`} />

      {/* Title & Description */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
          {app.title}
        </h3>
        <p className="text-xs text-muted-foreground truncate">
          {app.description}
        </p>
      </div>

      {/* Tags - Hidden on mobile */}
      <div className="hidden md:flex gap-1 flex-shrink-0">
        {app.tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        {app.appUrl && (
          <a
            href={app.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Launch"
          >
            <ExternalLink size={14} />
          </a>
        )}
        {app.githubUrl && (
          <a
            href={app.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="View Code"
          >
            <Github size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

// Compact Grid Card
const AppGridCard = ({ app }: { app: App }) => {
  const config = statusConfig[app.status];

  return (
    <div className="group p-4 rounded-xl border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
          {app.title}
        </h3>
        <div className={`w-2 h-2 rounded-full ${config.dotColor} flex-shrink-0 mt-1.5`} />
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {app.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {app.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        {app.appUrl && (
          <a
            href={app.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
          >
            <ExternalLink size={12} />
            Launch
          </a>
        )}
        {app.githubUrl && (
          <a
            href={app.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${app.appUrl ? '' : 'flex-1'} flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg bg-muted/50 text-muted-foreground text-xs font-medium hover:bg-muted hover:text-foreground transition-colors`}
          >
            <Github size={12} />
            Code
          </a>
        )}
      </div>
    </div>
  );
};

// Section Component
const AppSection = ({
  title,
  apps,
  status,
  viewMode,
  defaultOpen = true
}: {
  title: string;
  apps: App[];
  status: AppStatus;
  viewMode: 'grid' | 'list';
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  if (apps.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Section Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-card/30 border border-border/30 hover:bg-card/50 transition-colors mb-4"
      >
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-5 h-5 ${config.color}`} />
          <span className="font-semibold">{title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
            {apps.length}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Content */}
      {isOpen && (
        viewMode === 'list' ? (
          <div className="space-y-2">
            {apps.map(app => (
              <AppListItem key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {apps.map(app => (
              <AppGridCard key={app.id} app={app} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

const Apps = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const allApps = [...finishedApps, ...testingApps, ...upgradingApps];

  const filterApps = (apps: App[]) => {
    return apps.filter(app => {
      return searchTerm === '' ||
        app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  };

  const filteredFinished = filterApps(finishedApps);
  const filteredTesting = filterApps(testingApps);
  const filteredUpgrading = filterApps(upgradingApps);
  const totalFiltered = filteredFinished.length + filteredTesting.length + filteredUpgrading.length;

  return (
    <div className="min-h-screen bg-background bg-grid">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span>Back to Portfolio</span>
        </Link>

        {/* Header */}
        <FF7Panel className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-glow mb-2">Apps Collection</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle size={14} className="text-green-500" />
                  {finishedApps.length} Finished
                </span>
                <span className="flex items-center gap-1">
                  <FlaskConical size={14} className="text-yellow-500" />
                  {testingApps.length} Testing
                </span>
                <span className="flex items-center gap-1">
                  <Wrench size={14} className="text-blue-500" />
                  {upgradingApps.length} Upgrading
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-40 md:w-56 bg-background/50 border-border/50"
                />
              </div>

              {/* View Toggle */}
              <div className="flex rounded-lg border border-border/50 overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary/20 text-primary' : 'bg-background/50 text-muted-foreground hover:text-foreground'}`}
                  title="List view"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'bg-background/50 text-muted-foreground hover:text-foreground'}`}
                  title="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
              </div>
            </div>
          </div>
        </FF7Panel>

        {/* Search Results */}
        {searchTerm && (
          <p className="text-sm text-muted-foreground mb-4">
            Found {totalFiltered} app{totalFiltered !== 1 ? 's' : ''} matching "{searchTerm}"
          </p>
        )}

        {/* App Sections */}
        <AppSection
          title="Finished Apps"
          apps={filteredFinished}
          status="finished"
          viewMode={viewMode}
          defaultOpen={true}
        />

        <AppSection
          title="Apps in Testing"
          apps={filteredTesting}
          status="testing"
          viewMode={viewMode}
          defaultOpen={false}
        />

        <AppSection
          title="Apps Being Upgraded"
          apps={filteredUpgrading}
          status="upgrading"
          viewMode={viewMode}
          defaultOpen={false}
        />

        {/* No Results */}
        {totalFiltered === 0 && searchTerm && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No apps found</h3>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Apps;
