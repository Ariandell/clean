const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.get('/public', settingsController.getPublicSettings);
router.get('/', settingsController.getAllSettings);
router.put('/', settingsController.updateSettings);

module.exports = router;
