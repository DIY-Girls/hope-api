// const debug = require('debug')('app')
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { handleError } = require('./helpers/error');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const apiRoutes = require('./api.routes');

const port = process.env.PORT || 8080;

// PRODUCTION
// mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0-qxxtp.mongodb.net/test?retryWrites=true&w=majority`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });


// DEVELOPMENT
mongoose.connect(`mongodb://localhost/27018`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

if(!db) {
    // debug('Error connecting db');
    console.log('Error connecting db');
} else {
    // debug('Db connected successfully');
    console.log('Db connected successfully');
}

app.use('/api', apiRoutes);
app.use((err, req, res, next) => {
    handleError(err, res)
});

app.listen(port, function() {
    console.log('Port runnig on', port);
});