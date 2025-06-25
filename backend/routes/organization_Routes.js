const express = require('express');
const router = express.Router();
const { registerOrganization } = require('../controllers/Organization_Controller');

router.post('/Register', registerOrganization);
module.exports = router;