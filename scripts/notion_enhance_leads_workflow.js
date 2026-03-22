const { Client } = require("@notionhq/client");
require("dotenv").config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const LEADS_DB_ID = process.env.NOTION_LEADS_DB_ID;

async function enhanceLeadsDatabase() {
  try {
    console.log("Enhancing Leads database with workflow properties...");

    // Retrieve the database
    const db = await notion.databases.retrieve({ database_id: LEADS_DB_ID });

    // Properties to add/update
    const propertiesToAdd = {
      Status: {
        select: {
          options: [
            { name: "New", color: "blue" },
            { name: "Qualified", color: "green" },
            { name: "Proposal Sent", color: "purple" },
          ],
        },
      },
      Stage: {
        select: {
          options: [
            { name: "New", color: "blue" },
            { name: "Qualified", color: "green" },
            { name: "Proposal Sent", color: "purple" },
          ],
        },
      },
      Priority: {
        select: {
          options: [
            { name: "Low", color: "gray" },
            { name: "Medium", color: "yellow" },
            { name: "High", color: "red" },
          ],
        },
      },
      Budget: { rich_text: {} },
      Timeline: { rich_text: {} },
      Bundle: { rich_text: {} },
      Discount: { number: {} },
    };

    // Update the database with new properties
    const updatePayload = { properties: {} };

    Object.entries(propertiesToAdd).forEach(([propName, propConfig]) => {
      // Only add if property doesn't exist
      if (!db.properties[propName]) {
        updatePayload.properties[propName] = propConfig;
      }
    });

    if (Object.keys(updatePayload.properties).length > 0) {
      await notion.databases.update({
        database_id: LEADS_DB_ID,
        properties: updatePayload.properties,
      });
      console.log("✅ Database enhanced successfully!");
      console.log("Added properties:", Object.keys(updatePayload.properties).join(", "));
    } else {
      console.log("✅ All properties already exist!");
    }
  } catch (error) {
    console.error("❌ Error enhancing database:", error.message);
    process.exit(1);
  }
}

enhanceLeadsDatabase();
