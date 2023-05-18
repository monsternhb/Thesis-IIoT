const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const Unit = require('../models/Unit');
const Register = require('../models/Register');
const Supplier = require('../models/Supplier');

class Middleware {
  // middleware checkLogin
  async checkLogin(req, res, next) {
    try {
      // get token from cookies
      let token = req.cookies.token;
      // decode token
      const decodeToken = await jwt.verify(token, 'pass');
      // check acc
      let accArr = 0;
      accArr = await Register.findOne({ _id: decodeToken._id });

      if (!accArr) accArr = await Supplier.findOne({ _id: decodeToken._id });
      if (!accArr) accArr = await Company.findOne({ _id: decodeToken._id });
      if (!accArr) accArr = await Unit.findOne({ _id: decodeToken._id });
      
      
      // login again
      if (accArr.length === 0) return res.redirect('/');

      // authorization
      const role = String(accArr.role);
      if (!role) return res.redirect('/');

      req.data = accArr;

      //user id
      req.userId = req.data.id;

      //user name 
      req.userName = req.data.user_name;

      //user role
      req.role = role;

      // list devices []
      req.devices = req.data.devices;
      
      // user name
      req.name = req.data.name;

      // [special] companyId
      if (role ==='admin') req.companyID = req.data.companyID.id;
      if (role ==='manager' || role ==='operator' || role ==='viewer') 
        {
          req.unitID = req.data.unitID.id;
          req.companyID = req.data.companyID.id;
        }
      
      next();
    } catch (err) {
      res.json(err.message);
    }
  }

  checkViewer(req, res, next) {
    const role = req.data._doc.role;
    if (role === 'viewer' || role === 'operator' || role === 'manager' || role === 'admin') {
      req.data = req.data;
      next();
    } else {
      res.json('NOT PERMISSION!!!');
    }
  }

  checkOperator(req, res, next) {
    const role = req.data._doc.role;
    if (role === 'operator' || role === 'manager' || role === 'admin') next();
    else {
      res.json('NOT PERMISSION!!!');
    }
  }

  checkManager(req, res, next) {
    const role = req.data._doc.role;
    if (role === 'manager'|| role === 'admin') {
      req.data = req.data;
      next();
    }
    else {
      res.json('NOT PERMISSION!!!');
    }
  }

  checkAdmin(req, res, next) {
    const role = req.data._doc.role;
    if (role === 'admin') next();
    else {
      res.json('NOT PERMISSION!!!');
    }
  }
}
module.exports = new Middleware();
