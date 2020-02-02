const mongoose = require('mongoose');
const { ContactSchema } = require('./contacts.model');

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

// Export User model
const User = module.exports = mongoose.model('user', userSchema);

module.exports.get = function(callback, limit) {
    User.find(callback).limit(limit);
};
