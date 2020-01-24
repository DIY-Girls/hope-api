User = require('./users.model');

exports.login = function(req, res) {
    console.log('authenticating...');
    console.log(req.body);
    User.findOne({email: req.body.email}, function(err, user) {
        if(err || !user) {
            res.status(403);
            return res.json({
                status: 'error',
                message: 'Cannot access page!'
            });
        }
        if(req.body.password !== user.password){
            // console.log('passwords did not match')
            res.status(403);
            return res.json({
                status: 'error',
                message: 'Passwords did not match ',
            });
        }

        return res.json({
            status: 'success',
            message: 'Logged in'
        })
    })
};

exports.logout = function(req, res) {

}