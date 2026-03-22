const express = require("express");
const cors = require("cors");
const { Client } = require("@notionhq/client");
require("dotenv").config();

const app = express();
const notion = new Client({ auth: process.env.NOTION_API_KEY });

const SERVICES_DB_ID = process.env.NOTION_SERVICES_DB_ID;
const LEADS_DB_ID = process.env.NOTION_LEADS_DB_ID;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function normalizeTimelineOption(timeline) {
  if (!timeline) return "Standard";
  if (timeline === "ASAP" || timeline === "1 week") return "Rush";
  if (timeline === "2 weeks" || timeline === "1 month" || timeline === "Flexible") return "Standard";
  return timeline;
}

// Helper to extract property value safely
function getPropertyValue(properties, propertyName) {
  const prop = properties[propertyName];
  if (!prop) return null;
  if (prop.type === "title" && prop.title?.length) return prop.title[0].plain_text;
  if (prop.type === "rich_text" && prop.rich_text?.length) return prop.rich_text[0].plain_text;
  if (prop.type === "number") return prop.number;
  if (prop.type === "select" && prop.select) return prop.select.name;
  if (prop.type === "multi_select") return prop.multi_select?.map((s) => s.name) || [];
  if (prop.type === "email") return prop.email;
  return null;
}

// Helper to set text property
function setTextProperty(name, value) {
  if (!value) return { rich_text: [] };
  return { rich_text: [{ text: { content: String(value) } }] };
}

// Helper to set number property
function setNumberProperty(value) {
  return { number: Number(value) || 0 };
}

// GET /api/services
app.get("/api/services", async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: SERVICES_DB_ID,
    });

    const services = response.results.map((page) => ({
      id: page.id,
      name: getPropertyValue(page.properties, "Services Name") || getPropertyValue(page.properties, "Name") || "Unnamed Service",
      price: getPropertyValue(page.properties, "Price") || 0,
      category: getPropertyValue(page.properties, "Category") || null,
    }));

    res.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// POST /api/lead
app.post("/api/lead", async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      budgetRange,
      timeline,
      details,
      totalPrice,
      selectedServices,
      bundleApplied,
      discountAmount,
    } = req.body;

    // Auto-assign status and stage based on total price
    let stage = "New";
    if (totalPrice >= 1000 && totalPrice < 2000) {
      stage = "Qualified";
    } else if (totalPrice >= 2000) {
      stage = "Proposal Sent";
    }

    // Calculate priority
    let priority = "Low";
    if (totalPrice >= 1500) priority = "High";
    else if (totalPrice >= 1000) priority = "Medium";

    const response = await notion.pages.create({
      parent: { database_id: LEADS_DB_ID },
      properties: {
        Name: {
          title: [{ text: { content: name || "Unnamed Lead" } }],
        },
        Email: {
          email: email || "",
        },
        Company: setTextProperty("Company", company),
        Budget: {
          select: { name: budgetRange || "Not specified" },
        },
        Timeline: {
          select: { name: normalizeTimelineOption(timeline) },
        },
        Details: {
          rich_text: [{ text: { content: details || "" } }],
        },
        "Total Price": setNumberProperty(totalPrice),
        Services: setTextProperty("Services", (selectedServices || []).join(", ")),
        Bundle: setTextProperty("Bundle", bundleApplied),
        Discount: setNumberProperty(discountAmount),
        Stage: {
          select: { name: stage },
        },
        Priority: {
          select: { name: priority },
        },
      },
    });

    res.json({
      message: "Lead saved to Notion.",
      leadId: response.id,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
