const { z } = require('zod');
const mongoose = require('mongoose');

const createLabelSchema = z.object({
    name: z.string()
        .trim()
        .min(1, { message: 'Label must have at least 1 character' })
        .max(20, { message: 'Label cannot exceed 20 characters' }),
    color: z.string().optional(),
});


const updateLabelSchema = z.object({
    labelId: z.string()
        .refine((labelId) => mongoose.isValidObjectId(labelId), {
            message: 'Invalid label Id',
        }),
    name: z.string()
        .trim()
        .min(1, { message: 'Label must have at least 1 character' })
        .max(20, { message: 'Label cannot exceed 20 characters' })
        .optional(),
    color: z.string().optional(),
});


const deleteLabelSchema = z.object({
    labelId: z.string()
    .refine((labelId) => mongoose.isValidObjectId(labelId), {
        message: 'Invalid label Id',
    }),
});


module.exports = {
    createLabelSchema,
    updateLabelSchema,
    deleteLabelSchema
};