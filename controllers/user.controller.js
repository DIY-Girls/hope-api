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
exports.create = async function(req, res, next) {
    try {
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

            const err = await user.save();
            console.log(err);
            if(!err) {
                throw new ErrorHandler(500, 'Something went wrong');
            }
            res.json({
                message: 'new user created',
                data: user
            });
                
        }
    } catch (error) {
        next(error);
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

exports.update = async function(req, res) {
    
    try {
        let user = await User.findById(req.params.user_id);
        const { email } = req.body.email;
        if(user.email !== email) {
            const valid = await validateEmail(email);
            if(valid) {
                user.emai = email;
            } else {
                throw new ErrorHandler(400, 'User already exists');
            }
        }
        user.name = req.body.name ? req.body.name : user.name;
        user.gender = req.body.gender;
        user.phone = req.body.phone;
        user.password = user.password;

        user.save(function(err) {
            if(err) {
                return res.json(err);
            }
            return res.json({
                message: 'Contact info updated',
                data: user
            });
        });
    } catch (error) {
        next(error);
    }
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

exports.addContact = async function(req, res, next) {
    try {
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
    } catch (error) {
        next(error);
    }
};

exports.deleteContact = async function(req, res, next) {
    try {
        const user_id = req.body.user_id;
        const email = req.body.email;
        const user = await User.findById(user_id);
        const contacts = user.emergency_contacts.filter(element => element.email !== email);
        user.emergency_contacts = contacts;
        user.save(function (err) {
            if(err) {
                throw new ErrorHandler(500, 'Oops, there was an issue deleting contact. Try again.');
            }
            res.json({
                emergencyContacts: user.emergency_contacts,
                status: 'success',
                message: 'Contact deleted'
            });
        });
    } catch (error) {
        next(error);
    }

};

async function validateEmail(email) {
    const user = await User.findOne({email});
    if(user) {
        return false;
    }
    return true;
}