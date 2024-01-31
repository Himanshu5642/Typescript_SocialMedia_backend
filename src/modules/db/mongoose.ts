const mongoose = require("mongoose");

function connectDb() {
    try {
        const mongodbUri = process.env.mongodb_uri;
        mongoose.connect(mongodbUri, {
            useNewUrlParser: true,
            // useFindAndModify: false
        }).then(()=>console.log("database connection successfull"))
        mongoose.set('debug', true);
    } catch (error) {
        console.log(error);
    }
}

connectDb();