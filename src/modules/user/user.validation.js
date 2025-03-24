const { z } = require('zod');
const mongoose = require('mongoose');


const createUserSchema = z.object({
    name: z.string()
        .min(3, { message: 'User name must be at least 3 characters' })
        .max(20,  { message: 'User name must be at most 20 characters' })
        .trim(),
    email: z.string()
        .email({ message: 'Please enter a valid email' }),
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
            }
        ),
    passwordConfirm: z.string(),
    role: z.enum(['admin', 'user']).optional(),
})
.superRefine(({ password, passwordConfirm }, ctx) => {
    if(password !== passwordConfirm) {
        ctx.addIssue({
            path: ['passwordConfirm'],
            message: 'Passwords do not match'
        });
    }
});


const getUserSchema = z.object({
    userId: z.string()
        .refine((userId) => mongoose.isValidObjectId(userId), {
            message: 'Invalid User Id',
        })
});


const updateUserSchema = z.object({
    userId: z.string()
        .refine((userId) => mongoose.isValidObjectId(userId), {
            message: 'Invalid User Id',
        }),
    name: z.string()
        .trim()
        .nonempty({ message: 'User name cannot be empty' })
        .min(3, { message: 'User name must be at least 3 characters' })
        .max(20,  { message: 'User name must be at most 20 characters' })
        .optional(),
    email: z.string()
        .email({ message: 'Please enter a valid email' })
        .optional(),
    role: z.enum(['admin', 'user']).optional()
});


const changeUserPasswordSchema = z.object({
    userId: z.string()
        .refine((userId) => mongoose.isValidObjectId(userId), {
            message: 'Invalid User Id',
        }),
    newPassword: z.string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
            }
        ),
    newPasswordConfirm: z.string(),
}).superRefine(({ newPassword, newPasswordConfirm }, ctx) => {
    if(newPassword !== newPasswordConfirm) {
        ctx.addIssue({
            path: ['newPasswordConfirm'],
            message: 'Passwords do not match'
        });
    }
});


const deleteUserSchema = z.object({
    userId: z.string()
        .refine((userId) => mongoose.isValidObjectId(userId), {
            message: 'Invalid User Id',
        }),
})


const updateMeSchema = z.object({
    name: z.string()
        .trim()
        .nonempty({ message: 'User name cannot be empty' })
        .min(3, { message: 'User name must be at least 3 characters' })
        .max(20,  { message: 'User name must be at most 20 characters' })
        .optional(),
    email: z.string()
        .email({ message: 'Please enter a valid email' })
        .optional(),
});


const changeMyPasswordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .regex(
            /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            {
                message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
            }
        ),
    newPasswordConfirm: z.string(),
}).superRefine(({ newPassword, newPasswordConfirm }, ctx) => {
    if(newPassword !== newPasswordConfirm) {
        ctx.addIssue({
            path: ['newPasswordConfirm'],
            message: 'Passwords do not match'
        });
    }
});


module.exports = {
    createUserSchema,
    getUserSchema,
    updateUserSchema,
    changeUserPasswordSchema,
    deleteUserSchema,
    updateMeSchema,
    changeMyPasswordSchema
};