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


if(process.env.ENVIRONMENT === 'production') {
    // PRODUCTION DATABASE
    mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0-qxxtp.mongodb.net/test?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
} else {
    // DEVELOPMENT DATABASE
    mongoose.connect(`mongodb://localhost/27018`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

const db = mongoose.connection;

if(!db) {
    console.log('Error connecting db');
} else {
    console.log('Db connected successfully');
}

app.use('/api', apiRoutes);
app.use((err, req, res, next) => {
    handleError(err, res)
});

app.listen(port, function() {
    console.log('Port runnig on', port);
});