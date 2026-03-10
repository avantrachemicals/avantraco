# Avantra Chemicals Website - Product Requirements Document

## Original Problem Statement
Build a complete, production-ready multipage website for Avantra Chemicals Pvt Ltd, a leading manufacturer of biostimulants, water-soluble fertilizers, and other agricultural products based in Karnataka, India.

## User Personas
1. **Farmers**: Looking for product information, dosage, and composition details in their local language
2. **Dealers**: Interested in becoming distributors through the dealer application form
3. **Admin**: Company staff managing products, viewing contact submissions and dealer applications

## Core Requirements
- Multilingual support: English (default), Telugu, Kannada, Hindi
- Modern, minimalist, responsive design (green/blue/orange color scheme)
- Mobile-first design with Tailwind CSS
- Fast-loading, SEO-optimized

## Tech Stack
- **Frontend**: React 18 + Tailwind CSS + Shadcn UI
- **Backend**: FastAPI + MongoDB
- **Routing**: React Router
- **State Management**: React Context (LanguageContext)

## Pages & Features

### 1. Homepage (/)
- Hero section with agricultural background
- Stats section (dealers, farmers, acres, licenses)
- About teaser with Phytocode technology highlight
- Featured products carousel
- Customer testimonials
- CTA section

### 2. About Page (/about)
- Company introduction and history
- Mission & Vision statements
- Core values
- Phytocode technology explanation
- Company timeline (2024-2025)
- Team and advisory board info
- Corporate and factory addresses

### 3. Products Page (/products)
- Filterable product grid (31 products)
- Categories: Biostimulants, Biofertilizers, Liquid Fertilizers, Micronutrients, Water Soluble
- Search functionality
- Product cards with images, badges, taglines

### 4. Product Detail Page (/products/:slug)
- Product image
- Multilingual content: name, tagline, overview
- Composition table
- How It Works section
- Growth Stages
- Dosage recommendations
- Advantages list

### 5. Dealers Page (/dealers)
- Network stats
- Static dealer map placeholder (Karnataka & AP)
- Dealer application form

### 6. Contact Page (/contact)
- Contact form (saves to database)
- Corporate office address
- Factory address
- Phone/Email info

### 7. Admin Panel (/admin)
- Password-protected login (avantra2024)
- Product management (CRUD operations)
- Contact submissions viewer
- Dealer applications viewer
- Seed database button

## API Endpoints
- GET /api/products - List all products
- GET /api/products/:slug - Get single product
- POST /api/products - Create product (admin)
- PUT /api/products/:id - Update product (admin)
- DELETE /api/products/:id - Delete product (admin)
- GET /api/stats - Get site statistics
- POST /api/contact - Submit contact form
- GET /api/contact - List contacts (admin)
- POST /api/dealers/apply - Submit dealer application
- GET /api/dealers/applications - List applications (admin)
- POST /api/admin/login - Admin authentication
- POST /api/seed - Seed database

## What's Been Implemented

### Completed (December 2025)
- [x] Full application scaffolding (React + FastAPI + MongoDB)
- [x] All 7 pages with responsive design
- [x] Multilingual support (EN, TE, KN, HI)
- [x] Language switcher in navbar
- [x] 31 products with full multilingual content
- [x] Product filtering and search
- [x] Contact form with database storage
- [x] Dealer application form with database storage
- [x] Admin panel with authentication
- [x] Admin CRUD for products
- [x] Admin views for contacts and dealer applications
- [x] Database seeding via API

### Testing Status
- Backend: 22/22 tests passed (100%)
- Frontend: All features tested and working

## Backlog / Future Enhancements

### P1 (Nice to Have)
- [ ] Add more product images (some products show placeholder)
- [ ] SEO meta tags and schema markup
- [ ] Accessibility improvements (ARIA, contrast)
- [ ] Product image upload in admin panel

### P2 (Future)
- [ ] Email notifications for contact/dealer submissions
- [ ] Product comparison feature
- [ ] Farmer success stories section
- [ ] Gallery page with company photos
- [ ] Blog/News section

## Credentials
- Admin Password: `avantra2024`
- JWT Secret: `avantra-jwt-secret-2024`

## File Structure
```
/app
├── backend/
│   ├── server.py          # FastAPI application
│   ├── seed_data.py       # 31 products with multilingual content
│   └── tests/test_api.py  # API tests
├── frontend/
│   ├── src/
│   │   ├── pages/         # All page components
│   │   ├── components/    # Navbar, Footer
│   │   ├── context/       # LanguageContext
│   │   └── data/          # translations.js
│   └── public/assets/     # Logo, product images
└── test_reports/          # Test results
```
