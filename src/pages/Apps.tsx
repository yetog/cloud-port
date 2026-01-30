import { useState } from 'react';
import { finishedApps, testingApps, upgradingApps, App, AppStatus } from '../data/apps';
import { ExternalLink, Github, Search, Filter, CheckCircle, FlaskConical, Wrench } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusConfig = {
  finished: {
    label: 'Finished',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    description: 'Production ready, fully functional applications'
  },
  testing: {
    label: 'In Testing',
    icon: FlaskConical,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    description: 'Beta and experimental applications'
  },
  upgrading: {
    label: 'Upgrading',
    icon: Wrench,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    description: 'Active development, being enhanced'
  }
};

const AppCard = ({ app, index }: { app: App; index: number }) => {
  const config = statusConfig[app.status];
  const StatusIcon = config.icon;

  return (
    <div
      className="group relative bg-background/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:bg-background/70 hover:border-border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Status Badge */}
      <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bgColor} ${config.color} ${config.borderColor} border`}>
        <StatusIcon size={12} />
        <span>{config.label}</span>
      </div>

      {/* App Icon/Image Placeholder */}
      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <span className="text-2xl">{app.title.split(' ')[0]}</span>
      </div>

      {/* App Title */}
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors pr-20">
        {app.title}
      </h3>

      {/* App Description */}
      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
        {app.description}
      </p>

      {/* Technology Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {app.tags.map((tag, tagIndex) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            style={{ animationDelay: `${tagIndex * 50}ms` }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto pt-3 border-t border-border/50">
        {app.appUrl && (
          <Button
            asChild
            variant="default"
            size="sm"
            className="flex-1 bg-primary/90 hover:bg-primary text-primary-foreground"
          >
            <a
              href={app.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <ExternalLink size={14} className="mr-2" />
              Launch
            </a>
          </Button>
        )}
        {app.githubUrl && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className={app.appUrl ? "flex-1" : "w-full"}
          >
            <a
              href={app.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <Github size={14} className="mr-2" />
              Code
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

const AppSection = ({
  title,
  description,
  apps,
  status,
  defaultOpen = true
}: {
  title: string;
  description: string;
  apps: App[];
  status: AppStatus;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  if (apps.length === 0) return null;

  return (
    <div className="mb-16">
      {/* Section Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-6 group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <StatusIcon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {title}
              <span className={`text-sm font-normal px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                {apps.length}
              </span>
            </h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </button>

      {/* Apps Grid */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app, index) => (
            <AppCard key={app.id} app={app} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

const Apps = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | AppStatus>('all');

  // Combine all apps for search
  const allApps = [...finishedApps, ...testingApps, ...upgradingApps];

  // Extract unique tags
  const allTags = ['all', ...new Set(allApps.flatMap(app => app.tags))];

  // Filter function
  const filterApps = (apps: App[]) => {
    return apps.filter(app => {
      const matchesSearch = searchTerm === '' ||
        app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesSearch;
    });
  };

  const filteredFinished = filterApps(finishedApps);
  const filteredTesting = filterApps(testingApps);
  const filteredUpgrading = filterApps(upgradingApps);

  const totalFiltered = filteredFinished.length + filteredTesting.length + filteredUpgrading.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 relative overflow-hidden">
      {/* Gradient Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="container mx-auto px-4 pt-20 pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Apps Collection
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              A collection of applications, crafted with dedication. Explore tools for productivity, creativity, AI, and digital workflows.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-muted-foreground">{finishedApps.length} Finished</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FlaskConical className="w-4 h-4 text-yellow-500" />
                <span className="text-muted-foreground">{testingApps.length} Testing</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Wrench className="w-4 h-4 text-blue-500" />
                <span className="text-muted-foreground">{upgradingApps.length} Upgrading</span>
              </div>
            </div>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search apps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 backdrop-blur-sm border-border/50"
                />
              </div>
            </div>

            {searchTerm && (
              <p className="text-sm text-muted-foreground mb-4">
                Found {totalFiltered} app{totalFiltered !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            )}
          </div>
        </div>

        {/* Apps Sections */}
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* Finished Apps */}
            <AppSection
              title="Finished Apps"
              description={statusConfig.finished.description}
              apps={filteredFinished}
              status="finished"
              defaultOpen={true}
            />

            {/* Testing Apps */}
            <AppSection
              title="Apps in Testing"
              description={statusConfig.testing.description}
              apps={filteredTesting}
              status="testing"
              defaultOpen={true}
            />

            {/* Upgrading Apps */}
            <AppSection
              title="Apps Being Upgraded"
              description={statusConfig.upgrading.description}
              apps={filteredUpgrading}
              status="upgrading"
              defaultOpen={true}
            />

            {/* No Results State */}
            {totalFiltered === 0 && searchTerm && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No apps found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apps;
