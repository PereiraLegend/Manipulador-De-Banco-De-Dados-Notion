const express = require('express');
const multer = require('multer');
const upload = multer();
const app = express();
app.use(express.json());

const { createPage, getPageById, getAllPages, updatePage, deletePage } = require('./controllers/pageController.js');

app.get('/list/:id', getPageById);
app.get('/listall', getAllPages);
app.post('/create', upload.single('image'), createPage);
app.patch('/update/:id', upload.single('image'), updatePage);
app.delete('/delete/:id', deletePage);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
