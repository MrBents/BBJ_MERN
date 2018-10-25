var mongoose = require("mongoose");

var ConveyorSchema = new mongoose.Schema({
  number: Number
  // mac_addr: String,
  // ip_addr: String
});

module.exports = mongoose.model("Conveyor", ConveyorSchema);
