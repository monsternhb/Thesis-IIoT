const mongoose = require('mongoose');

const connect = async function () {
  try {
    // connect to database
    await mongoose.connect('mongodb+srv://nguyenhoangbao:Bao123456@datn-nhb.89z57im.mongodb.net/?retryWrites=true&w=majority');
    console.log('connect DB successful');
  } catch (err) {
    console.log('error when connect DB');
  }
};

module.exports = { connect };
