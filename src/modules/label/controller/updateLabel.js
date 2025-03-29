const Label = require('../../../../DB/models/labelModel');
const { deleteCacheKeys } = require('../../../utils/cacheUtils');
const { AuthenticationError, NotFoundError } = require('../../../utils/errors');


const updateLabel = async (input, context) => {
    const { labelId, name, color } = input;

    const label = await Label.findById(labelId);
    if(!label) {
        throw new NotFoundError('Label not found');
    }

    if(context.role !== 'admin' && label.createdBy.toString() !== context.labelId.toString()) {
        throw new AuthenticationError('Unauthorized to update this label');
    }

    const updateFields = {
        ...(name !== undefined && { name }),
        ...(color !== undefined && { color }),
    };

    Object.assign(label, updateFields);
    await label.save();

    try {
        deleteCacheKeys('labels:*');
    } catch(err) {
        console.error('Cache Deletion Error:', err);
    }

    return label;
};

module.exports = updateLabel;