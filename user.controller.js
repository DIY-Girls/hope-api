const bcrypt = require('bcrypt');
const User = require('./users.model');

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
exports.create = async function(req, res) {
    let user = await User.findOne({ email: req.body.email });

    if(user) {
        return res.status(400).send('User already exists');
    } else {
        user = new User();
        user.name = req.body.name ? req.body.name : user.name;
        user.gender = req.body.gender;
        user.email = req.body.email;
        user.phone = req.body.phone;
        
        // Hashing password
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(req.body.password, salt);
        user.password = req.body.password;
        user.emergencyContacts = [];
        user.save(function(err) {
            res.json({
                message: 'new user created',
                data: user
            });
        });
    }
};

// Handle view contact info
exports.view = function(req, res, next) {
    User.findById(req.params.user_id, function(err, user) {
        if(err) {
            res.send(err);
        }
        res.json({
            message: 'Contact details loading...',
            data: user
        });
    });
};

// Handle update contact info
exports.update = function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
        if(err) {
            res.send(err);
        }

        user.name = req.body.name ? req.body.name : user.name;
        user.gender = req.body.gender;
        user.phone = req.body.phone;
        user.password = user.password;
        for(let i = 0; i < req.body.emergencyContacts.length; i++) {
            user.emergency_contacts.push(req.body.emergencyContacts[i]);
        }
        user.save(function(err) {
            if(err) {
                res.json(err);
            }
            res.json({
                message: 'Contact info updated',
                data: user
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