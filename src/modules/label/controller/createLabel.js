const { deleteCacheKeys } = require('../../../utils/cacheUtils');
const Label = require('../../../../DB/models/labelModel');

const createLabel = async (input, context) => {
    const { name, color } = input;

    const newLabel = await Label.create({
        name, 
        color,
        createdBy: context.userId
    });

    try{
        await deleteCacheKeys('labels:*');
    } catch(err) {
        console.error('Error deleting cache keys:', err);
    }

    return newLabel;
};  

module.exports = createLabel;