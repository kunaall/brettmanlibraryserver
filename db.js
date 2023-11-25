const mongoose= require("mongoose");
const dotenv= require("dotenv");
dotenv.config()

const connectDb = async () => {
  
  return mongoose.connect(process.env.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
}

module.exports = { connectDb }

