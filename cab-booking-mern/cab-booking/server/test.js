const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/CabBooking")
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });