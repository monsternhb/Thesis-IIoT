const { multiMongooseToObject } = require('../../helpers/mongooseHelper');
const { listenerCount } = require('../models/History');
const History = require('../models/History');

const XLSX = require('xlsx');
const ExcelJS = require('exceljs');
const fs = require('fs');
const csv = require('csv-parse');
const {stringify} = require('csv-stringify');

class HistoryController {
  

  // [POST] /device/:deviceId?/:userName?/:userId?
  async createHistory(req, res, next) {
    try{
     //alow nested routes 
     if(!req.body.deviceID) req.body.deviceID = req.params.deviceId;
     //from middleware
     if(!req.body.userID) req.body.userID = req.params.userID;

     if(!req.body.user_name) req.body.user_name = req.params.userName;
  
     const newHis = new History(req.body);
     newHis.save();
    } catch (err){
      res.send(err.message);
    }
  }

  // [POST] /product/:deviceId?/:userName?/:userId?
  async writeProduct(req,res,next){
    try{
      let cur1 = req.body.currentPro[0];
      let cur2 = req.body.currentPro[1];
      let cur3 = req.body.currentPro[2];
      let set1 = req.body.setPro[0];
      let set2 = req.body.setPro[1];
      let set3 = req.body.setPro[2];
      let time = new Date().toISOString().slice(0, -5);

      
      
      // const worksheet = workbook.Sheets['View total products'];
      // const newRowData = [ cur1, set1, cur2,set2,cur3, set3,time];
      // const range = XLSX.utils.decode_range(worksheet['!ref']);
      // range.e.r++;
      // for (let i = range.s.c; i <= range.e.c; i++) {
      //   const cellAddress = XLSX.utils.encode_cell({ r: range.e.r, c: i });
      //   worksheet[cellAddress] = { t: 's', v: newRowData[i - range.s.c] };
      // }
      // await XLSX.writeFile(workbook, 'Number_Product.xlsx');

      // console.log(workbook,time);

      // fs.readFile('exports products/Number_Product.csv', 'utf-8', (err, data) => {
      //   if (err) throw err;
      //   parse(data, (err, rows) => {
      //     if (err) throw err;
      //     const newRowData = [ cur1, set1, cur2,set2,cur3, set3,time];
      //     rows.push(newRowData);
      //     stringify(rows, (err, csvString) => {
      //       if (err) throw err;
          
      //       fs.writeFile('exports products/Number_Product.csv', csvString, (err) => {
      //         if (err) throw err;
      //       });
      //     });
      //   });
      //   // Continue with the code here
      // });

  //     fs.createReadStream('exports products/Number_Product.csv')
  // .pipe(csv())
  // .on('data', function (row) {
  //   const username = generateUsername(row.Firstname, row.Surname);
  //   const password = randomWords(3).join("-");
    
  //   const user = {
  //       username,
  //       firstname: row.Firstname,
  //       surname: row.Surname,
  //       roles: row.Roles,
  //       password
  //   }
  //   users.push(user)
  // })
  // .on('end', function () {
  //     console.table(users)
  //     // TODO: SAVE users data to another file
  //   })




      //add new row to excited excel file
      console.log('update data number product successfully in csv');
    }
    catch(err){
      console.log(err);
    }
    


  }

  exportProduct(req,res,next){
    

  }


  // [GET] /device/:deviceId
  async getAllHistory(req, res, next){
    try{
      

    }catch (err){
      res.send(err.message);
    }
  };
  getHistorybyId(req, res, next){};
}

module.exports = new HistoryController();
// https://expressjs.com/en/4x/api.html#res.json
