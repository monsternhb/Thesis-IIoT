const express = require('express');
const router = express.Router();

// import function
const alarmController = require('../app/controllers/AlarmController');
const middleWare = require('../app/middlewares/middle');

router.post('/device/:deviceId?/:userName?/:userId?',middleWare.checkLogin,alarmController.createAlarm);
router.get('/', alarmController.index);

module.exports = router;
