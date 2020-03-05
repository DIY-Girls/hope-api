// const debug = require('debug')('auth')
const bcrypt = require('bcrypt');

const { ErrorHandler } = require('../helpers/error');

User = require('../model/users.model');

exports.login = async function(req, res, next) {
    // debug(req.body);
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            throw new ErrorHandler(401, 'Email/password is incorrect.');
        }
        const { password } = req.body;
        const match = await bcrypt.compare(password, user.password);
        if(!match) {
            throw new ErrorHandler(401, 'Email/password is incorrect');
        }
        
        res.status(200).json({
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