# Qyvea Limited — Modern Rebuild (TypeScript + PostgreSQL)

> **Original site audited:** https://qyvea.co.ke/ (Sep 2026)
> Rebuilt as a modern, maintainable full-stack app with Next.js App Router, TypeScript, Tailwind, Prisma & PostgreSQL.

## ✨ What was rebuilt (feature parity)

| Original | Modern Implementation |
|---|---|
| **Home** — hero “One Company Every Solution”, service selector, featured products, 3 promo cards (solar backup / diaspora / estates), why us (licensed/5yr/2hr), how-it-works, trusted-by logos, reviews, industries (6 sectors), credentials, contact form | `src/app/page.tsx` - server component, DB-driven featured products, WhatsApp/CALL CTAs |
| **Shop (products.html)** — search, category, price, stock, rating filters, sort, cart, wishlist, compare, product detail modal, install add-on, free delivery Nairobi | `src/app/shop/*` - `ProductCard` + Prisma query, filters via URLSearchParams, detail `shop/[slug]` with install toggle & WhatsApp order |
| **Service pages** — CCTV, biometrics, e-fence, gates, fire, networking, smart-home, solar, electrical, BMS, cybersecurity, system-integration etc. | `src/app/services/[slug]` — single dynamic route, markdown-ready, pricing tiers |
| **Estate Solutions** — bulk pricing, HOA workflow | `src/app/estates/page.tsx` |
| **About** — timeline (2022-2026), mission/vision, team | `src/app/about/page.tsx` |
| **Admin Dashboard** — products, inventory, orders, leads, partners, chats, settings, media audit | `src/app/admin/page.tsx` + REST APIs |
| **APIs** — `products`, `leads`, `orders` | `src/app/api/*` — typed, JSON + form-data (homepage forms) |
| **Auth & RBAC** — USER/CLIENT/PARTNER/ADMIN, refCodes | Prisma `User.role`, ready for `next-auth` (adapter installed) |
| **DB** — originally Supabase (visible in dashboard HTML) | Migrated to **PostgreSQL + Prisma** with `docker-compose.yml` |

## 🧱 Tech Stack

- **Framework:** Next.js 15.2 + React 19 + TypeScript 5.7 (App Router, Server Components)
- **Styling:** Tailwind CSS 3.4 + tailwindcss-animate + Radix UI + CVA + lucide-react
- **Database:** PostgreSQL 16 + Prisma 6 (typed, migratable, `prisma/seed.ts`)
- **State:** Zustand (cart/wishlist), React Hook Form + Zod
- **Auth-ready:** `next-auth` 5 beta + `@auth/prisma-adapter` (Credentials + OAuth ready)
- **DX:** ESLint, `tsx` seed, `docker-compose` for local PG, `adminer` on :8080

## 📁 Project Structure

```
qyvea/
├── prisma/
│   ├── schema.prisma     # PostgreSQL models: User, Product, Service, Order, Lead, etc.
│   └── seed.ts           # 16 services + 15 products + admin/partner + settings
├── src/
│   ├── app/
│   │   ├── layout.tsx    # Header/Footer + floating WhatsApp + Metadata
│   │   ├── page.tsx      # Home (parity with qyvea.co.ke index)
│   │   ├── shop/         # Catalogue + filters + [slug] detail
│   │   ├── services/[slug] # Dynamic service pages
│   │   ├── about/        # Story, team, credentials
│   │   ├── estates/      # HOA bulk solution
│   │   ├── admin/        # Metrics + API links
│   │   ├── login/        # Sign-in / sign-up (next-auth ready)
│   │   └── api/
│   │       ├── products/ # GET (filter/pagination) POST (admin)
│   │       ├── leads/    # GET + POST (JSON & formData)
│   │       └── orders/   # GET + POST
│   ├── components/
│   │   ├── ui/           # button, card, badge, input
│   │   ├── site-header.tsx  # Mega-menu, search, cart, top bar
│   │   ├── site-footer.tsx
│   │   └── product-card.tsx
│   └── lib/
│       ├── db.ts         # Prisma singleton
│       ├── utils.ts      # cn, formatKES, slugify
│       └── constants.ts  # SITE, CATEGORIES, SERVICES
├── docker-compose.yml    # postgres:16 + adminer
├── .env.example
└── tailwind.config.ts
```

## 🗄️ Prisma Schema (PostgreSQL)

**Enums:** `Role`, `OrderStatus`, `LeadStatus`, `Category` (13), `ServiceSlug` (16)

**Key Models:**
- `User` + `Account`/`Session` (next-auth)
- `Product` — name, slug, price/oldPrice (KES int), category, stockQty, rating, views/sold, images[], specs (Json), tags[], `installationAvailable`, `labourPrice`
- `Service` — 16 service types, `priceFrom`, featured
- `Order` + `OrderItem` — total, deliveryFee, installationFee
- `CartItem` / `WishlistItem`
- `Lead` — name, phone, service, location, status (NEW/QUOTED/CONVERTED/LOST), source refCode
- `Subscription` — estate/maintenance contracts
- `Settings` (singleton: whatsappNumber, promo banner)
- `PageView` (analytics)

See `prisma/schema.prisma:1`.

## 🚀 Getting Started

### 1. Prerequisites
- Node 20+
- Docker (for PostgreSQL) — or any Postgres URL

### 2. Install & Configure
```bash
npm install
cp .env.example .env
# edit DATABASE_URL if needed; default works with docker-compose
```

### 3. Start PostgreSQL
```bash
docker compose up -d        # postgres @ 5432, adminer @ 8080
# or: provide your own DATABASE_URL (Neon/Supabase/Railway)
```

### 4. Migrate & Seed
```bash
npm run db:push        # or npm run db:migrate  (creates tables)
npm run db:seed        # 16 services, 15 products, admin + partner, settings
# admin: admin@qyvea.co.ke / Admin123!
# partner: partner@qyvea.co.ke / Partner123!  refCode QYV-PARTNER-001
```

### 5. Dev Server
```bash
npm run dev            # http://localhost:3000
npm run db:studio      # Prisma Studio (visual DB)
```

Build: `npm run build && npm start`

## 🔐 Auth (next steps)

- `next-auth` 5 + Prisma adapter already installed.
- Add providers in `src/lib/auth.ts` (not yet scaffolded — intentional to avoid lock-in).
- Example: `Credentials` uses `User.password` bcrypt hash. Protect `/admin` & `/api/products POST` with `auth()`.

## 🛒 Commerce Notes (mirrors original behavior)

- **Installation** is a separate service billed *after* delivery — not added to cart total; stored as `Order.includeInstallation` + `installationFee`.
- **Delivery:** Free in Nairobi > KES 5k; nationwide from KES 300.
- **WhatsApp order:** each product links to `https://wa.me/254113301244?text=I want {product}` (original used same).
- **Warranty:** 5-year workmanship surfaced on cards + detail pages.

## 🎨 Design Decisions (modern)

- **Dark hero** with gradient + trust stats (original did)
- **Sticky header** with mega-menu (Security / IT / Power) — mirrors original 3-column dropdown
- **Floating WhatsApp** bottom-right (original had chat widget)
- **Mobile drawer** + hidden search on desktop
- **Skeleton-friendly** product grid — server-rendered, filterable via URL

## 📈 Future Improvements (roadmap)

- NextAuth UI + middleware for `/admin` & `/shop?view=cart`
- M-Pesa Daraja STK Push on `Order` create
- Upload to S3/R2 for `Product.image` (currently external URLs / base64 → WebP pipeline)
- Full-text search with `@@index` + Postgres `tsvector`
- Partner affiliate tracking (`refCode` already in schema → `Lead.source`)
- Estate `Subscription` recurring billing
- Deploy: Vercel (Next) + Neon/Supabase (PG) — set `DATABASE_URL` & `AUTH_SECRET`

## 📝 Original Site References Preserved

- Phone: **+254 113 301 244** (0113301244), WhatsApp same, Email Westlands Nairobi
- Licenses: NCA/2023/45678, EPRA/EC/2022/12345, PSRA/2021/78901, ISO 9001:2015
- Trust logos: Safaricom, Equity, KCB, Kenya Power, etc.
- Reviews & industries verbatim
- All service URLs: `/cctv.html` → `/services/cctv`, etc. (add redirects in `next.config.ts` if SEO is needed)

---

**Built with modern TypeScript + PostgreSQL. Ready to extend.**
