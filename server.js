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

function setTextProperty(name, value) {
  if (!value) return { rich_text: [] };
  return { rich_text: [{ text: { content: String(value) } }] };
}

function setNumberProperty(value) {
  return { number: Number(value) || 0 };
}

app.get("/api/services", async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: SERVICES_DB_ID,
    });

    const services = response.results.map((page) => ({
      id: page.id,
      name: getPropertyValue(page.properties, "Name") || "Unnamed Service",
      price: getPropertyValue(page.properties, "Price") || 0,
      category: getPropertyValue(page.properties, "Category") || null,
    }));

    res.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

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

    let stage = "New";
    if (totalPrice >= 1000 && totalPrice < 2000) {
      stage = "Qualified";
    } else if (totalPrice >= 2000) {
      stage = "Proposal Sent";
    }

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
        "Budget Range": {
          select: { name: budgetRange || "Not specified" },
        },
        Timeline: setTextProperty("Timeline", timeline),
        Details: {
          rich_text: [{ text: { content: details || "" } }],
        },
        "Total Price": setNumberProperty(totalPrice),
        "Selected Services": {
          multi_select: (selectedServices || []).map((service) => ({
            name: service,
          })),
        },
        Bundle: setTextProperty("Bundle", bundleApplied),
        Discount: setNumberProperty(discountAmount),
        Status: {
          select: { name: "New" },
        },
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

app.get("/api/admin/summary", async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: LEADS_DB_ID,
    });

    const leads = response.results;
    const totalLeads = leads.length;

    let totalQuoteValue = 0;
    const serviceFreq = {};
    const stageCount = {};

    leads.forEach((page) => {
      const price = getPropertyValue(page.properties, "Total Price") || 0;
      totalQuoteValue += price;

      const services = getPropertyValue(page.properties, "Selected Services") || [];
      services.forEach((service) => {
        serviceFreq[service] = (serviceFreq[service] || 0) + 1;
      });

      const stage = getPropertyValue(page.properties, "Stage") || "Unknown";
      stageCount[stage] = (stageCount[stage] || 0) + 1;
    });

    const averageQuoteValue = totalLeads > 0 ? Math.round(totalQuoteValue / totalLeads) : 0;

    const topServices = Object.entries(serviceFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      totalLeads,
      averageQuoteValue,
      totalPipelineValue: totalQuoteValue,
      topServices,
      stageBreakdown: stageCount,
    });
  } catch (error) {
    console.error("Error fetching admin summary:", error);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
