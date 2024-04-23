const mongoose = require('mongoose');
const Data = require("../models/dataModel")

mongoose.set('strictQuery', false);

const connectDB = (url) => {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

module.exports = connectDB;
