# Client Proposals Portal - Riad Creative Studio

Premium quote and inquiry portal connected to Notion for real-time services and lead capture.

## Quick Links

- Live Website: https://riad-creative-studio.onrender.com/
- Source Code: https://github.com/imriadh/Riad-Creative-Studio

## Overview

This project lets clients:

- Browse services loaded from Notion
- Get instant quote updates with bundle discounts
- Submit project details and contact info
- Save leads directly into a Notion database

## Features

- Real-time service catalog from Notion (`/api/services`)
- Bundle-based discounts only (simple pricing model)
- Premium editorial UI in `public/index.html`
- Lead submission API to Notion (`/api/lead`)
- Estimate download as `.txt`

## Current Project Structure

```
.
├── .env.example
├── .gitignore
├── LICENSE
├── README.md
├── package.json
├── package-lock.json
├── server.js
├── public/
│   └── index.html
├── scripts/
│   └── notion_enhance_leads_workflow.js
└── .vscode/
    └── mcp.json
```

## Structure Improvements (Safe / Non-Breaking)

To keep everything stable, no existing runtime files were moved or deleted.

Improvements applied:

- Added `.env.example` for cleaner environment onboarding
- Updated this README to match the actual codebase and APIs

Recommended future organization (optional, no change required now):

- `public/assets/` for icons/images/fonts
- `scripts/` for all one-off Notion utilities
- `src/` split only when backend grows larger

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
copy .env.example .env
```

3. Fill `.env` values:

```env
PORT=3000
NOTION_API_KEY=your_notion_api_key_here
NOTION_SERVICES_DB_ID=your_services_database_id
NOTION_LEADS_DB_ID=your_leads_database_id
```

4. Optional one-time Notion workflow setup:

```bash
npm run setup
```

5. Run server:

```bash
npm start
```

Open: http://localhost:3000

## API Endpoints

### GET `/api/services`

Returns services from your Notion Services database.

Example:

```json
{
  "services": [
    {
      "id": "32b7440e-7d23-8065-89f3-ff9a57e60f96",
      "name": "Logo Design",
      "price": 500,
      "category": "Branding"
    }
  ]
}
```

### POST `/api/lead`

Creates a lead in the Notion Leads database.

Payload:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "budgetRange": "$1000 - $2500",
  "timeline": "2 weeks",
  "details": "Project description",
  "totalPrice": 1500,
  "selectedServices": ["Logo Design", "Business Cards"],
  "bundleApplied": "Brand Starter",
  "discountAmount": 150
}
```

## Notion Field Mapping (Current Code)

### Services DB

- `Services Name` (preferred) or fallback `Name`
- `Price`
- `Category`

### Leads DB

- `Name` (title)
- `Email` (email)
- `Company` (rich_text)
- `Budget` (select)
- `Timeline` (select)
- `Details` (rich_text)
- `Total Price` (number)
- `Services` (rich_text, comma-separated)
- `Bundle` (rich_text)
- `Discount` (number)
- `Stage` (select)
- `Priority` (select)

## Business Logic

Bundle discounts:

- Brand Starter: 10%
- Launch Essentials: 12%
- Brand Growth: 8%

Stage assignment by total price:

- `< 1000` -> `New`
- `1000 - 1999` -> `Qualified`
- `>= 2000` -> `Proposal Sent`

## Scripts

- `npm start` -> Run API server
- `npm run dev` -> Run API server (same as start)
- `npm run setup` -> Enhance Notion leads workflow properties

## Security Notes

- Never commit `.env`
- Keep Notion API key private
- `.env.example` is safe to commit and share

## License

Private/internal project for Riad Creative Studio.
