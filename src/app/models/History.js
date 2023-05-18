const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySche = new Schema({
  
  behavior: String,
  time: { type: Date, default: Date.now()},
  user_name: String,
  deviceID:{
    type: mongoose.Schema.ObjectId,
    ref: 'Device',
    required: [true, 'Must belong a device']
  },
  userID:{
    type: mongoose.Schema.ObjectId,
    ref: 'Register',
  },
  
});

//MIDDLE WARE
HistorySche.pre(/^find/, function(next){
  this.populate({
    path:'deviceID',
  })
  next();
})


const History = mongoose.model('History', HistorySche);
module.exports = History;







