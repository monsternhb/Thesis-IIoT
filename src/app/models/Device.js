const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Device = new Schema({
  name: { type: String, required: [true, 'A Device must have a name']},
  time: { type: Date, default: Date.now(), select: false },
  
  ip_add: {type: String, required: [true, 'A Device must have its device ip address'], trim: true,},

  series_number: {type: String, required: [true, 'A Device must have its Series number'], trim: true,},

  companyID:{
        type: mongoose.Schema.ObjectId,
        ref: 'Company'
  },

  supplierID:{
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier'
  },
  unitID:{
    type: mongoose.Schema.ObjectId,
    ref: 'Unit'
  },

  // deviceID:{
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Device',
  //   required: [true, 'Must belong a device']
  // },

  userID:[{
    type: mongoose.Schema.ObjectId,
    ref: 'Register',
  }],


  // histories - alarms
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  });
  
  //QUERY MIDDLEWARE
  Device.pre(/^find/, function(next){
    this.populate({
      path:'companyID',
      select: 'name'
    }).populate({
      path:'unitID',
      select: 'name'
    })
    next();
  })
module.exports = mongoose.model('Device', Device);

// Virtual populate --- when have 1 device - not all
// get all history of the device
Device.virtual('histories',{
  ref:'History',
  foreignField: 'device',
  localField: '_id'
})

Device.virtual('alarms',{
  ref:'Alarm',
  foreignField: 'device',
  localField: '_id'
})

// go to controller "find by iD. populate('alarms')"
