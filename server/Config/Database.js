const mongoose = require('mongoose');
require('dotenv').config('.env');

const dbconnect = () => {
    mongoose.connect(process.env.DB_URL, {

    }).then((result) => {
        console.log('Congo DB Connecgted!!!!');
    }).catch((err) => {
        console.log('ERROR OCCURED!!!!!');
    });
}
module.exports = dbconnect;