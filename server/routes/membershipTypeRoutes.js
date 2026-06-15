const express = require('express');

const router = express.Router();

const {
  getMembershipTypes
} = require('../controllers/membershipTypeController');

const authMiddleware =
  require('../middleware/authMiddleware');

router.get(
  '/',
  authMiddleware,
  getMembershipTypes
);

module.exports = router;