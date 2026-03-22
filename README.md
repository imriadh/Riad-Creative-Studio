# Client Proposals Portal - Riad Creative Studio

A professional web-based proposal and quote portal integrated with Notion for real-time service pricing and lead management.

## ✨ Features

- **Service Catalog**: Browse all creative services with real-time pricing from Notion
- **Smart Bundle Pricing**: Automatic discount application for service packages
  - Brand Starter: 10% discount
  - Launch Essentials: 12% discount  
  - Brand Growth: 8% discount
- **Lead Management**: Capture client inquiries with company, budget, timeline, and project details
- **Admin Dashboard**: View pipeline metrics, lead counts, average quotes, and top services
- **Notion Integration**: All data stored and synced through Notion databases
- **Download Estimates**: Export proposal summaries as text files

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Backend**: Node.js with Express.js
- **Database**: Notion API
- **API Client**: @notionhq/client

## 📁 Project Structure

```
.
├── server.js                    # Express backend server
├── public/
│   ├── index.html              # Main quote portal (client-facing)
│   └── admin.html              # Admin dashboard
├── scripts/
│   └── notion_enhance_leads_workflow.js  # Notion database setup
├── package.json
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- Notion workspace with API access
- Notion API key and database IDs

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/imriadh/Riad-Creative-Studio.git
cd Riad-Creative-Studio
```

2. **Install dependencies**:
```bash
npm install
```

3. **Create `.env` file** in the root directory:
```
NOTION_API_KEY=your_notion_api_key_here
NOTION_SERVICES_DB_ID=your_services_database_id
NOTION_LEADS_DB_ID=your_leads_database_id
PORT=3000
```

4. **Setup Notion database properties** (one-time):
```bash
npm run setup
```

5. **Start the server**:
```bash
npm start
```

6. **Open in browser**:
- Portal: http://localhost:3000
- Admin: http://localhost:3000/admin.html

## 📡 API Endpoints

### GET `/api/services`
Retrieves all services from the Notion Services database.

**Response**:
```json
{
  "services": [
    {
      "id": "service-uuid",
      "name": "Logo Design",
      "price": 500,
      "category": "Branding"
    }
  ]
}
```

### POST `/api/lead`
Creates a new lead in the Notion Leads database.

**Request Body**:
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

### GET `/api/admin/summary`
Returns pipeline analytics and metrics.

**Response**:
```json
{
  "totalLeads": 25,
  "averageQuoteValue": 1250,
  "totalPipelineValue": 31250,
  "topServices": [
    { "name": "Logo Design", "count": 15 }
  ],
  "stageBreakdown": {
    "New": 10,
    "Qualified": 8,
    "Proposal Sent": 7
  }
}
```

## 🗄️ Notion Database Schema

### Services Database
- **Name** (title)
- **Price** (number)
- **Category** (select)

### Leads Database (Client Proposals)
- **Name** (title) - Contact name
- **Email** (email) - Contact email
- **Company** (text) - Client company name
- **Budget Range** (select) - Client budget
- **Timeline** (text) - Project timeline
- **Total Price** (number) - Quote amount
- **Bundle Applied** (text) - Bundle name if applicable
- **Discount Amount** (number) - Discount value
- **Selected Services** (multi-select) - Services chosen
- **Status** (select) - New/Qualified/Proposal Sent
- **Stage** (select) - Pipeline stage
- **Priority** (select) - Low/Medium/High
- **Details** (rich text) - Project description

## 💼 Business Logic

### Bundle Detection
The system automatically detects service combinations and applies the best discount:
- "Brand Starter": Logo Design + Business Cards = 10% off
- "Launch Essentials": Logo Design + Social Media Starter Pack + Landing Page Design = 12% off
- "Brand Growth": Logo Design + Brand Identity Kit + Google Business Profile = 8% off

### Lead Qualification
Leads are automatically assigned:
- **Status**: Always "New" on creation
- **Stage** (based on quote value):
  - New: < $1,000
  - Qualified: $1,000 - $2,000
  - Proposal Sent: > $2,000
- **Priority** (based on value and timeline):
  - Low: < $1,000
  - Medium: $1,000 - $1,500
  - High: ≥ $1,500

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NOTION_API_KEY` | Notion API authentication key | Yes |
| `NOTION_SERVICES_DB_ID` | Database ID for services | Yes |
| `NOTION_LEADS_DB_ID` | Database ID for client proposals | Yes |
| `PORT` | Server port (default: 3000) | No |

## 📝 Usage

### For Clients
1. Visit the quote portal at http://localhost:3000
2. Select desired services from the catalog
3. (Bundles apply automatically with discounts!)
4. Fill in your contact and project information
5. Submit to receive a proposal
6. Optionally download your estimate as a text file

### For Admin
1. Visit the dashboard at http://localhost:3000/admin.html
2. View key metrics: total leads, average quote value, pipeline value
3. Review top-performing services
4. Monitor pipeline by stage
5. Click "Refresh Data" to update metrics

## 🔐 Security Notes

- The `.env` file contains sensitive credentials (never commit to version control)
- `.gitignore` is configured to exclude `.env`, `node_modules/`, and logs
- Notion API key should be kept private
- For production, use environment variable management services

## 📦 Dependencies

- **express** - Web server framework
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **@notionhq/client** - Official Notion JavaScript client

## 🎯 Next Steps / Future Enhancements

- [ ] Email notifications when leads are submitted
- [ ] Automated follow-up workflows in Notion
- [ ] Service pricing tiers and custom quotes
- [ ] Multi-currency support
- [ ] Client login to track proposal status
- [ ] Integration with payment processors
- [ ] Analytics and reporting dashboard

## 📞 Support

For questions or support, contact Riad Creative Studio directly.

## 📄 License

This project is private and proprietary to Riad Creative Studio.

---

**Created**: March 2026  
**Repository**: https://github.com/imriadh/Riad-Creative-Studio  
**Portal**: http://localhost:3000  
**Admin**: http://localhost:3000/admin.html
