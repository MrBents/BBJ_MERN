var express = require("express");
var router = express.Router();
const ConveyorModel = require("../models/conveyor");
const ImageModel = require("../models/image");
var mongoose = require("mongoose");
var fs = require("fs");

routes = (io, multer) => {
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

  router.post(
    "/images",
    multer({ dest: "uploads/" }).array("photos", 2),
    (req, res, next) => {
      console.log(req.files);
      req.files.map((fobj, index) => {
        fs.readFile(fobj.path, (err, _data) => {
          let id = mongoose.Types.ObjectId();
          ImageModel.create(
            {
              number: id,
              data: _data,
              contentType: "JPEG"
            },
            (err, awesome_instance) => {
              if (err) return handleError(err);
              else {
                console.log("created", awesome_instance);
                if (index === 0) io.emit("image_top", id);
                else io.emit("image_head", id);
              }
            }
          );
        });
      });

      res.sendStatus(200);
    }
  );

  return router;
};

module.exports = routes;
