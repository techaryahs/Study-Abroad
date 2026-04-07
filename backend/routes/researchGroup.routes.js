const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { createResearchGroup, getResearchGroups, joinResearchGroup } = require('../controllers/researchGroup.controller');

// Public route to view groups
router.get('/', getResearchGroups);

// Protected routes (Login required)
router.post('/create', verifyToken, createResearchGroup);
router.post('/:id/join', verifyToken, joinResearchGroup);

module.exports = router;
