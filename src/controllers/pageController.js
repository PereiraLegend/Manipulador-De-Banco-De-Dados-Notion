const { createPageService, getPageService, getAllPagesService, updatePageService, deletePageService } = require('../services/pageService');

exports.createPage = async (req, res) => {
  try {
    const result = await createPageService(req);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create page in Notion' });
  }
};

exports.getPageById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await getPageService(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch page from Notion' });
  }
};

exports.getAllPages = async (req, res) => {
  try {
    const result = await getAllPagesService();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pages from Notion' });
  }
};

exports.updatePage = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await updatePageService(id, req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update page in Notion' });
  }
};

exports.deletePage = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await deletePageService(id);
    res.status(200).json({ message: 'Page successfully deleted', data: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete page in Notion' });
  }
};
