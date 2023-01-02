const mongoose = require("mongoose");

const db = () => {
  console.log(process.env.MONGO_URI);
  mongoose
    .connect('mongodb://localhost:27017/Authentication', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then((data) => {
      console.log(`Database connected on server: ${data.connection.host}`);
    });
};

module.exports = db;