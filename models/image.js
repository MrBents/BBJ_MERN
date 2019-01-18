var mongoose = require("mongoose");

var ImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  view: String,
  label: String
});

module.exports = mongoose.model("Image", ImageSchema);
