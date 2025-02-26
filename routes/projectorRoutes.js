const express = require('express');
const { addProjector } = require('../controllers/projectorController');

const router = express.Router();

router.post('/', addProjector);

module.exports = router;
