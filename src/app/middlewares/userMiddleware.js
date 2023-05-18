const jwt = require('jsonwebtoken');
const Register = require('../models/Register');
const Device = require('../models/Device');
const { mongooseToObject } = require('../../helpers/mongooseHelper');



class UserMiddleware {
  // middleware detail user
  addMore(req, res, next) {
    // 1. fix admin allocate dev/ update
    if(req.session.idDev){
      if (!req.query.idDev)
      req.query.idDev = req.session.idDev;
    }
    next();
  }  

  //choose device [req.query.ipDev] 
  async chooseDev(req,res,next){
    try{
      // assign id of device from sesion 
      if (!req.session.idDev) req.session.idDev = req.query.idDev;
      if(req.query.idDev != req.session.idDev) req.session.idDev = req.query.idDev;
      
      const devId = req.session.idDev; 
     //go to database to get document of this device
     const dev = await Device.findById(devId);
     const devIpAdd = mongooseToObject(dev);
      //get ip address of this device and then save to session
    if (!req.session.ipDev) req.session.ipDev = devIpAdd;
    if(devIpAdd != req.session.ipDev) req.session.ipDev = devIpAdd;

    //save query ip_address
    req.query.in4DevOject = req.session.ipDev;
    req.query.devIp = req.query.in4DevOject.ip_add;
    req.query.devId = req.query.in4DevOject.id;
    next();
    }
    catch(err){
      next();  
    }
  }
}
module.exports = new UserMiddleware();
