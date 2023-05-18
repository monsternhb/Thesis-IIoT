const express = require('express');
const router = express.Router();
// import function
const loginController = require('../app/controllers/LoginController');
router.post('/login', loginController.auth);
router.get('/', loginController.index);
module.exports = router;
