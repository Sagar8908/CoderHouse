const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const refreshModel = require('../Models/refresh-model');
exports.GenerateToken = async (payload) => {
    const accessToken = jwt.sign(payload, accessTokenSecret, {
        expiresIn: '1m',
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
        expiresIn: '1y',
    });
    
    return { accessToken, refreshToken };
}

exports.storerefreshToken = async(token, userId) => {
    try {
        await refreshModel.create({
            token,
            userId,
        });
    } catch (err) {
        console.log(err.message);
    }
}

exports.verifyAccessToken = async (token) => {
    return jwt.verify(token, accessTokenSecret);
}

exports.verifyRefreshToken = async (token) => {
    return jwt.verify(token, refreshTokenSecret);
}

exports.findRefreshToken = async (userId,refreshToken) => {
    return await refreshModel.findOne({
        userId: userId,
        token: refreshToken,
    });
}

exports.updateRefreshToken = async (userTd, refreshToken) => {
    return await refreshModel.updateOne(
        { userId: userTd },
        { token: refreshToken }
    );
}

exports.removeToken = async (refreshToken) => {
   return  await refreshModel.deleteOne({ token: refreshToken });
}