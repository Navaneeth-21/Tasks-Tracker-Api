const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({

  description: String,

  duration: Number,

  date: Date,

  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});


module.exports = mongoose.model("exercises", exerciseSchema);
