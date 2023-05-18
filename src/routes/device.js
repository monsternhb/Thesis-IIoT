const express = require('express');
const router = express.Router();

// import function
const deviceController = require('../app/controllers/DeviceController');
const middleWare = require('../app/middlewares/middle');



router.post('/save', middleWare.checkLogin,middleWare.checkManager,deviceController.save);
router.get('/', middleWare.checkLogin, deviceController.index);

module.exports = router;
