const { z } = require('zod');
const User = require('../../../DB/models/userModel');


const signupSchema = z.object({
    name: z.string()
        .min(3, { message: 'User name must be at least 3 characters' })
        .max(20,  { message: 'User name must be at most 20 characters' })
        .trim(),
    email: z.string()
        .email({ message: 'Please enter a valid email' })
        .refine(async (email) => {
            const userExists = await User.findOne({ email });
            return !userExists;
        }, { message: 'Email already exists' }),
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
            }
        ),
    passwordConfirm: z.string()
})
.superRefine(({ password, passwordConfirm }, ctx) => {
    if(password !== passwordConfirm) {
        ctx.addIssue({
            path: ['passwordConfirm'],
            message: 'Passwords do not match'
        });
    }
});


const verifyEmailSchema = z.object({
    verficationCode: z.string().min(1, {message: 'verification code is required'})
}); 


const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email' }),
    password: z.string().min(1, { message: 'Password is required' })
});


const forgotPasswordSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email' })
});


const resetCodeSchema = z.object({
    resetCode: z.string().min(1, {message: 'Reset code is required'})
}); 


const resetPasswordSchema = z.object({
    email: z.string()
        .email({ message: 'Please enter a valid email' }),
    newPassword: z.string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
            }
        ),
    newPasswordConfirm: z.string(),
})
.superRefine(({ newPassword, newPasswordConfirm }, ctx) => {
    if(newPassword !== newPasswordConfirm) {
        ctx.addIssue({
            path: ['newPasswordConfirm'],
            message: 'Passwords do not match'
        });
    }
});


module.exports = {
    signupSchema,
    verifyEmailSchema,
    loginSchema,
    forgotPasswordSchema,
    resetCodeSchema,
    resetPasswordSchema
};


