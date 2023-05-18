const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Unit = new Schema({
  name: {
    type: String,
    trim: true,
  },
  user_name: {
      type: String,
      required: [true, 'Must have a user name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A user name must have less or equal then 40 characters'],
      minlength: [3, 'A user name must have more or equal then 3 characters']
  },

  pass: {
      type: String,
      required: [true, 'Must have a password'],
      trim: true,
      maxlength: [40, 'A pass must have less or equal then 40 characters'],
      minlength: [3, 'A pass name must have more or equal then 3 characters']
  },

  email: {
    type: String,
    trim: true,
  },

  role: {
    type: String,
    default: 'admin',
  },

  companyID:{
      type: mongoose.Schema.ObjectId,
      ref: 'Company'
    },

  unitID:{
      type: mongoose.Schema.ObjectId,
      ref: 'Unit'
    },

  devicesID:[{
      type: mongoose.Schema.ObjectId,
      ref: 'Device'
  }],
  
  // devices: {
  //   type: Array,
  //   trim: true,
  // },

  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  }

);

//QUERY MIDDLEWARE
Unit.pre(/^find/, function(next){
  this.populate({
    path:'companyID',
    select: 'name'
  }).populate({
    path:'unitID',
    select: 'name'
  })
  next();
})

module.exports = mongoose.model('Unit', Unit);


