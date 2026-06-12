# Client Website SEO & LLM Optimization Checklist

> **Use this template for every new client website.**
> Copy to project directory as `SEO_CHECKLIST.md` and track progress.

---

## Pre-Launch Checklist

### Technical SEO (Required)

#### Meta Tags
- [ ] `<title>` on all pages (50-65 chars, includes location + phone)
- [ ] `<meta name="description">` on all pages (150-160 chars)
- [ ] `<meta name="viewport">` for mobile responsiveness
- [ ] `<meta charset="UTF-8">`
- [ ] `<link rel="canonical">` on all pages (absolute URLs)
- [ ] `<meta name="robots" content="index, follow">` (or appropriate directive)

#### Open Graph Tags
- [ ] `og:title`
- [ ] `og:description`
- [ ] `og:type` (website, article, etc.)
- [ ] `og:url`
- [ ] `og:image` (1200x630px recommended)

#### Crawlability
- [ ] `robots.txt` created with sitemap reference
- [ ] `sitemap.xml` generated with all pages
- [ ] All pages accessible within 3 clicks
- [ ] No orphan pages (every page linked from somewhere)
- [ ] 404 page configured

#### Performance
- [ ] Images optimized (WebP format preferred)
- [ ] Lazy loading for below-fold images
- [ ] CSS/JS minified
- [ ] Font preconnect for external fonts
- [ ] Core Web Vitals passing (LCP < 2.5s, FID < 100ms, CLS < 0.1)

---

### Schema Markup (Required)

#### Homepage Schema
```json
{
  "@context": "https://schema.org",
  "@type": "[BusinessType]",
  "name": "[Business Name]",
  "url": "https://www.[domain].com/",
  "telephone": "[Phone]",
  "email": "[Email]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Street]",
    "addressLocality": "[City]",
    "addressRegion": "[State]",
    "postalCode": "[ZIP]",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": [LAT],
    "longitude": [LNG]
  },
  "priceRange": "$$",
  "openingHours": "Mo-Sa 08:00-18:00",
  "areaServed": [
    {"@type": "City", "name": "[City1]"},
    {"@type": "City", "name": "[City2]"}
  ],
  "sameAs": [
    "https://www.facebook.com/[page]",
    "https://www.instagram.com/[handle]"
  ]
}
```

#### Required Schema Types
- [ ] **LocalBusiness/Industry-Specific** (homepage) - LandscapingBusiness, GeneralContractor, etc.
- [ ] **BreadcrumbList** (all subpages)
- [ ] **FAQPage** (FAQ page with 7+ Q&A pairs)
- [ ] **AggregateRating** (homepage, with review count)
- [ ] **Review** (individual reviews with author, rating, date)

#### Recommended Schema Types
- [ ] **Service** (each service page)
- [ ] **Article** (blog posts with datePublished, author)
- [ ] **ContactPoint** (contact page)
- [ ] **ImageObject** (gallery images)
- [ ] **VideoObject** (if video content exists)

---

### Local SEO (Required)

#### Service Area Pages
- [ ] Dedicated page for each target city/town
- [ ] City name in title, description, H1
- [ ] Local schema with `areaServed` targeting city
- [ ] Nearby areas mentioned for context
- [ ] Links to services from each area page
- [ ] Minimum 10 service area pages recommended

#### Google Business Profile Alignment
- [ ] NAP (Name, Address, Phone) matches GBP exactly
- [ ] Business hours match GBP
- [ ] Categories match services offered
- [ ] Service area matches GBP coverage
- [ ] Photos match website gallery

#### Local Keywords
- [ ] "[Service] in [City], [State]" pattern used
- [ ] Phone number includes area code
- [ ] Address visible on every page (footer)
- [ ] "Serving [Area]" mentioned in descriptions

---

### Content Requirements

#### Service Pages (Minimum 5)
- [ ] Unique title with service + location
- [ ] Unique meta description
- [ ] H1 with service name
- [ ] 300+ words of content
- [ ] "What's Included" or features section
- [ ] Clear CTA (Get Estimate button)
- [ ] Link to request form
- [ ] BreadcrumbList schema

#### FAQ Page (Minimum 7 Questions)
Must answer:
- [ ] What areas do you serve?
- [ ] How do I get a free estimate?
- [ ] What services do you offer?
- [ ] How long do projects take?
- [ ] Are you licensed/insured?
- [ ] What's the process from start to finish?
- [ ] [Industry-specific question]

#### Reviews Section
- [ ] Minimum 3 testimonials displayed
- [ ] Each includes: Name, Location, Rating, Text
- [ ] AggregateRating schema (average + count)
- [ ] Individual Review schema for each

---

### LLM Optimization

#### Content for AI Citation
- [ ] **Definitive answers** - Clear, factual responses to common questions
- [ ] **Comparison content** - "X vs Y: Which Should You Choose?"
- [ ] **How-to guides** - Step-by-step processes
- [ ] **Local expertise** - "[Service] in [City]: What You Need to Know"
- [ ] **Cost/pricing guides** - "How Much Does [Service] Cost in [Area]?"

#### Technical for AI Crawlers
- [ ] FAQPage schema (most important for Q&A)
- [ ] Clear heading hierarchy (H1 > H2 > H3)
- [ ] Short paragraphs (2-3 sentences)
- [ ] Bullet points for lists
- [ ] Tables for comparisons
- [ ] Article schema on blog posts with dates

#### Authority Signals
- [ ] Years in business mentioned
- [ ] Certifications/licenses listed
- [ ] Insurance coverage stated
- [ ] Review count and rating displayed
- [ ] Service area coverage defined

---

### Conversion Optimization

#### Lead Forms
- [ ] Primary form at `/request-service.html` or similar
- [ ] Form fields: Name, Phone, Email (optional), Service, Message
- [ ] Clear value proposition ("Free Estimate", "No Obligation")
- [ ] Response time promise ("Within 1 business hour")
- [ ] Thank you page redirect
- [ ] Zapier/webhook integration for notifications
- [ ] Honeypot spam protection

#### CTAs
- [ ] Header: "Get Estimate" button + Phone number
- [ ] Hero section: Primary CTA above fold
- [ ] Each service page: CTA button
- [ ] Footer: Contact info + form link
- [ ] Mobile: Sticky phone button or CTA

#### Trust Signals
- [ ] Phone number visible on every page
- [ ] Address in footer
- [ ] "Licensed & Insured" badge
- [ ] Review stars/rating displayed
- [ ] Before/after gallery (if available)

---

### Files to Generate

#### Required Files
```
/robots.txt
/sitemap.xml
/index.html
/request-service.html
/thank-you.html
/about/index.html
/faq/index.html
/reviews/index.html (or /testimonials/)
/privacy-policy.html
/terms.html
/services/index.html
/services/[service-slug]/index.html (x5-10)
/service-areas/index.html
/service-areas/[city-slug]/index.html (x10-20)
```

#### robots.txt Template
```
User-agent: *
Allow: /

Sitemap: https://www.[domain].com/sitemap.xml
```

#### sitemap.xml Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.[domain].com/</loc>
    <lastmod>2026-06-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Service pages: priority 0.9 -->
  <!-- Service area pages: priority 0.8 -->
  <!-- Utility pages: priority 0.6 -->
</urlset>
```

---

### Post-Launch Checklist

#### Verification
- [ ] Google Search Console verified
- [ ] Bing Webmaster Tools verified
- [ ] sitemap.xml submitted to GSC
- [ ] All pages indexed (check with `site:domain.com`)

#### Analytics
- [ ] Google Analytics 4 installed
- [ ] Goals/conversions configured (form submissions)
- [ ] Phone click tracking enabled

#### Monitoring
- [ ] Weekly ranking check for target keywords
- [ ] Monthly GSC performance review
- [ ] Quarterly content refresh (update dates, add FAQs)

---

### Quality Assurance

Before launching, verify:
- [ ] All links work (no 404s)
- [ ] Forms submit correctly
- [ ] Phone links are clickable on mobile
- [ ] Schema validates (use Google Rich Results Test)
- [ ] Mobile experience is smooth
- [ ] Page speed score > 80 (PageSpeed Insights)
- [ ] No console errors
- [ ] Images have alt text
- [ ] Heading hierarchy is correct

---

## Competitive Analysis Template

When auditing competitors, check:

### Technical
- [ ] Do they have sitemap.xml?
- [ ] What schema types are they using?
- [ ] How fast is their site?
- [ ] How many pages indexed?

### Content
- [ ] How many service pages?
- [ ] How many service area pages?
- [ ] Do they have a blog?
- [ ] How many FAQs?
- [ ] Do they have case studies/portfolio?

### Local
- [ ] How many Google reviews?
- [ ] What's their GBP rating?
- [ ] Are they ranking in map pack?
- [ ] What cities are they targeting?

### Opportunities
- [ ] What keywords are they missing?
- [ ] What content can we create that they don't have?
- [ ] What schema can we implement that they haven't?
- [ ] What service areas can we target that they don't?

---

## Schema Validation Tools

- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Schema.org Validator**: https://validator.schema.org/
- **PageSpeed Insights**: https://pagespeed.web.dev/

---

## Reference: Business Schema Types

| Industry | Schema Type |
|----------|-------------|
| Landscaping | LandscapingBusiness |
| Construction/Remodeling | GeneralContractor |
| Plumbing | Plumber |
| Electrical | Electrician |
| HVAC | HVACBusiness |
| Roofing | RoofingContractor |
| Cleaning | HomeAndConstructionBusiness |
| Moving | MovingCompany |
| Legal | Attorney or LegalService |
| Medical | Physician or MedicalBusiness |
| Dental | Dentist |
| Real Estate | RealEstateAgent |
| Restaurant | Restaurant |
| Retail | Store |

---

*Last Updated: June 2026*
*Template Version: 1.0*
