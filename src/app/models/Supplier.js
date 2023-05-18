const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Supplier = new Schema({
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
    default: 'supplier',
  },
  
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

module.exports = mongoose.model('Supplier', Supplier);


//QUERY MIDDLEWARE
// more in tour model - js
