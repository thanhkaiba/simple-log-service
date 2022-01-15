const express = require('express');
const bodyParser = require('body-parser');
const logRoute = require('./routes/log_rotate');
const dotenv = require('dotenv');
dotenv.config()
const app = express();

// configure our express instance with some body-parser settings
// including handling JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this is where we'll handle our various routes from
logRoute(app);
app.listen(process.env.PORT, () => console.log('Game log service is listening on port 3000.'));


