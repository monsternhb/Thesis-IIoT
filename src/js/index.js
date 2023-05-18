const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const hbs = require('express-handlebars');
const morgan = require('morgan');
const port = 3000;
const methodOverride = require('method-override');
// set static folder when they try to look up
const publicPath = path.join(__dirname, '../assets'); 
const route = require('../routes');
const cookieParser = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const mqtt = require('mqtt');
const bodyParser = require('body-parser');
const paginate = require('handlebars-paginate');
var Handlebars = require('handlebars');

// log file configure

app.use(express.static(publicPath));
app.use(methodOverride('_method'));
// connect to db
const db = require('../config/db');
db.connect();
// Add middleware
app.use(express.urlencoded({ extended: true }));

//handle js post
app.use(express.json());

// HTTP logger
app.use(morgan('combined'));

app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
// Cookie
app.use(cookieParser());

// Template engine

app.engine(
  'hbs',
  hbs.engine({
    extname: '.hbs',

    helpers: {
      formatDate(time) {
        let newTime = String(time);
        let index = newTime.indexOf('G');
        return newTime.slice(0, index);
      },

      foo() {
        return 'Foo';
      },
    },
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));
Handlebars.registerHelper('paginate', paginate);
//use for paginates
Handlebars.registerHelper('times', function(n, block) {
  var accum = '';
  for(var i = 1; i <= n; ++i)
      accum += block.fn(i);
  return accum;
});

Handlebars.registerHelper('ifCond', function(role, options) {
  if(role === 'supplier' || role === 'company'  || role === 'admin') {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper('ifIp', function(devIp, options) {
  if(devIp === '192.168.0.4') {
    return options.fn(this);
  }
  return options.inverse(this);
});

// console.log("a", path.join(__dirname, "../assets/css/base.css"));

// route init
route(app);

//mqtt connection
const options = {
  username: 'iot20502050',
  password: 'iot20502050',
  rejectUnauthorized: false
};

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

// const host = 'broker.mqttdashboard.com';
// const portMqtt = '1883';

// const connectUrl = `mqtt://${host}:${portMqtt}`;

// const client = mqtt.connect(connectUrl, {
//   clientId,
//   clean: true,
//   connectTimeout: 4000,
//   reconnectPeriod: 1000,
// });

const client = mqtt.connect('tls://b6fc4b8c86e644c7bc37d4d71d8ce8e1.s1.eu.hivemq.cloud:8883', options);

// socket connection
io.on('connection', socket => {
  console.log('user connected');

  // receive msg control plc from client
  socket.on('control plc', msg => {
    // pulish msg to mqtt topic = controlplc
    client.publish('controlplc', msg, { qos: 0, retain: false }, error => {
      if (error) {
        console.error(error);
      }
    });
    console.log('Click ' + msg + ' from Web client');
  });

  // receive msg control plc from client
  socket.on('control plcw2040', msg => {
    // pulish msg to mqtt topic = controlplc
    client.publish('controlplcw2040', msg, { qos: 0, retain: false }, error => {
      if (error) {
        console.error(error);
      }
    });
    console.log('Click ' + msg + ' from Web client');
  });

  // receive msg total product from client
  socket.on('total each product', msg => {
    //pulish msg to mqtt topic = totalX
    client.publish(
      msg.publicName,
      msg.publicValue,
      { qos: 0, retain: false },
      error => {
        if (error) {
          console.error(error);
        }
      }
    );
    console.log(msg.publicName, msg.publicValue);
  });

  // receive msg alarm full product from client
  socket.on('alarm_full-sp1', msg => {
    // pulish msg to mqtt topic = controlplc
    client.publish('alarm_full-sp1', msg, { qos: 0, retain: false }, error => {
      if (error) {
        console.error(error);
      }
    });
    console.log('Product 1 is full!');
  });

  // receive msg alarm full product from client
  socket.on('alarm_full-sp2', msg => {
    // pulish msg to mqtt topic = controlplc
    client.publish('alarm_full-sp2', msg, { qos: 0, retain: false }, error => {
      if (error) {
        console.error(error);
      }
    });
    console.log('Product 2 is full!');
  });

  // receive msg alarm full product from client
  socket.on('alarm_full-sp3', msg => {
    // pulish msg to mqtt topic = controlplc
    client.publish('alarm_full-sp3', msg, { qos: 0, retain: false }, error => {
      if (error) {
        console.error(error);
      }
    });
    console.log('Product 3 is full!');
  });

   // receive msg sensor from client
   socket.on('sensor', msg => {
    //pulish msg to mqtt topic humid; temp
    client.publish(
      msg.publicName,
      msg.publicValue,
      { qos: 0, retain: false },
      error => {
        if (error) {
          console.error(error);
        }
      }
    );
    console.log(msg.publicName, msg.publicValue);
  });

});

client.on('connect', () => {
  console.log('Mqtt Connected');
});

// subcribe topic followplc
const topicSub = ['color', 'alarm_no-sp','alarm_undef_color','alarm_wait_reset','light1','light2','light3','light4','light5','light6','light7','light8','man','auto', 'run','color_of_type1', 'color_of_type2','color_of_type3','currentSp1','currentTemp','currentHumid', 'currentSp2', 'currentSp3','type1','type2','type3','H1_min','H1_max','S1_min','S1_max','V1_min','V1_max','H2_min','H2_max','S2_min','S2_max','V2_min','V2_max','H3_min','H3_max','S3_min','S3_max','V3_min','V3_max'];
topicSub.forEach(topic => {
  client.subscribe(topic, () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});

// receive msg from topic follow plc
client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString());
  const topicSever = topic;
  const msg = payload.toString();
  // send to client
  io.emit(topicSever, msg);
});





//pre file number of product 
const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('View total products');
worksheet.columns = [
  { header: 'Current product 1', key: 'cur1', width: 20 },
  { header: 'Setting product 1', key: 'set1', width: 20 },
  { header: 'Current product 2', key: 'cur2', width: 20 },
  { header: 'Setting product 2', key: 'set2', width: 20 },
  { header: 'Current product 3', key: 'cur3', width: 20 },
  { header: 'Setting product 3', key: 'set3', width: 20 },
  { header: 'Time', key: 'time', width: 20 },

];

workbook.xlsx.writeFile('Number_Product.xlsx')
      .then(function() {
        console.log('File number product written successfully!');
});




server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
