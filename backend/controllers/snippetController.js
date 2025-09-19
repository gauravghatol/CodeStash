const asyncHandler = require('express-async-handler');
const Snippet = require('../models/snippetModel');

// GET /api/snippets
const getAllSnippets = asyncHandler(async (req, res) => {
  const { search, language } = req.query;
  const query = {};
  if (language) query.language = language;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }
  const snippets = await Snippet.find(query).populate('author', 'username').sort({ createdAt: -1 });
  res.json(snippets);
});

// POST /api/snippets
const createSnippet = asyncHandler(async (req, res) => {
  const { title, description, language, code, tags } = req.body;
  if (!title || !language || !code) {
    res.status(400);
    throw new Error('Title, language, and code are required');
  }
  const snippet = await Snippet.create({
    author: req.user.id,
    title,
    description,
    language,
    code,
    tags: Array.isArray(tags) ? tags : [],
  });
  const populated = await snippet.populate('author', 'username');
  res.status(201).json(populated);
});

// GET /api/snippets/:id
const getSnippetById = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id).populate('author', 'username');
  if (!snippet) {
    res.status(404);
    throw new Error('Snippet not found');
  }
  res.json(snippet);
});

// PUT /api/snippets/:id
const updateSnippet = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);
  if (!snippet) {
    res.status(404);
    throw new Error('Snippet not found');
  }
  if (snippet.author.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this snippet');
  }
  const { title, description, language, code, tags } = req.body;
  if (title !== undefined) snippet.title = title;
  if (description !== undefined) snippet.description = description;
  if (language !== undefined) snippet.language = language;
  if (code !== undefined) snippet.code = code;
  if (tags !== undefined) snippet.tags = Array.isArray(tags) ? tags : snippet.tags;
  await snippet.save();
  const populated = await snippet.populate('author', 'username');
  res.json(populated);
});

// DELETE /api/snippets/:id
const deleteSnippet = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);
  if (!snippet) {
    res.status(404);
    throw new Error('Snippet not found');
  }
  if (snippet.author.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to delete this snippet');
  }
  await snippet.deleteOne();
  res.json({ message: 'Snippet deleted' });
});

// PUT /api/snippets/:id/like
const likeSnippet = asyncHandler(async (req, res) => {
  const snippet = await Snippet.findById(req.params.id);
  if (!snippet) {
    res.status(404);
    throw new Error('Snippet not found');
  }
  const userId = req.user.id;
  const index = snippet.likes.findIndex((u) => u.toString() === userId);
  if (index >= 0) snippet.likes.splice(index, 1); else snippet.likes.push(userId);
  await snippet.save();
  const populated = await snippet.populate('author', 'username');
  res.json(populated);
});

module.exports = { getAllSnippets, createSnippet, getSnippetById, updateSnippet, deleteSnippet, likeSnippet };
// GET /api/users/:userId/snippets
const getUserSnippets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const snippets = await Snippet.find({ author: userId }).populate('author', 'username').sort({ createdAt: -1 });
  res.json(snippets);
});

module.exports.getUserSnippets = getUserSnippets;
