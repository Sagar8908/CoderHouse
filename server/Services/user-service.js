const UserModel = require("../Models/user-model");

exports.findUser = async(filter) => {
    const user = await UserModel.findOne(filter);
    // console.log(user);
    return user;
}

exports.createUser = async (data) => {
    const user = await UserModel.create(data);
    return user;
}