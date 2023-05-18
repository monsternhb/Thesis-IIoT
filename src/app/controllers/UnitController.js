const { multiMongooseToObject } = require('../../helpers/mongooseHelper');
const { mongooseToObject } = require('../../helpers/mongooseHelper');

const Company = require('../models/Company');
const Unit = require('../models/Unit');
const Register = require('../models/Register');
const History = require('../models/History');
const Alarm = require('../models/Alarm');

const Device = require('../models/Device');
const { Namespace } = require('socket.io');


class UnitController {

  // [GET] /company
  index(req, res, next) {
  }
  
  // [GET] /admin/home
  async home(req,res,next){
      try{       
        //get unit id
        const unitId = req.userId;
        
        const role =req.role;
        const queryObj ={...req.query};
        const excludeFields =['page','sort','limit','fields'];
        excludeFields.forEach(el => delete queryObj[el]);
        
        //edit findById
        let query = Device.find({unitID: unitId});
  
        //SORTING
          query = query.sort({ time: 'desc' });
        //PAGINATION
        
        // const page = req.query.page*1 || 1;
        // const perPage = 8;
        // const skip = (page -1)*perPage;
        // let numPage = 1;
        // if(page){
        //   numPage = await Device.count({query});
        //   if (skip >= numPage ) throw new Error ('This page does not exist');
        // }
        // numPage = Math.ceil(numPage/perPage);
  
        // query = query.skip(skip).limit(perPage);
  
  
        //EXCUTE QUERY
        const devices = await query;
  
        // let pagination ={ page, numPage, perPage};

        // get data of managers
        const managers = await Register.find({unitID: unitId});
        
        // alert current device
        const devIp = req.query.ipDev;
    
        //RENDER 
        res.render('unit_home', { devices: multiMongooseToObject(devices), managers: multiMongooseToObject(managers), role, devIp });
      }catch(err){
        res.send(err.message);
      }
  }
  
  // [GET] /admin/device
  async device(req, res, next) {
    try{
      const role =req.role;
      const unitId = req.userId;
      //get information of device 
      let objDev = [];
      const data = await Device.find({unitID: unitId});  
      if (data.length != 0) {
          data.forEach((dev, index) =>{
            objDev[index] = {};
            objDev[index].name = dev.name;
            objDev[index].id = dev.id;
            objDev[index].ip = dev.ip_add;     
          })
        };
      res.render('device', { role, objDev });
    }
    catch(err){
      res.send(err.message);
    }
  }


  // [GET] /admin/history
  async history(req,res,next){
    const role =req.role;
    const devIp = req.query.devIp;
    const devId = req.query.devId;
    const { start, end } = req.query;
    let startDate = start ? new Date(start): new Date("2023-01-01") ;
    let endDate = end ? new Date(end) : new Date("2026-01-01");
  
    //query option
    const queryObj ={ deviceID: devId, time : {
      $gte: startDate,
      $lte: endDate
    }};
      //const excludeFields =['page','sort','limit','fields'];
      // excludeFields.forEach(el => delete queryObj[el]);

      let query =  History.find(queryObj);

      //SORTING
       query = query.sort({ time: 'desc' });

      //PAGINATION
      const page = req.query.page*1 || 1;
      const perPage = 8;
      const skip = (page -1)*perPage;
      let numPage = 1;
      if(page){
        numPage = await History.where(queryObj).countDocuments();
        // if (skip >= numPage ) throw new Error ('This page does not exist');
      }
      numPage = Math.ceil(Number(numPage/perPage));
      query = query.skip(skip).limit(perPage);

      //EXCUTE QUERY
      const histories = await query;
      let pagination = { page, numPage, perPage};
      startDate = startDate.toISOString().split('T')[0];
      endDate = endDate.toISOString().split('T')[0];

      //RENDER 
      res.render('history', { histories: multiMongooseToObject(histories) , devId, pagination: pagination , devIp,role, startDate,endDate});
  }

  // [GET] /admin/alarm
  async alarm(req,res,next){
    try{
    const role =req.role;
    const devIp = req.query.devIp;
    const devId = req.query.devId;
    const { start, end } = req.query;
    let startDate = start ? new Date(start): new Date("2023-01-01") ;
    let endDate = end ? new Date(end) : new Date("2026-01-01");
  
    //query option
    const queryObj ={ deviceID: devId, time : {
      $gte: startDate,
      $lte: endDate
    }};
      //const excludeFields =['page','sort','limit','fields'];
      // excludeFields.forEach(el => delete queryObj[el]);

      let query =  Alarm.find(queryObj);

      //SORTING
       query = query.sort({ time: 'desc' });

      //PAGINATION
      const page = req.query.page*1 || 1;
      const perPage = 8;
      const skip = (page -1)*perPage;
      let numPage = 1;
      if(page){
        numPage = await Alarm.where(queryObj).countDocuments();
        // if (skip >= numPage ) throw new Error ('This page does not exist');
      }
      numPage = Math.ceil(Number(numPage/perPage));
      query = query.skip(skip).limit(perPage);

      //EXCUTE QUERY
      const alarms = await query;
      let pagination = { page, numPage, perPage};
      startDate = startDate.toISOString().split('T')[0];
      endDate = endDate.toISOString().split('T')[0];
      //RENDER 
      res.render('alarm', { alarms: multiMongooseToObject(alarms) , devId, pagination: pagination ,startDate, endDate, devIp,role});
    }
    catch(err){
      res.send(err.message);
    }
  }

  // [GET] /admin/export/history
  async exportHistory(req,res,next){
    try{
    const role =req.role;
    const devIp = req.query.devIp;
    const devId = req.query.devId;
    const { start, end } = req.query;
    let startDate = start ? new Date(start): new Date("2023-01-01") ;
    let endDate = end ? new Date(end) : new Date("2026-01-01");
    let csv;

    //query option
    const queryObj ={ deviceID: devId, time : {
      $gte: startDate,
      $lte: endDate
    }};
      let query =  History.find(queryObj, function(err, histories){
        if (err) {
          return res.status(500).json({ err });
        }
        else {
          try {
            csv = json2csv(histories, ({fields: fieldsHis }));
          } catch (err) {
            return res.status(500).json({ err });
          }
          const dateTime = moment().format('YYYYMMDDhhmmss');
          const filePath = path.join(__dirname, "../../..",  "exports history",   devIp +'-' + dateTime + ".csv")
          
          fs.writeFile(filePath, csv, function (err) {
            if (err) {
              return res.json(err).status(500);
            }
            else {
              setTimeout(function () {
                fs.unlinkSync(filePath); // delete this file after 300 seconds
              }, 300000)
              return res.redirect('admin/history');;
            }
          });

        }
      });

  }catch(err){
    console.log(err.message);
    res.json(err.message);
  }  
}

  // [GET] /admin/export/alarm
  async exportAlarm(req,res,next){
    try{
    const role =req.role;
    const devIp = req.query.devIp;
    const devId = req.query.devId;
    const { start, end } = req.query;
    let startDate = start ? new Date(start): new Date("2023-01-01") ;
    let endDate = end ? new Date(end) : new Date("2026-01-01");
    let csv;

    //query option
    const queryObj ={ deviceID: devId, time : {
      $gte: startDate,
      $lte: endDate
    }};
      let query =  Alarm.find(queryObj, function(err, alarms){
        if (err) {
          return res.status(500).json({ err });
        }
        else {
          try {
            csv = json2csv(alarms, ({fields: fieldsAlam }));
          } catch (err) {
            return res.status(500).json({ err });
          }
          const dateTime = moment().format('YYYYMMDDhhmmss');
          const filePath = path.join(__dirname, "../../..",  "exports alarm",  devIp +'-' + dateTime + ".csv");
          fs.writeFile(filePath, csv, function (err) {
            if (err) {
              return res.json(err).status(500);
            }
            else {
              setTimeout(function () {
                fs.unlinkSync(filePath); // delete this file after 300 seconds
              }, 300000)
              return res.redirect('admin/alarm');;
            }
          });

        }
      });

  }catch(err){
    console.log(err.message);
    res.json(err.message);
  }  
}

  // [GET] /admin/register
  register(req,res,next){
    const role = req.role;
    const devIp = req.session.ipDev;
    //should add find by ID company
    //from middleware
    if(!req.unitID) req.unitID = req.userId;
    Register.find({unitID: req.unitID})
      .then(registers => {
        res.render('unit_register', { registers: multiMongooseToObject(registers), role,devIp});
      })
  }

  // [POST] /admin/register/save
  async save(req,res,next){
    try{
      const role = req.role;
      //get data register
      const userName = req.body.user_name;
      const passWord = req.body.pass;
      const confirm = req.body.confirm;

      //from middleware
      if(!req.body.name) req.body.name = req.name;
      //from middleware
      if(!req.body.unitID) req.body.unitID = req.userId;
      //get companyId
      if(!req.body.companyID) req.body.companyID = req.companyID;
      

      //validate
      if (confirm !== passWord) throw new Error('Wrong confirm password'); 
      if (!userName || !passWord) throw new Error('May be you miss user name or pass word');     

      // check DB
      const acc = await Register.find({ user_name: userName });
      if(acc.length !== 0)  throw new Error('User name has been used');
      // save acc of company
      const newAcc = await Register.create(req.body);
      
      res.redirect('/admin/register');
      console.log(`save account of new user in ${req.name}to DB successful`);
      
    }catch(err){
      console.log(err.message);
      res.json(err.message);
    }
  }


  // [PUT] /admin/device/:id
  async updateDev(req,res,next){
    try{
      const idDev = req.params.id;
      await Device.findByIdAndUpdate({_id:idDev}, req.body );
      console.log('update a device success');
      res.redirect('/admin/home');
    }catch(err){
      console.log(err.message);
      res.json(err.message);
    }
  }
  
}
module.exports = new UnitController();