const bcrypt = require('bcrypt');
const User = require('../model/users.model');

const { ErrorHandler } = require('../helpers/error');

// Handle index actions
exports.index = function(req, res) {
    User.get(function(err, users) {
        if(err) {
            throw new ErrorHandler(400, 'Could not find users');
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
        throw new ErrorHandler(400, 'User already exists');
    } else {
        user = new User();
        user.name = req.body.name ? req.body.name : user.name;
        user.gender = req.body.gender;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.password = req.body.password;
        user.emergencyContacts = [];

        user.save(function(err) {
            if(err) {
                res.json({
                    status: 'error',
                    message: err,
                })
            }
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

exports.update = function(req, res) {
    User.findById(req.params.user_id, async function(err, user) {
        if(err) {
            res.send(err);
        }
        if(user.email !== req.body.email){
            const valid = await validateEmail(req.body.email);
            if(valid) {
                user.email = req.body.email;
            } else {
                console.log('Email alreayd in use');
            }
        }
        user.name = req.body.name ? req.body.name : user.name;
        user.gender = req.body.gender;
        user.phone = req.body.phone;
        user.password = user.password;

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

exports.addContact = async function(req, res) {
    console.log(req.body);
    let exists = false;
    const user_id = req.body.user_id;
    const newContact = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    };
    const user = await User.findById(user_id);
    let contacts = user.emergency_contacts;
    contacts.forEach(element => {
        if(element.email === newContact.email) {
            exists = true;
        }
    });
    if (exists) {
        throw new ErrorHandler(404, 'Contact with that email already exists');
    } else {
        user.emergency_contacts.push(newContact);
        user.save(function (err) {
            if(err) {
                res.send(err);
            }
            res.json({
                emergencyContacts: user.emergency_contacts, 
                status: 'success',
                message: 'Contact added!'
            })
        });
    }
};

exports.deleteContact = async function(req, res) {
    console.log(req.body);
    const user_id = req.body.user_id;
    const email = req.body.email;
    const user = await User.findById(user_id);
    const contacts = user.emergency_contacts.filter(element => element.email !== email);
    user.emergency_contacts = contacts;
    user.save(function (err) {
        if(err) {
            res.send(err);
        }
        res.json({
            emergencyContacts: user.emergency_contacts,
            status: 'success',
            message: 'Contact deleted'
        });
    });

};

async function validateEmail(email) {
    const user = await User.findOne({email});
    if(user) {
        return false;
    }
    return true;
}