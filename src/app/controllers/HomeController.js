const { multiMongooseToObject, mongooseToObject } = require('../../helpers/mongooseHelper');
const Register = require('../models/Register');
const jwt = require('jsonwebtoken');
const History = require('../models/History');
const Device = require('../models/Device');


class HomeController {
  // [GET] /home (viewer)

  // [GET] /home/device (has param "idDev")
  async device(req,res,next){
    // assign id of device from sesion 
    if (!req.session.idDev) req.session.idDev = req.query.idDev;
    if(req.query.idDev != req.session.idDev) req.session.idDev = req.query.idDev;

    //get information of user from req
    const role = req.data._doc.role;
    // const devId = req.session.idDev; 
    const userId = req.user;
    const userName = req.userName;
    
    //go to database to get document of this device
    const dev = await Device.findById(devId);
    const devIpAdd = mongooseToObject(dev);

    //get ip address of this device and then save to session
    if (!req.session.ipDev) req.session.ipDev = devIpAdd;
    if(devIpAdd != req.session.ipDev) req.session.ipDev = devIpAdd;

    const devIp = req.session.ipDev;

    //render home page
    res.render('home',{role, devId, userId, userName, devIp});
  }


  //[GET] /home/logout
  logout(req, res, next) {
    req.session.destroy((err) => {
      res.redirect('/') // will always fire after session is destroyed
    })
  }


}

module.exports = new HomeController();
