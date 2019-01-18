var express = require("express");
var router = express.Router();
const BatchSummary = require("../models/batchSummary");

router.get("/today/:conveyor", (req, res, next) => {
  let startDate = new Date();
  startDate.setHours(0, 0, 0, 0); //change to 7am
  BatchSummary.find(
    { conveyor: req.params.conveyor, created: { $gt: startDate } },
    (err, data) => {
      if (err) res.send(500);
      res.send(data);
    }
  );
});

module.exports = router;
