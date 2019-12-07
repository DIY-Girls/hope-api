// const debug = require('debug')('app')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const apiRoutes = require('./api.routes');

const port = process.env.PORT || 8080;

mongoose.connect('mongodb://localhost/hosthub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

if(!db) {
    // debug('Error connecting db');
    console.log('Error connecting db')
} else {
    // debug('Db connected successfully');
    console.log('Db connected successfully')
}

app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', apiRoutes);

app.listen(port, function() {
    console.log('Port runnig on', port);
});