var mongoose = require("mongoose");

var BatchSummarySchema = new mongoose.Schema({
  conveyor: Number,
  good_entries: Array,
  good_count: Number,
  bad_entries: Array,
  bad_count: Number,
  color: String,
  type: String,
  size: String,
  created: { type: Date, default: new Date() }
});

module.exports = mongoose.model("BatchSummary", BatchSummarySchema);
