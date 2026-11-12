# Marketplace

A modern, responsive Marketplace application built with Next.js 15, React 19, TypeScript, Tailwind CSS, and Supabase.

---

## Features

- **Responsive Catalog Grid**: Clean portrait listing cards with category filtering, search, and responsive layout.
- **Create Listing**:
  - Image upload with instant preview.
  - Form validation for title, description, price, location, and seller email.
  - Side-by-side preview updating in real time.
- **Listing Details**: Dedicated page for each item displaying high-resolution images, full specifications, and seller information.
- **Direct Messaging**: Store buyer inquiries directly in Supabase linked by listing ID.
- **Supabase Integration**: Relational database with Row Level Security (RLS) policies and image bucket storage.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Database Setup
Execute the SQL schema in `supabase-schema.sql` inside your Supabase project's SQL Editor to initialize the `listings` table, `messages` table, and storage bucket.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS, Geist font
- **Database & Storage**: Supabase (PostgreSQL, Storage)
- **Icons**: Lucide React
