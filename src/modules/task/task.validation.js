const { z } = require('zod');
const mongoose = require('mongoose');

const createTaskSchema = z.object({
    title: z.string()
        .trim()
        .min(3, { message: 'Title must be at least 3 characters' })
        .max(50, { message: 'Title cannot exceed 50 characters' }),
    description: z.string()
        .trim()
        .max(500, { message: 'Description cannot exceed 500 characters' })
        .optional(),
    deadline: 
        z.preprocess( (deadline) => { 
            if(typeof deadline === 'string' || deadline instanceof Date) {
                return new Date(deadline);
            }
            return undefined;
        }, z.date().optional() ),
    image: z.any().optional(),
    taskStatus: z.enum(["pending", "in-progress", "completed"]).default("pending") 
});

const updateTaskSchema = z.object({
    taskId: z.string()
        .refine((taskId) => mongoose.isValidObjectId(taskId), {
            message: 'Invalid Task Id',
        }),
    title: z.string()
        .trim()
        .min(3, { message: 'Title must be at least 3 characters' })
        .max(50, { message: 'Title cannot exceed 50 characters' })
        .optional(),
    deadline: 
        z.preprocess( (deadline) => { 
            if(typeof deadline === 'string' || deadline instanceof Date) {
                return new Date(deadline);
            }
            return undefined;
        }, z.date().optional() ),
    image: z.any().optional(),
    taskStatus: z.enum(["pending", "in-progress", "completed"]).optional(),
});


const deleteTaskSchema = z.object({
    taskId: z.string()
        .refine((taskId) => mongoose.isValidObjectId(taskId), {
            message: 'Invalid Task Id',
        }),
});


const getTaskSchema = z.object({
    taskId: z.string()
        .refine((taskId) => mongoose.isValidObjectId(taskId), {
            message: 'Invalid Task Id',
        }),
});


module.exports = {
    createTaskSchema,
    updateTaskSchema,
    deleteTaskSchema,
    getTaskSchema
};