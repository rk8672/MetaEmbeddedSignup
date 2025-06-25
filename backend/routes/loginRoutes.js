const express = require('express');
const router = express.Router();
const { loginOrgUser } = require('../controllers/Login_Controller');

router.post('/Login', loginOrgUser);



module.exports = router;


