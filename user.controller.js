User = require('./users.model');

// Handle index actions
exports.index = function(req, res) {
    User.get(function(err, users) {
        if(err) {
            res.json({
                status: 'error',
                message: err,
            });
        }
        res.json({
            status:'success',
            message: 'Users received successfully',
            data: users
        });
    });
};

// Handle create user actions
exports.create = function(req, res, next) {
    const user = new User();
    user.name = req.body.name ? req.body.name : user.name;
    user.gender = req.body.gender;
    user.email = req.body.email;
    user.phone = req.body.phone
    user.save(function(err) {
        res.json({
            message: 'new user created',
            data: user
        });
    });
};

// Handle view contact info
exports.view = function(req, res, next) {
    Contact.findById(req.params.contact_id, function(err, contact) {
        if(err) {
            res.send(err);
        }
        res.json({
            message: 'Contact details loading...',
            data: contact
        });
    });
};

// Handle update contact info
exports.update = function(req, res) {
    Contact.findById(req.params.contact_id, function(err, contact) {
        if(err) {
            res.send(err);
        }
        contact.name = req.body.name ? req.body.name : contact.name;
        contact.gender = req.body.gender;
        contact.phone = req.body.phone;

        contact.save(function(err) {
            if(err) {
                res.json(err);
            }
            res.json({
                message: 'Contact info updated',
                data: contact
            });
        });
    });
};

// Handle delete contact
exports.deleteUser = function(req, res) {
    User.remove({
        _id: req.params.user_id,
    }, function(err, user) {
        if(err) {
            res.send(err);
        }
        res.json({
            status: 'success',
            message: 'User deleted'
        });
    });
};