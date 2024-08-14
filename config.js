const mongoose =require('mongoose');

// connecting to the database
const connectDB = (URI)=>{
    return mongoose.connect(URI);
};

module.exports = connectDB;