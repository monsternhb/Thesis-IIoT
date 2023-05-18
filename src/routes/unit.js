const express = require('express');
const router = express.Router();

// import function
const UnitController = require('../app/controllers/UnitController');
const middleWare = require('../app/middlewares/middle');
const userMiddleware = require('../app/middlewares/userMiddleware');
const UserMiddleWare = require('../app/middlewares/userMiddleware');

// router.delete('/device/:id',middleWare.checkLogin, CompanyController.removeDev);
router.put('/device/:id',middleWare.checkLogin, UnitController.updateDev);
// router.post('/device', middleWare.checkLogin, UnitController.addNewDev);
router.get('/home', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev,UnitController.home);
router.get('/history', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, UnitController.history);
router.get('/alarm', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, UnitController.alarm);
router.get('/export/history', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, UnitController.exportHistory);
router.get('/export/alarm', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, UnitController.exportAlarm);
router.get('/device',middleWare.checkLogin, UnitController.device);
router.get('/register', middleWare.checkLogin, UnitController.register);
router.post('/register/save', middleWare.checkLogin, UnitController.save);
router.get('/', middleWare.checkLogin,UnitController.index);
module.exports = router;
