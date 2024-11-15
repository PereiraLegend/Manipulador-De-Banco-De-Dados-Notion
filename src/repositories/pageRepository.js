const axios = require('axios');
require('dotenv').config();
const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.DATABASE_ID;
const notionHeaders = {
  'Authorization': `Bearer ${notionToken}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2021-05-13'
};

exports.createPageRepository = async (data) => {
  const notionData = {
    parent: { database_id: databaseId },
    properties: {
      Company: { title: [{ text: { content: data.title } }] },
      Description: { rich_text: [{ text: { content: data.description } }] },
      PlannedDate: { date: { start: data.plannedDate } },
      Where: { rich_text: [{ text: { content: data.where } }] },
      Language: { select: { name: data.language } },
      Content: { rich_text: [{ text: { content: data.content || '' } }] },
      Image: { files: data.imageUrl ? [{ name: "Uploaded Image", external: { url: data.imageUrl } }] : [] },
      Campaign: { rich_text: [{ text: { content: data.campaign || '' } }] },
      'image content': { rich_text: [{ text: { content: data.imageContent || '' } }] }
    }
  };

  try {
    const response = await axios.post('https://api.notion.com/v1/pages', notionData, { headers: notionHeaders });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create page in Notion');
  }
};

exports.getPageRepository = async (id) => {
  try {
    const response = await axios.get(`https://api.notion.com/v1/pages/${id}`, { headers: notionHeaders });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch page from Notion');
  }
};

exports.getAllPagesRepository = async () => {
  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {},
      { headers: notionHeaders }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch pages from Notion');
  }
};

exports.updatePageRepository = async (id, data) => {
  const notionData = {
    properties: {
      ...(data.title && { Company: { title: [{ text: { content: data.title } }] } }),
      ...(data.description && { Description: { rich_text: [{ text: { content: data.description } }] } }),
      ...(data.plannedDate && { PlannedDate: { date: { start: data.plannedDate } } }),
      ...(data.where && { Where: { rich_text: [{ text: { content: data.where } }] } }),
      ...(data.language && { Language: { select: { name: data.language } } }),
      ...(data.content && { Content: { rich_text: [{ text: { content: data.content } }] } }),
      ...(data.imageUrl && { Image: { files: [{ name: "Updated Image", external: { url: data.imageUrl } }] } }),
      ...(data.campaign && { Campaign: { rich_text: [{ text: { content: data.campaign } }] } }),
      ...(data.imageContent && { 'image content': { rich_text: [{ text: { content: data.imageContent } }] } })
    }
  };

  try {
    const response = await axios.patch(`https://api.notion.com/v1/pages/${id}`, notionData, { headers: notionHeaders });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update page in Notion');
  }
};

exports.deletePageRepository = async (id) => {
  try {
    const response = await axios.patch(
      `https://api.notion.com/v1/pages/${id}`,
      { archived: true },
      { headers: notionHeaders }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete page in Notion');
  }
};
