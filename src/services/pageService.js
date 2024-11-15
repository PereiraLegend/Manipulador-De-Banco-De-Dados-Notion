const { createPageRepository, getPageRepository, getAllPagesRepository, updatePageRepository, deletePageRepository } = require('../repositories/pageRepository');

exports.createPageService = async (req) => {
  const { title, description, plannedDate, where, language, content, imageUrl, campaign, imageContent } = req.body;
  
  if (!title || !description || !plannedDate || !where || !language) {
    throw new Error('Missing required properties');
  }
  
  const data = {
    title,
    description,
    plannedDate,
    where,
    language,
    content,
    imageUrl,
    campaign,
    imageContent
  };
  
  return await createPageRepository(data);
};

exports.getPageService = async (id) => {
  if (!id) {
    throw new Error('Page ID is required');
  }
  return await getPageRepository(id);
};

exports.getAllPagesService = async () => {
  return await getAllPagesRepository();
};

exports.updatePageService = async (id, req) => {
  const { title, description, plannedDate, where, language, content, imageUrl, campaign, imageContent } = req.body;

  const data = {
    title,
    description,
    plannedDate,
    where,
    language,
    content,
    imageUrl,
    campaign,
    imageContent
  };

  return await updatePageRepository(id, data);
};

exports.deletePageService = async (id) => {
  return await deletePageRepository(id);
};
