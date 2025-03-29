const mongoose = require('mongoose');

// Create Schema
const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Task title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters'],
            maxlength: [50, 'Title cannot exceed 50 characters']
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },
        taskStatus: {
            type: String,
            enum: ['pending', 'completed', 'canceled'],
            default: 'pending'
        },
        image: {
            type: String,
            default: null,
        },
        imagePublicId: {
            type: String
        },
        deadline: {
            type: Date,
            default: null
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }, 
    { timestamps: true }
);

taskSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
taskSchema.set('toJSON', { virtuals: true, getters: true });
taskSchema.set('toObject', { virtuals: true, getters: true });

// Create model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;