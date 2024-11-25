const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    
  
    // const konect = await mongoose.connect(process.env.MONGO_URI)
    const konect = await mongoose.connect('mongodb://localhost:27017/coffee')
    console.log(`coffee-admin app Server is connecetd to ${konect.connection.host}`)
    
} catch (error) {
    console.log(error)
    process.exit(1)
}
};

module.exports = connectDB;