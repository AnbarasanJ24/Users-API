const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username is required'],
        maxlength: [50, 'Username should be max 50 characters'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [
            /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
            'Please add a valid email'
        ],
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now()
    }

});

/* Issue JWT Token
=========================== */
UserSchema.methods.getJWT = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

/* Password Encryption
=========================== */
UserSchema.pre('save', async function (req, res, next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    // 10 rounds of salt is recommended
    this.password = await bcrypt.hash(this.password, salt);
})

/* Verify plain password with its hashed version
=========================== */
UserSchema.methods.matchPassword = async function (userPassword) {
    return await bcrypt.match(userPassword, this.password);
}



module.exports = mongoose.model('User', UserSchema);