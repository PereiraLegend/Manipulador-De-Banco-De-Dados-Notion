const express = require('express');
const axios = require('axios');
const multer = require('multer');
const upload = multer();
const app = express();
app.use(express.json());

require('dotenv').config();

const notionToken = process.env.NOTION_TOKEN;
const databaseId = process.env.DATABASE_ID;

const notionHeaders = {
  'Authorization': `Bearer ${notionToken}`,
  'Content-Type': 'application/json',
  'Notion-Version': '2021-05-13'
};

app.get('/list/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Page ID is required' });
  }
  try {
    const response = await axios.get(`https://api.notion.com/v1/pages/${id}`, { headers: notionHeaders });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching page:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch page from Notion' });
  }
});

app.get('/listall', async (req, res) => {
  try {
    const response = await axios.post(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {},
      { headers: notionHeaders }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching pages:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch pages from Notion' });
  }
});

app.post('/create', upload.single('image'), async (req, res) => {
  let { 
    title, 
    description, 
    plannedDate, 
    where, 
    language, 
    content, 
    imageUrl, 
    campaign, 
    imageContent 
  } = req.body;

  if (req.headers['content-type']?.includes('multipart/form-data')) {
    try {
      title = title || '';
      description = description || '';
      plannedDate = plannedDate || '';
      where = where || '';
      language = language || '';
      content = content || '';
      campaign = campaign || '';
      imageContent = imageContent || '';
    } catch (error) {
      return res.status(400).json({ error: 'Failed to parse form data' });
    }
  }

  if (!title || !description || !plannedDate || !where || !language) {
    return res.status(400).json({ error: 'Missing required properties' });
  }

  const data = {
    parent: { database_id: databaseId },
    properties: {
      Company: { title: [{ text: { content: title } }] },
      Description: { rich_text: [{ text: { content: description } }] },
      PlannedDate: { date: { start: plannedDate } },
      Where: { rich_text: [{ text: { content: where } }] },
      Language: { select: { name: language } },
      Content: { rich_text: [{ text: { content: content || '' } }] },
      Image: { files: imageUrl ? [{ name: "Uploaded Image", external: { url: imageUrl } }] : [] },
      Campaign: { rich_text: [{ text: { content: campaign || '' } }] },
      'image content': { rich_text: [{ text: { content: imageContent || '' } }] }
    }
  };

  try {
    const response = await axios.post(
      'https://api.notion.com/v1/pages', 
      data, 
      { headers: notionHeaders }
    );
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating page:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to create page in Notion' });
  }
});

app.patch('/update/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Page ID is required' });
  }

  let { 
    title, 
    description, 
    plannedDate, 
    where, 
    language, 
    content, 
    imageUrl, 
    campaign, 
    imageContent 
  } = req.body;

  if (req.headers['content-type']?.includes('multipart/form-data')) {
    try {
      title = title || '';
      description = description || '';
      plannedDate = plannedDate || '';
      where = where || '';
      language = language || '';
      content = content || '';
      campaign = campaign || '';
      imageContent = imageContent || '';
    } catch (error) {
      return res.status(400).json({ error: 'Failed to parse form data' });
    }
  }

  if (!title && !description && !plannedDate && !where && !language && !content && !imageUrl && !campaign && !imageContent) {
    return res.status(400).json({ error: 'No fields provided for update' });
  }

  const data = {
    properties: {
      ...(title && { Company: { title: [{ text: { content: title } }] } }),
      ...(description && { Description: { rich_text: [{ text: { content: description } }] } }),
      ...(plannedDate && { PlannedDate: { date: { start: plannedDate } } }),
      ...(where && { Where: { rich_text: [{ text: { content: where } }] } }),
      ...(language && { Language: { select: { name: language } } }),
      ...(content && { Content: { rich_text: [{ text: { content } }] } }),
      ...(imageUrl && { Image: { files: [{ name: "Updated Image", external: { url: imageUrl } }] } }),
      ...(campaign && { Campaign: { rich_text: [{ text: { content: campaign } }] } }),
      ...(imageContent && { 'image content': { rich_text: [{ text: { content: imageContent } }] } })
    }
  };

  try {
    const response = await axios.patch(
      `https://api.notion.com/v1/pages/${id}`,
      data,
      { headers: notionHeaders }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error updating page:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to update page in Notion' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Page ID is required' });
  }
  try {
    const response = await axios.patch(
      `https://api.notion.com/v1/pages/${id}`,
      { archived: true },
      { headers: notionHeaders }
    );
    res.status(200).json({ message: 'Page successfully deleted', data: response.data });
  } catch (error) {
    console.error('Error deleting page:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to delete page in Notion' });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
