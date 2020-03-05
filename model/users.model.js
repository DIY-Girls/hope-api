const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { ContactSchema } = require('./contacts.model');

const { meta } = require('../config');

// Setup schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: String,
    phone: String,
    emergency_contacts: [ContactSchema],
    hope_device: String,
    create_date: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified || !user.isNew) {
        next();
    } else {
        bcrypt.hash(user.password, meta.saltingRounds, function(err, hash) {
            if(err) {
                console.log('Error hashing password for user: ', user.name);
                next(err);
            } else {
                user.password = hash;
                next();
            }
        });
    }
});

// Export User model
const User = module.exports = mongoose.model('user', userSchema);

module.exports.get = function(callback, limit) {
    User.find(callback).limit(limit);
};
