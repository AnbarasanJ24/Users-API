const mongoose = require('mongoose');

const connectDB = async () => {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log(`MongoDB connected at ${connection.connection.host}`.yellow.underline.bold)
}

module.exports = connectDB;