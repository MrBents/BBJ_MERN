var express = require("express");
var router = express.Router();
const ImageModel = require("../models/image");
const fs = require("fs");

router.get("/", (req, res) => {
  ImageModel.find({ _id: req.query.id }, (err, img) => {
    if (err) res.send(500);
    else {
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.write(img[0].data);
      res.end();
    }
  });
});

module.exports = router;
