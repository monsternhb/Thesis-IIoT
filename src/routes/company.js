const express = require('express');
const router = express.Router();

// import function
const CompanyController = require('../app/controllers/CompanyController');
const middleWare = require('../app/middlewares/middle');
const userMiddleware = require('../app/middlewares/userMiddleware');


// router.delete('/device/:id',middleWare.checkLogin, CompanyController.removeDev);
router.put('/device/:id',middleWare.checkLogin, CompanyController.updateDev);
// router.post('/device', middleWare.checkLogin, CompanyController.addNewDev);
router.get('/home', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev,CompanyController.home);
router.get('/history', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, CompanyController.history);
router.get('/alarm', middleWare.checkLogin, userMiddleware.addMore,userMiddleware.chooseDev,CompanyController.alarm);
router.get('/export/history', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, CompanyController.exportHistory);
router.get('/export/alarm', middleWare.checkLogin,userMiddleware.addMore,userMiddleware.chooseDev, CompanyController.exportAlarm);
router.get('/device',middleWare.checkLogin, CompanyController.device);
router.get('/register', middleWare.checkLogin, CompanyController.register);
router.post('/register/save', middleWare.checkLogin, CompanyController.save);
router.get('/', middleWare.checkLogin,CompanyController.index);
module.exports = router;
