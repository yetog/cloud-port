# LLM Template: Extract Project Data

Use this template with an LLM to extract raw text/notes and convert them into the portfolio's project data format.

---

## Prompt Template

```
You are a data extraction assistant. Parse the following raw text about a project and extract it into the exact TypeScript format shown below.

OUTPUT FORMAT (TypeScript object):
{
  id: string,           // lowercase-kebab-case from title
  title: string,        // Project name
  description: string,  // 1-2 sentence summary of the project
  image: string,        // Use: ASSETS.projects.<camelCaseName> or placeholder URL
  tags: string[],       // 3-5 relevant tags from: Cloud Services, Web Hosting, Infrastructure, WordPress, Email Marketing, SEO, UX Design, Branding, API Integration, Migration, Domain Management, E-commerce
  category: string,     // One of: cloud, webhosting, artcurating, audioengineering, design, ecommerce, domain, marketing
  demoUrl?: string,     // Website URL (without https://)
  codeUrl?: string,     // GitHub repo URL if applicable
}

CATEGORY GUIDE:
- cloud: Cloud infrastructure, AWS, server setup, DevOps
- webhosting: Hosting, domain management, email setup, migrations
- artcurating: Art galleries, exhibitions, curation
- audioengineering: Music production, audio, sound design
- design: Website design, branding, UX/UI, logos
- ecommerce: Online stores, product catalogs, checkout
- domain: Domain registration, DNS, domain transfers
- marketing: Digital marketing, SEO, email campaigns

RAW TEXT TO PARSE:
---
[PASTE YOUR RAW TEXT HERE]
---

Return ONLY the TypeScript object, no explanation.
```

---

## Example Input

```
Working with client John's Boxing Gym in Hudson Valley.
Did website redesign and branding.
Set up new logo and color scheme.
Connected Stripe for membership payments.
Website: hudsonboxinggym.com
Using WordPress with custom theme.
```

## Example Output

```typescript
{
  id: 'hudson-boxing',
  title: 'Website Design for Hudson Boxing Gym',
  description: 'Website design and hosting for Hudson Boxing Gym with branding and API integration.',
  image: ASSETS.projects.hudsonBoxing,
  tags: ['SEO', 'UX Design', 'Branding', 'API Integration'],
  category: 'design',
  demoUrl: 'hudsonboxinggym.com',
}
```

---

## Batch Processing Template

For multiple projects at once:

```
Parse each project below and return an array of TypeScript objects.

PROJECTS:
---
1. [Project 1 text]

2. [Project 2 text]

3. [Project 3 text]
---

Return as: export const newProjects: Project[] = [ ... ]
```

---

## Asset Naming Convention

When generating the `image` field:
1. Use `ASSETS.projects.<camelCaseName>`
2. camelCase the domain/company name
3. Examples:
   - hudsonboxinggym.com → `ASSETS.projects.hudsonBoxing`
   - Multiple Natures → `ASSETS.projects.multipleNatures`
   - TA2 Music → `ASSETS.projects.ta2Music`

If no image exists yet, use placeholder:
```
'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
```

---

## Adding to Codebase

After extraction:

1. Add image to `src/config/assets.ts`:
```typescript
newProject: getAssetUrl('projects/newproject.png'),
```

2. Add project to `src/data/projects.ts`:
```typescript
{
  id: 'new-project',
  title: 'New Project Title',
  // ... rest of fields
}
```

3. Upload image to IONOS S3 bucket: `portfoliowebsite/projects/`

---

## Music Data Template

For music projects, use this format:

```
Parse into MusicProject format:

{
  id: string,
  title: string,
  type: 'album' | 'ep' | 'single' | 'mixtape' | 'compilation',
  year: number,
  coverUrl?: string,
  description?: string,
  tracks: [
    { id: string, title: string, artist: string, duration: string, genre?: string }
  ],
  links?: { spotify?: string, appleMusic?: string, soundcloud?: string, youtube?: string }
}
```
