const mongoose = require('mongoose');

// Create Schema
const labelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Label name is required'],
            trim: true,
            minlength: [1, 'Label must have at least 1 character'],
            maxlength: [20,  'Label cannot exceed 20 characters']
        },
        color: {
            type: String,
            default: '#ffffff',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }, 
    { timestamps: true }
);

labelSchema.virtual('id').get(function() {
    return this._id.toHexString();
});
labelSchema.set('toJSON', { virtuals: true, getters: true });
labelSchema.set('toObject', { virtuals: true, getters: true });


// Create model
const Label = mongoose.model('Label', labelSchema);

module.exports = Label;