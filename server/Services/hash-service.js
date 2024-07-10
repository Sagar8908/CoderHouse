const crypto = require("crypto");
require('dotenv').config();
exports.HashOPT = async (data) => {
    const hased = crypto.createHmac('sha256', process.env.HASHSECRET).update(toString(data)).digest('hex');
    // console.log(hased);
    return hased;
}