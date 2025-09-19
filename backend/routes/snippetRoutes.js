const express = require('express');
const { getAllSnippets, createSnippet, getSnippetById, updateSnippet, deleteSnippet, likeSnippet } = require('../controllers/snippetController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getAllSnippets)
  .post(protect, createSnippet);

router.route('/:id')
  .get(getSnippetById)
  .put(protect, updateSnippet)
  .delete(protect, deleteSnippet);

router.put('/:id/like', protect, likeSnippet);

module.exports = router;
