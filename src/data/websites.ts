
import { ASSETS } from '../config/assets';

export interface Website {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  status: 'live' | 'development';
  siteUrl: string;
  apiName: string;  // Maps to APP_DIRS key for updates
  clientName?: string;
  location?: string;
  launchDate?: string;
}

// =============================================================================
// CLIENT WEBSITES - Live production sites for clients
// =============================================================================
export const websites: Website[] = [
  {
    id: 'greenridge',
    title: 'GreenRidge Landscape & Design',
    description: 'Professional landscaping website for San Jose-based company. Features service pages, service area coverage, contact forms with Zapier integration, and California luxury styling.',
    image: ASSETS.apps.zenReset,
    tags: ['Landscaping', 'California', 'SEO', 'Lead Gen'],
    status: 'live',
    siteUrl: 'https://greenridgelandscapedesign.com',
    apiName: 'greenridge',
    clientName: 'Ariel',
    location: 'San Jose, CA',
    launchDate: '2026-05-24',
  },
  {
    id: 'green-empire-landscaping',
    title: 'Green Empire Landscaping',
    description: 'Full-service landscaping company website for Long Island, NY. Complete with service pages, reviews, FAQ, and lead generation forms.',
    image: ASSETS.apps.zenReset,
    tags: ['Landscaping', 'New York', 'SEO', 'Lead Gen'],
    status: 'live',
    siteUrl: 'https://greenempireland.com',
    apiName: 'green-empire-land',
    clientName: 'Green Empire',
    location: 'Long Island, NY',
    launchDate: '2026-04-01',
  },
  {
    id: 'green-empire-builders',
    title: 'Green Empire Builders',
    description: 'Construction and building services website. Professional design with portfolio showcase and service offerings.',
    image: ASSETS.apps.zenReset,
    tags: ['Construction', 'Builders', 'Portfolio'],
    status: 'live',
    siteUrl: 'https://greenempirebuild.com',
    apiName: 'green-empire-build',
    clientName: 'Green Empire',
    location: 'Long Island, NY',
    launchDate: '2026-03-15',
  },
  {
    id: 'goat-landscaping',
    title: 'GOAT Landscaping',
    description: 'Landscaping services website for Long Island market. Clean design with service areas and contact integration.',
    image: ASSETS.apps.zenReset,
    tags: ['Landscaping', 'New York', 'Lead Gen'],
    status: 'live',
    siteUrl: 'https://goatlandscapeli.com',
    apiName: 'goat-landscaping',
    clientName: 'GOAT Landscaping',
    location: 'Long Island, NY',
    launchDate: '2026-02-20',
  },
];

export const liveWebsites = websites.filter(w => w.status === 'live');
export const developmentWebsites = websites.filter(w => w.status === 'development');
