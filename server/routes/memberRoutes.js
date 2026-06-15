const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/authMiddleware');

const {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  archiveMember
} = require('../controllers/memberController');

router.get('/', verifyToken, getMembers);

router.get('/:id', verifyToken, getMemberById);

router.post('/', verifyToken, createMember);

router.put('/:id', verifyToken, updateMember);

router.delete('/:id', verifyToken, deleteMember);

router.put('/:id/archive', archiveMember);

module.exports = router;