const express = require('express');
const HomeRouter = require('./router/HomeRouter');
const bodyParser = require('body-parser');
const app = express();
// const cors = require('cors');
const {clearOldImageStorage} = require('./util')
const port = 5000;

// Schedule the clearOldImageStorage function to run every 5 minutes
setInterval(clearOldImageStorage, 5 * 60 * 1000);

// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Allow specified headers
    next();
  });
  
app.use('/v', HomeRouter);

app.listen(port, () => {

    console.log(`Server is listening at http://localhost:${port}`);
});
