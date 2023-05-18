const { multiMongooseToObject } = require('../../helpers/mongooseHelper');

const Alarm = require('../models/Alarm');

class AlarmController {
  // [GET] / alarm
  index(req, res) {
    res.render("alarm");
  }

  async createAlarm(req, res, next) {
    try{

      // put req.body.numproduct in here
      
     //alow nested routes 
     if(!req.body.deviceID) req.body.deviceID = req.params.deviceId;
     //from middleware
     if(!req.body.userID) req.body.userID = req.params.userID;

     if(!req.body.user_name) req.body.user_name = req.params.userName;
  
     const newAlarm = new Alarm(req.body);
     newAlarm.save();
    } catch (err){
      res.send(err.message);
    }
  }


}

module.exports = new AlarmController();
