var mongoose = require("mongoose");

var ImageSchema = new mongoose.Schema({
  number: mongoose.Types.ObjectId,
  data: Buffer,
  contentType: String
});

module.exports = mongoose.model("Image", ImageSchema);
