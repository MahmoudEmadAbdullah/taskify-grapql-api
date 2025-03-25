const mongoose = require('mongoose');
const valid = require('validator');
const bcrypt = require('bcrypt');


// Create Schema
const { Schema } = mongoose;
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, 'Too short user name'],
            maxlength: [20, 'Too long user name']
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: {
                validator: (email) => {
                    return valid.isEmail(email);
                },
                message: 'Please enter a valid email address'
            }
        },
        emailVerificationCode: String,
        verificationCodeExpires: Date,
        emailVerified: Boolean,
        password: {
            type: String,
            required: true,
            minlength: [8, 'Too short password'],
            validate: {
                validator: (password) => {
                    return /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password);
                },
                message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
            }
        },
        passwordResetCode: String,
        passwordResetExpires: Date,
        passwordResetVerified: Boolean,
        passwordChangedAt: Date,
        lastLogin: Date,
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        }
    },

    {timestamps: true}
);

// pre-save middleware to hash password, but only on document creation
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
userSchema.set('toJSON', { virtuals: true, getters: true });
userSchema.set('toObject', { virtuals: true, getters: true });

// Create model
const User = mongoose.model('User', userSchema);
module.exports = User;
