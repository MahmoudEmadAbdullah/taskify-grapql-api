const Label = require('../../../../DB/models/labelModel');
const { deleteCacheKeys } = require('../../../utils/cacheUtils');
const { AuthenticationError, NotFoundError } = require('../../../utils/errors');

const deleteLabel = async (input, context) => {
    const { labelId } = input;

    const label = await Label.findById(labelId);
    if(!label) {
        throw new NotFoundError('Label not found');
    }

    if(context.role !== 'admin' && label.createdBy.toString() !== context.userId.toString()) {
        throw new AuthenticationError('Unauthorized to delete this label');
    }
    await label.deleteOne();

    try{
        await deleteCacheKeys('labels:*');
    } catch(err) {
        console.error('Cache Deletion Error:', err);
    }
    return 'Label has been deleted';
};

module.exports = deleteLabel;