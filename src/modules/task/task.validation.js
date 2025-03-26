const { z } = require('zod');

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
    image: z.string().optional()
});

module.exports = {
    createTaskSchema
};