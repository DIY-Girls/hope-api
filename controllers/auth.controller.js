// const debug = require('debug')('auth')

const { ErrorHandler } = require('../helpers/error');

User = require('../model/users.model');

exports.login = async function(req, res, next) {
    // debug(req.body);
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            throw new ErrorHandler(404, 'User with the specified email does not exists');
        }

        if(req.body.password !== user.password) {
            // debug('Passwords did not match');
            throw new ErrorHandler(401, 'Credentials did not match, try again');
        }
        // debug('passwords matched');
        return res.status(200).json({
            status: 'successful',
            message: 'logged in',
            userId: user._id
        });
    } catch(error) {
        next(error);
    }
};

exports.logout = function(req, res) {
}