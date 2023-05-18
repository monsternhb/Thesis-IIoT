const express = require('express');
const router = express.Router();

// import function
const historyController = require('../app/controllers/HistoryController');
const middleWare = require('../app/middlewares/middle');


// save history when click button control
router.post('/device/:deviceId?/:userName?/:userId?',middleWare.checkLogin,historyController.createHistory);
router.post('/product/:deviceId?/:userName?/:userId?',middleWare.checkLogin,historyController.writeProduct);
router.get('export/product',middleWare.checkLogin,historyController.exportProduct);

//get all history of selected device
// router.get('/device/:deviceId/',middleWare.checkLogin,historyController.getAllHistory);
// router.get('/device/:deviceId/:hisId',middleWare.checkLogin, historyController.getHistorybyId);
// router.post('/store',historyController.store);
// router.get('/:page?',middleWare.checkLogin, historyController.index);


// POST /device/de-id/histories
// luu history
// GET /device/de-id/histories
// lay all history of 1 dev
// GET /device/de-id/histories/his-id
// filter history
module.exports = router;
