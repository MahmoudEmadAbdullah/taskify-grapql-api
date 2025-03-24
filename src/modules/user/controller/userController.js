const createUser = require('./createUser');
const getUser = require('./getUser');
const getUsers = require('./getUsers');
const updateUser = require('./updateUser');
const changeUserPassword = require('./changeUserPassword');
const deleteUser = require('./deleteUser');

const getMe = require('./getMe');
const updateMe = require('./updateMe');
const changeMyPassword = require('./changeMyPassword');
const deleteMe = require('./deleteMe');

module.exports = {
    createUser,
    getUser,
    getUsers,
    updateUser,
    changeUserPassword,
    deleteUser,
    getMe,
    updateMe,
    changeMyPassword,
    deleteMe
};