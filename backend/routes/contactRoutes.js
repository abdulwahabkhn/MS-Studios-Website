const express = require('express');
const { sendContactEmail } = require('../controllers/contactController');
const validateContact = require('../middleware/validateContact');

const router = express.Router();

router.post('/', validateContact, sendContactEmail);

module.exports = router;
