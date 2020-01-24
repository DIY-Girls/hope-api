User = require('./users.model');

exports.login = function(req, res) {
    console.log('authenticating...');
    console.log(req.body);
    User.findOne({email: req.body.email}, function(err, user) {
        if(err || !user) {
            res.status(403);
            res.json({
                status: 'error',
                message: 'Cannot access page!'
            });
        } else {
            res.json({
                status: 'success',
                message: 'Got to auth/login route :)',
            });
        }
    })
};

exports.logout = function(req, res) {

}