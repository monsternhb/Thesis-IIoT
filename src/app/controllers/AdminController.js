const { multiMongooseToObject } = require('../../helpers/mongooseHelper');
const { mongooseToObject } = require('../../helpers/mongooseHelper');

const Company = require('../models/Company');
const Register = require('../models/Register');

class CompanController {
    // [GET] / admin
    index(req, res, next) {
      Company.find({})
      .then(acc => {
        res.render('admin', { acc: multiMongooseToObject(acc)});
      })
      .catch(next);
    }
    
    // [POST] /admin/save

    async save(req, res, next) {
      try{
        //get data register
        const userName = req.body.user_name;
        const passWord = req.body.pass_word;
        const confirm = req.body.confirm;
        let dev = await JSON.stringify(req.body.devices);
        dev = dev.replaceAll('"','').split(';');
  
        //validate
        if (confirm !== passWord) throw new Error('Wrong confirm password'); 
        if (!userName || !passWord) throw new Error('May be you miss user name or pass word');     
        
        // check DB
        const acc = await Company.find({ user_name: userName });
        // const hasRegistered = acc[0]._doc; 
        // console.log(hasRegistered);
        console.log(acc);
        if(acc.length !== 0)  throw new Error('User name has been used');
        
        //save account to DB
        // const newAcc = new Register(req.body);
        // await newAcc.save();
  
        const newAcc = new Company( {user_name: req.body.user_name, pass: req.body.pass_word, name: req.body.name, devices: dev });
        newAcc.save();

        const newRes = new Register( {user_name: req.body.user_name, pass: req.body.pass_word, role:'manager', name: req.body.name, devices: dev });
        newRes.save();
        
        res.redirect('/admin');
        console.log('save company to DB successful');
        
      }catch(err){
        console.log(err.message);
        res.json(err.message);
      }
    }

    // [GET] /admin/home
    home(req,res,next){
      res.render('admin_home');
    }

    // [GET] /admin/history
    history(req,res,next){
      res.render('admin_history');
    }

    // [GET] /admin/register
    register(req,res,next){
      res.render('admin_register');
    }



  
  }
  
  module.exports = new AdminController();