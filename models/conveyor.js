var mongoose = require("mongoose");

var ConveyorSchema = new mongoose.Schema({
  number: Number,
  mac_addr: String,
  ip_addr: String
});

export default mongoose.model("Conveyor", ConveyorSchema);
