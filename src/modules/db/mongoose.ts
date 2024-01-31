const mongoose = require("mongoose");
const env = require("../environment/environment");

function connectDb() {
    try {
        const mongodbUri = process.env.mongodb_uri;
        mongoose.connect(mongodbUri).then(()=>console.log("database connection successfull"))
        mongoose.set('debug', true);
    } catch (error) {
        console.log(error);
    }
}

connectDb();