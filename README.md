# 🤖 AI Assistant — Multi-Tenant AI Platform

> A production-style, multi-tenant AI assistant platform built for the **Debales AI Full Stack Developer Internship Assignment**. This system supports isolated project tenants, a config-driven admin dashboard powered entirely by MongoDB, AI-powered chat with live integration context, and a strict layered API architecture.

---

## 📸 Live Screenshots

### 🧠 AI Chat — Context-Aware Response
> The chat interface showing a real AI response to *"What are my current Shopify sales performance this week?"*. The AI pulls live integration context (Shopify orders, CRM leads) from MongoDB before generating a response. Step indicators confirm the controlled AI flow.

<img width="500" height="500" alt="bot" src="https://github.com/user-attachments/assets/3b052395-2737-4878-870b-52c6a7dc8522" />


---

### 📊 Admin Dashboard — Config-Driven from MongoDB
> The admin dashboard rendering **stats**, **table**, and **chart** widgets — all sourced from a single MongoDB document. Editing the document in Atlas and refreshing the page instantly reflects changes. No code changes required.

<img width="500" height="500" alt="Screenshot 2026-04-12 211549" src="https://github.com/user-attachments/assets/9a7b0f00-1e44-49c6-be46-7be60b2e242c" />


---

### ⚙️ Dev Server — Clean Build Output
> Next.js 16 with Turbopack running cleanly — `/chat`, `/dashboard`, and `/api/admin` all returning `200`. MongoDB connected, `.env.local` loaded.

> Terminal shows: `✓ Ready in ~500ms` with all routes responding correctly.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | TanStack Query v5 |
| Database | MongoDB + Mongoose |
| Validation | Zod |
| AI Provider | RapidAPI — ChatGPT-4 endpoint |
| Runtime | Node.js |

---

## 🗂️ Project Structure

```
ai-assistant/
├── access/
│   └── project.access.ts        # Authorization layer — pure access rules
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── route.ts         # GET /api/admin — dashboard config
│   │   └── chat/
│   │       └── route.ts         # POST /api/chat — message handler
│   ├── chat/
│   │   └── page.tsx             # Chat UI page
│   ├── dashboard/
│   │   └── page.tsx             # Config-driven admin dashboard
│   ├── layout.tsx               # Root layout with TanStack Query provider
│   └── providers.tsx            # QueryClientProvider wrapper
├── hooks/
│   └── useChat.ts               # TanStack Query mutation hook
├── lib/
│   └── mongodb.ts               # MongoDB connection singleton
├── models/
│   ├── Conversation.ts          # Conversation + Message schema
│   ├── DashboardConfig.ts       # Config-driven dashboard schema
│   ├── ProductInstance.ts       # Product instance + integrations schema
│   ├── Project.ts               # Project (tenant) schema
│   └── User.ts                  # User + role schema
├── schemas/
│   └── chat.schema.ts           # Zod input validation schema
├── scripts/
│   └── seed.ts                  # Database seed script
├── services/
│   ├── admin.service.ts         # Dashboard config service
│   └── chat.service.ts          # Chat + AI + integration service
├── .env.local                   # Environment variables (not committed)
└── README.md
```

---

## 🏗️ Architecture — Layered API

The entire backend follows a strict top-down layered architecture as required by the assignment:

```
┌─────────────────────────────────┐
│         UI Components           │  React — app/chat/page.tsx
│      (no direct API calls)      │         app/dashboard/page.tsx
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│       TanStack Query Hooks      │  hooks/useChat.ts
│  (server state, cache, errors)  │  useMutation → invalidates cache
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│      API Route Handlers         │  app/api/chat/route.ts
│    (thin — parse + delegate)    │  app/api/admin/route.ts
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│        Access Layer             │  access/project.access.ts
│   (pure server authorization)   │  requireProjectAccess()
│                                 │  requireAdmin()
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│        Service Layer            │  services/chat.service.ts
│  (all business logic + AI flow) │  services/admin.service.ts
└────────────────┬────────────────┘
                 │
┌────────────────▼────────────────┐
│       MongoDB Models            │  models/*.ts
│   (Mongoose + TypeScript)       │  Aligned with Zod schemas
└─────────────────────────────────┘
```

**Why this matters**: No business logic leaks into route handlers. No DB calls happen in UI components. Every layer has a single, well-defined responsibility. This is verifiable by reading each file in isolation.

---

## 🗄️ Multi-Tenant Data Model

The multi-tenant model is built around `projects` as the tenant boundary. Every piece of data is scoped to a project.

### Collections Overview

| Collection | Purpose | Tenant Scope |
|---|---|---|
| `projects` | Tenant definition — slug-based namespace | Root boundary |
| `productinstances` | Product type linked to project with integration toggles | Per project |
| `users` | Users with roles (admin/member) scoped to projects | Per project |
| `conversations` | Full chat history with messages | Per project + per product |
| `dashboardconfigs` | Config-driven dashboard layout and widgets | Per project |

### Schema Relationships

```
Project (slug: "123")
    │
    ├── ProductInstance (nameSpace: "sales-assistant", integrations: {shopify, crm})
    │
    ├── User (role: "admin" | "member")
    │
    ├── Conversation (projectId, productInstanceId, userId, messages[])
    │
    └── DashboardConfig (sections[] → widgets[] → type/label/value)
```

### Key Design Decisions

- `projectId` is stored as a **string slug** (not ObjectId) across all collections — this enables human-readable namespacing and easier multi-tenant querying
- `Conversation` is double-scoped to both `projectId` and `productInstanceId` — a project can have multiple AI products, each with isolated conversation history
- `User.role` drives server-side authorization — admin vs member is enforced at the access layer, not the UI

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ai-assistant?retryWrites=true&w=majority
RAPIDAPI_KEY=your_rapidapi_key_here
```

| Variable | Description | Required |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Yes |
| `RAPIDAPI_KEY` | RapidAPI key for ChatGPT-4 endpoint | ✅ Yes |

> **Note**: Never commit `.env.local` to version control. It is listed in `.gitignore` by default.

---

## 🚀 Setup & Run

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ai-assistant
npm install
```
<img width="500" height="500" alt="Screenshot 2026-04-13 120214" src="https://github.com/user-attachments/assets/41ec5c9f-9fe8-4650-bd2f-a48e05730bf9" />

### 2. Configure Environment

```bash
# Copy and fill in your values
cp .env.local.example .env.local
```

### 3. Seed the Database

```bash
npm run seed
```

This creates the following documents in MongoDB:

| Collection | Document |
|---|---|
| `users` | Admin user — `admin@demo.com`, role: `admin` |
| `projects` | Demo project — `slug: "123"`, name: `Demo Project` |
| `productinstances` | Sales assistant — `nameSpace: "sales-assistant"`, shopify: `true`, crm: `true` |
| `dashboardconfigs` | Dashboard with stats, table, and chart widgets |

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- **Chat**: `http://localhost:3000/chat`
- **Admin Dashboard**: `http://localhost:3000/dashboard`

---

## 🧩 Config-Driven Admin Dashboard

> This is the core differentiator of the assignment. The admin dashboard is **entirely driven by a MongoDB document**. Editing the database document changes the UI without any code changes.

### How It Works

1. `app/dashboard/page.tsx` fetches from `/api/admin?projectId=123`
2. `app/api/admin/route.ts` calls `getDashboardConfig(projectId)` in the service layer
3. `services/admin.service.ts` does `DashboardConfig.findOne({ projectId })`
4. The returned document's `sections[].widgets[]` array is mapped to React components by `type`
5. Each widget type (`stats`, `table`, `chart`) renders a different component — no hardcoding

### Widget Types

| Type | Renders | Fields |
|---|---|---|
| `stats` | Large number card | `label`, `value` |
| `table` | Striped data table | `label`, `rows[]` |
| `chart` | Bar chart | `label`, `data[]` |

### Live Config Document (MongoDB)

```json
{
  "projectId": "123",
  "sections": [
    {
      "title": "Overview",
      "widgets": [
        { "type": "stats", "label": "Total Users", "value": "9999" },
        { "type": "stats", "label": "Revenue", "value": "$5000" },
        {
          "type": "table",
          "label": "Recent Orders",
          "rows": ["Order #1 - $120", "Order #2 - $340", "Order #3 - $89"]
        },
        {
          "type": "chart",
          "label": "Weekly Sales",
          "data": [10, 25, 18, 40, 35, 55, 60]
        }
      ]
    }
  ]
}
```

### ✅ How to Verify Config-Driven Behavior (Step-by-Step)

1. Open `http://localhost:3000/dashboard` — note `Total Users: 9999`
2. Open MongoDB Atlas → `ai-assistant` database → `dashboardconfigs` collection
3. Click the pencil icon on the document
4. Change `"value": "9999"` → `"value": "50000"`
5. Click **Update**
6. Refresh `http://localhost:3000/dashboard`
7. **Dashboard now shows `Total Users: 50000`** — zero code changes

You can also add a completely new widget:
```json
{ "type": "stats", "label": "Active Sessions", "value": "247" }
```
Add it to the `widgets` array → save → refresh → new card appears instantly.

---

## 💬 AI Chat — Controlled Flow

The chat system implements a **controlled AI flow** where the service layer — not the route or UI — decides when and how to call the AI.

### Flow Diagram

```
User sends message
        │
        ▼
Zod validates input (userId, projectId, productInstanceId, message)
        │
        ▼
Access layer checks project membership
        │
        ▼
Service fetches ProductInstance from MongoDB
        │
        ▼
Checks integration toggles (shopify, crm)
        │
        ├── shopify: true → inject "Shopify: 142 orders, +12% revenue" into prompt
        ├── crm: true    → inject "CRM: 38 new leads, 24% conversion" into prompt
        │
        ▼
Builds enriched prompt → calls ChatGPT-4 API
        │
        ▼
Saves full conversation to MongoDB (scoped to project + product)
        │
        ▼
Returns { reply, steps } to client
```

### Integration Toggles

Integrations are stored per `ProductInstance` in MongoDB:

```json
{
  "projectId": "123",
  "nameSpace": "sales-assistant",
  "integrations": {
    "shopify": true,
    "crm": true
  }
}
```

Toggle `shopify: false` in MongoDB → Shopify context is no longer injected → AI responds without sales data. This is **live and verifiable** without code changes.

### Step Indicators

The UI renders step-by-step indicators showing the AI flow:
- `• Analyzing user query` — always shown
- `• Checking Shopify data` — shown only if `shopify: true`
- `• Fetching CRM insights` — shown only if `crm: true`
- `• Generating AI response` — always shown

---

## 🔐 Authorization

Authorization is enforced **server-side** at the access layer. The UI has no role in authorization decisions.

### Access Functions

| Function | Guards | Behavior |
|---|---|---|
| `requireProjectAccess(userId, projectId)` | All chat routes | Throws `403` if user not in project |
| `requireAdmin(userId, projectId)` | Admin dashboard | Throws `403` if user is not admin |
| `canAccessProject(userId, projectId)` | Pure check | Returns `boolean` — no side effects |
| `isProjectAdmin(userId, projectId)` | Pure check | Returns `boolean` — no side effects |

### Demo Auth Stub

Full authentication is not required per the assignment spec. The demo uses:

- **userId**: `"user-123"` — hardcoded as the seeded admin user
- **projectId**: `"123"` — the seeded demo project slug
- All routes pass these values; in production these would come from a session cookie

### Testing Authorization

```bash
# Valid request — returns 200
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-123","projectId":"123","productInstanceId":"sales-assistant","message":"hello"}'

# Missing fields — returns 400 (Zod validation)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
```

---

## 🌱 Seed Script Details

**File**: `scripts/seed.ts`

```bash
npm run seed
```

The seed script:
1. Connects to MongoDB using `MONGODB_URI` from `.env.local`
2. Clears existing documents from all seeded collections
3. Inserts fresh demo data for all 4 collections
4. Exits cleanly with success/failure logging

This ensures a reproducible, consistent state for reviewers running the project locally.

---

## 🧪 Suggested Demo Queries (For Reviewers)

Ask these questions in the chat at `http://localhost:3000/chat` to see the AI integration context in action:

| Query | What It Demonstrates |
|---|---|
| *"What are my current Shopify sales performance this week?"* | Shopify integration context injected into AI prompt |
| *"How are my CRM leads converting this month?"* | CRM integration context + AI analysis |
| *"Give me a summary of my business performance across Shopify and CRM"* | Both integrations active simultaneously |
| *"What actions should I take to improve my conversion rate?"* | AI reasoning with full business context |
| *"How many orders did we process this week?"* | Order data from Shopify context |

Each response will show step indicators proving the controlled AI flow is working.

---

## 📋 What Is Mocked vs Real

| Feature | Status | Details |
|---|---|---|
| AI responses | ✅ Real | ChatGPT-4 via RapidAPI |
| MongoDB reads/writes | ✅ Real | Atlas cloud — live data |
| Integration toggles | ✅ Real | Stored in and read from MongoDB |
| Shopify data | 🟡 Simulated | Mock string injected into AI prompt |
| CRM data | 🟡 Simulated | Mock string injected into AI prompt |
| Authentication | 🟡 Stubbed | UserId hardcoded per assignment spec |
| Conversation saving | ✅ Real | Saved to MongoDB after every message |
| Dashboard config | ✅ Real | Read live from MongoDB on every request |

---

## 📊 Assessment Coverage

| Criterion | Max | Implementation |
|---|---|---|
| Multi-tenant model (project, product instance, scoped conversations) | 25 | `Project`, `ProductInstance`, `User`, `Conversation` models — all scoped by `projectId` |
| Access / authorization (server-enforced; admin route protected) | 15 | `access/project.access.ts` — `requireProjectAccess` + `requireAdmin` on every route |
| Layered API + Zod | 20 | UI → Hooks → Routes → Access → Services → Models — Zod on all inputs |
| Chat + controlled AI + integration toggles | 15 | Service controls AI call — toggles from MongoDB — conversations saved |
| Admin dashboard: config-driven components | 15 | `dashboardconfigs` collection drives all sections, widgets, layout |
| Frontend UX & code quality | 10 | Loading/error/empty states — `data-testid` — TanStack Query — TypeScript |

---

## 🗺️ Where Config-Driven Behavior Lives

> **Config-driven components are implemented exclusively on the admin dashboard** as per the assignment specification.

- **Collection**: `dashboardconfigs`
- **Field that drives UI**: `sections[].widgets[]`
- **Component that renders it**: `WidgetRenderer` in `app/dashboard/page.tsx`
- **Verification**: Edit the MongoDB document → refresh the dashboard → UI changes immediately

The chat UI and main product shell use standard Next.js routing and React components as permitted by the assignment spec.

---

## 🔧 Key Files Reference

| File | Role |
|---|---|
| `access/project.access.ts` | All authorization logic — pure functions only |
| `services/chat.service.ts` | AI flow control — reads integrations, builds prompt, saves conversation |
| `services/admin.service.ts` | Reads dashboard config from MongoDB |
| `app/api/chat/route.ts` | Thin route — validates with Zod, delegates to service |
| `app/api/admin/route.ts` | Thin route — fetches dashboard config |
| `hooks/useChat.ts` | TanStack Query mutation — handles loading/error/cache |
| `models/DashboardConfig.ts` | Schema for config-driven dashboard |
| `models/Conversation.ts` | Scoped conversation + message history |
| `models/ProductInstance.ts` | Integration toggles per project |
| `scripts/seed.ts` | Reproducible database seed |

---

## 📝 Assumptions

1. Authentication is stubbed with a hardcoded `userId: "user-123"` as permitted by the assignment — the authorization layer is fully implemented and would accept a real session token with no structural changes
2. Shopify and CRM integration data is simulated as string context — the toggle mechanism is real and MongoDB-driven
3. The admin dashboard is the only config-driven UI surface as specified — chat and product shell use conventional routing
4. RapidAPI free tier is used for the AI endpoint — rate limits may apply; the error is surfaced cleanly to the user

---

*Built for the Debales AI Full Stack Developer Internship Assignment — 2026*
