const { NotFoundError } = require('../../../utils/errors');
const ApiFeatures = require('../../../utils/apiFeatures');
const User = require('../../../../DB/models/userModel');

const getUsers = async (args) => {
    const apiFeatures = new ApiFeatures(User.find(), args)
        .filter()
        .search({
            name: 'string',
            email: 'string',
            role: 'string',
            createdAt: 'date',
        });

    const countDocuments = await apiFeatures.mongooseQuery.clone().countDocuments();
    apiFeatures.paginate(countDocuments).sort().limitFields();

    const users = await apiFeatures.mongooseQuery;

    if(!users || users.length === 0) {
        throw new NotFoundError('No users found');
    }

    return {
        success: true,
        pagination: apiFeatures.paginationResult,
        data: users
    };
};

module.exports = getUsers;

