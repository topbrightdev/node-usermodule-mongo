const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            unique: true,
            required: true
        },
        active: {
            type: Boolean,
            required: true
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model('Users', UserSchema);
