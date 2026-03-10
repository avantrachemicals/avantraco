# Avantra Chemicals Pvt Ltd - Product Requirements Document

## Overview
A complete, production-ready multipage website for Avantra Chemicals Pvt Ltd, a leading manufacturer of biostimulants and agricultural products. The website features a premium dark design inspired by inera.ag.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Styling**: Custom CSS matching inera.ag design

## Core Requirements
1. **Design**: Premium dark aesthetic matching inera.ag (90% identical feel)
2. **Multilingual**: English, Telugu, Kannada, Hindi support
3. **Admin Panel**: Comprehensive content management
4. **Product Pages**: With downloadable manuals and leaflets

---

## What's Been Implemented

### Design System (December 2025)
- [x] Complete CSS redesign matching inera.ag style
- [x] Montserrat font family
- [x] Black/white/green color scheme
- [x] Transparent navbar on homepage (turns solid on scroll)
- [x] Full-screen hero slider with fade transitions
- [x] Black product category cards (2x2 grid)
- [x] Stats section with green numbers and + suffix
- [x] Technology section (black background, numbered cards)

### Homepage
- [x] Full-screen hero slider with auto-rotation (5 slides)
- [x] Navigation arrows and pagination dots
- [x] Product category cards linking to filtered products
- [x] Stats: 12K+ Farmers, 50+ Dealers, 15+ Products, 10+ States
- [x] Phytocode Technology section (3 numbered features)
- [x] Featured Products grid
- [x] CTA section

### Products Page
- [x] Dark hero header
- [x] Sticky filter bar with category tabs
- [x] 4-column product grid
- [x] Category filtering (All, Biostimulants, Biofertilizers, Liquid Fertilizers, Micronutrients, Water Soluble)
- [x] Product cards with image, brand, name, category, description

### Product Detail Page
- [x] Dark green gradient hero section
- [x] Brand name with trademark symbol
- [x] Product name, category badge, description
- [x] Product image with drop shadow
- [x] **Download Product Manual** button (if URL set)
- [x] **Download Leaflet** button (if URL set)
- [x] Benefits/Advantages list
- [x] How It Works numbered steps
- [x] Composition table (black header)
- [x] Growth Stages sidebar card
- [x] Dosage/Application sidebar card
- [x] Contact CTA sidebar card
- [x] Related Products section

### Admin Panel
- [x] Secure login (password: avantra2024)
- [x] Products management with **5 tabs**:
  - Basic (name, slug, category, brand, image, tagline, overview, dosage, crops)
  - Composition (component|specification format)
  - Details (how it works, growth stages)
  - Advantages (key benefits list)
  - **Downloads** (manual_url, leaflet_url)
- [x] Gallery management
- [x] Blog/Media management
- [x] Video Testimonials management
- [x] Jobs management
- [x] Applications management
- [x] Contact submissions
- [x] Dealer applications
- [x] Site Settings (logo, social links)

### Other Pages
- [x] About Page (dark hero, mission, stats, technology, values, R&D)
- [x] Contact Page (dark hero, contact info, form)
- [x] Dealers Page (dark hero, dealer search, application form)
- [x] Gallery Page (dark hero, image grid, lightbox)
- [x] Media Center (dark hero, blog posts)
- [x] Careers Page (dark hero, why join us, job listings)
- [x] Privacy Policy Page
- [x] Terms & Conditions Page

### Navigation & Footer
- [x] Transparent navbar (turns solid on scroll)
- [x] Links: About, Products, Gallery, Media, Dealers, Contact
- [x] Language switcher (EN, TE, KN, HI)
- [x] Mobile menu
- [x] Black footer with logo, description, quick links, contact info, social icons, legal links

---

## API Endpoints

### Public
- `GET /api/` - Health check
- `GET /api/stats` - Site statistics
- `GET /api/settings` - Site settings
- `GET /api/products` - List products (with category filter)
- `GET /api/products/{slug}` - Product detail
- `POST /api/contact` - Submit contact form
- `POST /api/dealers/apply` - Submit dealer application
- `GET /api/gallery` - Gallery images
- `GET /api/blog` - Blog posts
- `GET /api/jobs` - Job listings
- `GET /api/testimonials/videos` - Video testimonials

### Admin (requires token)
- `POST /api/admin/login` - Authentication
- `PUT /api/settings` - Update settings
- All CRUD for products, gallery, blog, jobs, videos

---

## Database Schema

### products
```
{
  id: string,
  name: string,
  slug: string,
  category: string,
  brand: string,
  image_url: string,
  tagline: { en, te, kn, hi },
  overview: { en, te, kn, hi },
  composition: [{ component, specification }],
  how_it_works: { en: [], te: [], kn: [], hi: [] },
  growth_stages: { en: [], te: [], kn: [], hi: [] },
  dosage: { en, te, kn, hi },
  advantages: { en: [], te: [], kn: [], hi: [] },
  crops: string,
  manual_url: string,  // NEW
  leaflet_url: string, // NEW
  featured: boolean
}
```

---

## Remaining/Future Tasks

### P1 - High Priority
- [ ] SEO Optimization (meta tags, structured data, alt tags)
- [ ] Populate manual_url and leaflet_url for existing products via admin

### P2 - Medium Priority
- [ ] Add real product images
- [ ] Add real testimonial videos
- [ ] Add real blog content
- [ ] Add real job postings

### P3 - Low Priority
- [ ] Accessibility review (WCAG compliance)
- [ ] Performance optimization
- [ ] Image compression
- [ ] Refactor AdminPage.js into smaller components

---

## Test Status
- Backend: 100% (25/25 tests passed)
- Frontend: 100% (all features working)
- Last tested: December 2025

## Credentials
- Admin Password: `avantra2024`
