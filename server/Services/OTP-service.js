const crypto = require("crypto");
require('dotenv').config();
const smssid = process.env.SMS_SID;
const authToken = process.env.SMS_AUTH_TOKEN;
const { HashOPT } = require('./hash-service');
const client = require('twilio')(smssid, authToken);

exports.GenerateOTP = async () => {
    const OTP = crypto.randomInt(1000, 9999);
    return OTP;
}

exports.SendbySMS = async (phone, OTP) => {
    return await client.messages.create({
        to: phone,
        from: process.env.SMS_FROM_NUMBER,
        body: `Your CodersHouse OTP is ${OTP}`,
    }).then(
        message => console.log(message.sid)
    );
}

exports.verifyOTPservice = async (hashedOTP, data) => {
    const computedhash = await HashOPT(data);

    if (computedhash === hashedOTP) {
        return true;
    }
    return false;
}
