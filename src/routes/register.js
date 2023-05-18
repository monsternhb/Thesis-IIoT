const express = require('express');
const router = express.Router();

// import function
const RegisterController = require('../app/controllers/RegisterController');
const middleWare = require('../app/middlewares/middle');
const userMiddleware = require('../app/middlewares/userMiddleware');

router.get('/home', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, RegisterController.home);
router.get('/history', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, RegisterController.history);
router.get('/export/history', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, RegisterController.exportHistory);
router.get('/export/alarm', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, RegisterController.exportAlarm);
router.get('/alarm', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, RegisterController.alarm);
router.get('/device',middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, RegisterController.device);
router.get('/register', middleWare.checkLogin, RegisterController.register);
router.post('/register/save', middleWare.checkLogin, RegisterController.save);
router.get('/', middleWare.checkLogin, RegisterController.index);
module.exports = router;
