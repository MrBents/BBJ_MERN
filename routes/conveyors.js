var express = require("express");
var router = express.Router();
const ConveyorModel = require("../models/conveyor");

/* GET conveyors listing. */
router.get("/", (req, res) => {
  ConveyorModel.find({})
    .sort({ number: 1 })
    .exec((err, conveyors) => {
      if (err) res.sendStatus(500);
      let conveyorList = [];
      conveyors.forEach(element => {
        conveyorList.push({ number: element.number });
      });
      res.json(conveyorList);
    });
});

module.exports = router;
