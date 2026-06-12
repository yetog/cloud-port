# SEO & LLM Optimization Audit Report

**Date:** June 12, 2026
**Sites Audited:** 4 Client Websites
**Auditor:** Claude Code

---

## Executive Summary

| Site | Overall Score | Critical Issues | Quick Wins |
|------|---------------|-----------------|------------|
| **GreenRidge** | 8.5/10 | Missing sitemap.xml, robots.txt | Add Review schema |
| **Green Empire Land** | 8.0/10 | Missing sitemap.xml, robots.txt | Add AggregateRating |
| **Green Empire Builders** | 8.5/10 | Blog not in sitemap | Add Article schema |
| **GOAT Landscaping** | 7.5/10 | Missing sitemap.xml, robots.txt | Add Review schema |

---

## Site-by-Site Analysis

### 1. GreenRidge Landscape & Design
**Domain:** greenridgelandscapedesign.com
**Location:** San Jose, CA

#### What's Working Well
- Excellent meta tags with location + phone in titles
- LandscapingBusiness schema on homepage
- FAQPage schema with 7 Q&A pairs
- 15 service area pages with local schema
- 7 service pages with BreadcrumbList
- Zapier-integrated lead forms
- Strong internal linking via dropdowns

#### Critical Gaps
| Issue | Impact | Effort |
|-------|--------|--------|
| No sitemap.xml | High | Low |
| No robots.txt | Medium | Low |
| No Review schema (4 testimonials exist) | High | Low |
| No AggregateRating | High | Low |
| Geo coordinates incorrect (shows NYC not San Jose) | Medium | Low |

#### Recommendations
1. Generate sitemap.xml with all 40+ pages
2. Create robots.txt with sitemap reference
3. Add Review schema for each testimonial
4. Add AggregateRating (5.0 based on 4 reviews)
5. Fix geo coordinates in schema

---

### 2. Green Empire Landscaping
**Domain:** greenempireland.com
**Location:** Hempstead, NY (Long Island)

#### What's Working Well
- Complete meta tags on all pages
- LandscapingBusiness schema with 20 service areas
- FAQPage schema with 7 Q&A pairs
- 20 service area pages (Nassau + Suffolk)
- 7 service pages
- Strong breadcrumb implementation
- Social links in schema (Facebook, Instagram)

#### Critical Gaps
| Issue | Impact | Effort |
|-------|--------|--------|
| No sitemap.xml | High | Low |
| No robots.txt | Medium | Low |
| No AggregateRating schema | High | Low |
| No Review schema (3 testimonials) | High | Low |
| No Article schema on blog posts | Medium | Medium |
| No Google Analytics | Medium | Low |

#### Recommendations
1. Generate sitemap.xml (30+ pages)
2. Create robots.txt
3. Add AggregateRating + Review schema
4. Add Article schema to 3 blog posts
5. Install GA4 tracking

---

### 3. Green Empire Builders
**Domain:** greenempirebuild.com
**Location:** Massapequa Park, NY (Long Island)

#### What's Working Well
- **Best technical SEO** of all 4 sites
- GeneralContractor schema (correct for construction)
- Has both sitemap.xml AND robots.txt
- 35 service area pages (most coverage)
- 14 service pages (most services)
- FAQPage schema with 9 Q&A pairs
- Dual schema on area pages (breadcrumb + local)

#### Critical Gaps
| Issue | Impact | Effort |
|-------|--------|--------|
| Blog posts (3) not in sitemap | Medium | Low |
| No Article schema on blog | Medium | Medium |
| No Review/AggregateRating | High | Low |
| No Service schema on service pages | Medium | Medium |

#### Recommendations
1. Add blog URLs to sitemap.xml
2. Add Article schema to blog posts
3. Add Review + AggregateRating schema
4. Consider Service schema for detailed services

---

### 4. GOAT Landscaping
**Domain:** goatlandscapeli.com
**Location:** Massapequa Park, NY (Long Island)

#### What's Working Well
- LandscapingBusiness schema on homepage
- 15 service area pages with local schema
- 7 service pages with BreadcrumbList
- FAQPage schema with 5 Q&A pairs
- Zapier lead form integration

#### Critical Gaps
| Issue | Impact | Effort |
|-------|--------|--------|
| No sitemap.xml | High | Low |
| No robots.txt | Medium | Low |
| No Review schema (4 testimonials) | High | Low |
| Only 5 FAQs (lowest of all sites) | Medium | Medium |
| Social links are placeholders (#) | Low | Low |
| No blog/content hub | Medium | High |

#### Recommendations
1. Generate sitemap.xml
2. Create robots.txt
3. Add Review + AggregateRating schema
4. Expand FAQ to 10-15 questions
5. Add real social media links

---

## Cross-Site Comparison

### Technical SEO Matrix

| Feature | GreenRidge | GE Land | GE Builders | GOAT |
|---------|------------|---------|-------------|------|
| Meta Tags | Excellent | Excellent | Excellent | Excellent |
| Canonical URLs | Yes | Yes | Yes | Yes |
| Open Graph | Yes | Yes | Yes | Yes |
| sitemap.xml | No | No | Yes | No |
| robots.txt | No | No | Yes | No |
| Mobile Viewport | Yes | Yes | Yes | Yes |

### Schema Markup Matrix

| Schema Type | GreenRidge | GE Land | GE Builders | GOAT |
|-------------|------------|---------|-------------|------|
| LocalBusiness | LandscapingBusiness | LandscapingBusiness | GeneralContractor | LandscapingBusiness |
| BreadcrumbList | All pages | All pages | All pages | All pages |
| FAQPage | 7 Q&A | 7 Q&A | 9 Q&A | 5 Q&A |
| Review | Missing | Missing | Missing | Missing |
| AggregateRating | Missing | Missing | Missing | Missing |
| Article (blog) | N/A | Missing | Missing | N/A |

### Local SEO Matrix

| Metric | GreenRidge | GE Land | GE Builders | GOAT |
|--------|------------|---------|-------------|------|
| Service Areas | 15 | 20 | 35 | 15 |
| Services | 7 | 7 | 14 | 7 |
| FAQ Count | 7 | 7 | 9 | 5 |
| Blog Posts | 3 | 3 | 3 | 0 |
| Reviews Displayed | 4 | 3 | 3 | 4 |

---

## Prioritized Recommendations

### HIGH IMPACT / LOW EFFORT (Do First)

| Task | Sites Affected | Time Est. |
|------|----------------|-----------|
| Generate sitemap.xml | GreenRidge, GE Land, GOAT | 15 min each |
| Create robots.txt | GreenRidge, GE Land, GOAT | 5 min each |
| Add AggregateRating schema | All 4 | 10 min each |
| Add Review schema | All 4 | 20 min each |
| Fix GreenRidge geo coords | GreenRidge | 5 min |

### HIGH IMPACT / MEDIUM EFFORT

| Task | Sites Affected | Time Est. |
|------|----------------|-----------|
| Add Article schema to blogs | GE Land, GE Builders | 30 min each |
| Expand FAQ content to 15+ | All 4 | 1-2 hours each |
| Add Service schema | GE Builders | 1 hour |
| Update sitemap with blogs | GE Builders | 15 min |

### MEDIUM IMPACT / LOW EFFORT

| Task | Sites Affected | Time Est. |
|------|----------------|-----------|
| Add GA4 tracking | GE Land | 10 min |
| Fix social link placeholders | GOAT | 5 min |
| Add Google Site Verification | All without | 5 min each |

### MEDIUM IMPACT / HIGH EFFORT (Long-term)

| Task | Sites Affected | Time Est. |
|------|----------------|-----------|
| Create blog/content hub | GOAT | 4-8 hours |
| Service + Location matrix pages | All 4 | 2-4 hours each |
| Before/After gallery with schema | All 4 | 2-3 hours each |
| Video content with VideoObject schema | All 4 | Varies |

---

## LLM Optimization Checklist

For AI models (ChatGPT, Gemini, Claude, Perplexity) to cite your content:

### Content Structure
- [ ] Clear, definitive answers to common questions (FAQ)
- [ ] Authoritative service descriptions with specifics
- [ ] Location-specific content mentioning city names
- [ ] "Best practices" and "how-to" content
- [ ] Comparison content (e.g., "Pavers vs Concrete")

### Technical Requirements
- [ ] FAQPage schema for Q&A pairs
- [ ] Article schema on blog posts with datePublished
- [ ] Clear heading hierarchy (H1 > H2 > H3)
- [ ] Semantic HTML with proper tags
- [ ] Fast page load times

### Authority Signals
- [ ] AggregateRating with review count
- [ ] Individual Review schema with authors
- [ ] Credentials/certifications mentioned
- [ ] Years in business stated
- [ ] Service area coverage clearly defined

### Discoverability
- [ ] sitemap.xml listing all pages
- [ ] robots.txt allowing crawler access
- [ ] Consistent NAP (Name, Address, Phone)
- [ ] Google Business Profile alignment

---

## Competitive Analysis Notes

### What Top Competitors Do Better
1. **Video content** - Many top landscapers have YouTube presence
2. **Before/after galleries** - Visual proof of work quality
3. **Detailed pricing guides** - "Cost of patio installation in [City]"
4. **Seasonal content** - Spring prep, winter maintenance guides
5. **Case studies** - Detailed project breakdowns with photos
6. **Google reviews integration** - Embedded Google reviews widget

### Quick Wins vs Competitors
1. Add AggregateRating (most competitors don't have)
2. FAQPage schema (gives rich snippet advantage)
3. More service area pages (outrank in local search)
4. Blog content targeting "[service] in [city]" keywords

---

## Next Steps

### Immediate (This Week)
1. Generate and deploy sitemap.xml for 3 sites
2. Create robots.txt for 3 sites
3. Add Review + AggregateRating schema to all 4

### Short-term (This Month)
1. Expand FAQ content on all sites
2. Add Article schema to blog posts
3. Fix GreenRidge geo coordinates
4. Set up GA4 on Green Empire Land

### Long-term (Next Quarter)
1. Create blog/content hub for GOAT
2. Develop service + location matrix pages
3. Add before/after galleries
4. Consider video content strategy

---

## Appendix: File Locations

| Site | Config | Homepage | Sitemap |
|------|--------|----------|---------|
| GreenRidge | `/var/www/greenridgelandscapedesign/site.config.json` | `index.html` | Missing |
| GE Land | `/var/www/Green-Empire/site.config.json` | `index.html` | Missing |
| GE Builders | `/var/www/zaylegend/apps/green-empire/site.config.json` | `index.html` | `sitemap.xml` |
| GOAT | `/var/www/goatlandscapeli.com/html/site.config.json` | `index.html` | Missing |
