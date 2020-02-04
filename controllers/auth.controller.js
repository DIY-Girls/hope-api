const debug = require('debug')('auth')

User = require('../model/users.model');

exports.login = async function(req, res) {
    debug('authenticating...');
    debug(req.body);
    try {
        const user = await User.findOne({email: req.body.password});
        if(!user) {
            throw Error('Email is not on our system.');
        }
        if(req.body.password !== user.password) {
            debug('Passwords did not match');
            throw Error('Credentials did not match');
        }
        debug('passwords matched');
        return res.json({
            status: 'success',
            message: 'Logged in'
        });
    } catch(error) {
        debug('An error occurred:', error);
        return res.json({
            status: 'error',
            message: error
        })
    }
};

exports.logout = function(req, res) {

}