const { Client } = require("@notionhq/client");
require("dotenv").config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const leadsDbId = process.env.NOTION_LEADS_DB_ID;

const sampleLeads = [
  {
    name: "Amina Rahman",
    email: "amina@novalabs.co",
    company: "Nova Labs",
    budget: "$1000 - $2500",
    timeline: "Standard",
    details: "Need logo and business cards for product launch.",
    total: 540,
    services: "Logo Design, Business Cards",
    bundle: "Brand Starter",
    discount: 60,
    stage: "New",
    priority: "Low",
  },
  {
    name: "Karim Elsayed",
    email: "karim@northmedia.io",
    company: "North Media",
    budget: "$2500 - $5000",
    timeline: "Standard",
    details: "Brand identity and landing page for new campaign.",
    total: 2288,
    services: "Logo Design, Social Media Starter Pack, Landing Page Design",
    bundle: "Launch Essentials",
    discount: 312,
    stage: "Proposal Sent",
    priority: "High",
  },
  {
    name: "Sara Nabil",
    email: "sara@vertexgroup.net",
    company: "Vertex Group",
    budget: "$5000 - $10000",
    timeline: "Standard",
    details: "Full brand growth package and GBP optimization.",
    total: 1766,
    services: "Logo Design, Brand Identity Kit, Google Business Profile Setup",
    bundle: "Brand Growth",
    discount: 154,
    stage: "Qualified",
    priority: "High",
  },
  {
    name: "Youssef Adel",
    email: "youssef@peakfit.app",
    company: "PeakFit",
    budget: "$500 - $1000",
    timeline: "Rush",
    details: "Flyer design for upcoming fitness event.",
    total: 180,
    services: "Flyer Design",
    bundle: "",
    discount: 0,
    stage: "New",
    priority: "Low",
  },
  {
    name: "Laila Hassan",
    email: "laila@orionventures.com",
    company: "Orion Ventures",
    budget: "$10000+",
    timeline: "Rush",
    details: "Investor pitch deck and landing page design.",
    total: 1650,
    services: "Pitch Deck Design, Landing Page Design",
    bundle: "",
    discount: 0,
    stage: "Qualified",
    priority: "High",
  },
];

async function seed() {
  if (!leadsDbId) {
    throw new Error("Missing NOTION_LEADS_DB_ID in .env");
  }

  const created = [];

  for (const row of sampleLeads) {
    const page = await notion.pages.create({
      parent: { database_id: leadsDbId },
      properties: {
        Name: { title: [{ text: { content: row.name } }] },
        Email: { email: row.email },
        Company: { rich_text: [{ text: { content: row.company } }] },
        Budget: { select: { name: row.budget } },
        Timeline: { select: { name: row.timeline } },
        Details: { rich_text: [{ text: { content: row.details } }] },
        "Total Price": { number: row.total },
        Services: { rich_text: [{ text: { content: row.services } }] },
        Bundle: row.bundle ? { rich_text: [{ text: { content: row.bundle } }] } : { rich_text: [] },
        Discount: { number: row.discount },
        Stage: { select: { name: row.stage } },
        Priority: { select: { name: row.priority } },
      },
    });

    created.push({ name: row.name, leadId: page.id });
  }

  console.log("Created sample leads:");
  console.log(JSON.stringify(created, null, 2));
}

seed().catch((err) => {
  console.error("Failed to seed sample leads:", err.message);
  process.exit(1);
});
