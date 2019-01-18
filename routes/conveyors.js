var express = require("express");
var router = express.Router();
const axios = require("axios");
const ConveyorModel = require("../models/conveyor");
const ImageModel = require("../models/image");
var mongoose = require("mongoose");
var fs = require("fs");
let config = require("../config");
var StatHandler = require("../handlers/statHandler")();
var FormData = require("form-data");
var flipper = 2;
// Returns File Ids {"image_head": ..., "image_top": ...}
function saveImages(files, label_top, label_head) {
  let ids = {};
  return new Promise((resolve, reject) => {
    files.map((fobj, index) => {
      fs.readFile(fobj.path, (err, _data) => {
        if (err) reject(err); //return handleError(err);
        let view = index == 0 ? "head" : "top";
        let label = index == 0 ? label_head : label_top;
        ImageModel.create(
          {
            data: _data,
            contentType: "JPEG",
            view: view,
            label: label
          },
          (err, awesome_instance) => {
            if (err) reject(err);
            else {
              let id = awesome_instance._id;
              if (index == 0) ids["image_head"] = id;
              else {
                ids["image_top"] = id;
              }
              //Delete local file
              fs.unlink(fobj.path, err => {
                if (err) console.log("error deleting file", err);
                if (Object.keys(ids).length == 2) {
                  resolve(ids);
                }
              });
            }
          }
        );
      });
    });
  });
}

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
    async (req, res, next) => {
      if (!req.files) res.sendStatus(400);
      let conveyor = req.body.conveyor;
      let color = req.body.color;
      let type = req.body.type;
      let size = req.body.size;
      // console.log(req);
      let { label, label_top, label_head } = await predict_class(req.files);
      // console.log(response);
      let ids = await saveImages(req.files, label_top, label_head);
      let entry = {
        conveyor: conveyor,
        class: label ? "good" : "bad",
        photo_ids: ids,
        color: color,
        type: type,
        size: size
      };
      console.log(entry);
      // // let
      StatHandler.addEntry(entry);
      io.emit("images", ids);
      res.sendStatus(200);
    }
  );

  return router;
};

function predict_class(img_files) {
  return {
    label: flipper++ % 2,
    label_top: 0,
    label_head: 0
  };
  let form = new FormData();
  form.append("img_top", fs.createReadStream(img_files[0].path));
  form.append("img_head", fs.createReadStream(img_files[1].path));
  return new Promise((resolve, reject) => {
    axios
      .post(/*config.InferenceURL*/ "http://61bb2f01.ngrok.io/images", form, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": `multipart/form-data; boundary=${form._boundary}`
        }
      })
      .then(response => {
        // console.log(response);

        resolve({
          label: response.data.label,
          label_top: response.data.label_top,
          label_head: response.data.label_head
        });
      })
      .catch(err => {
        console.error("Inference Error", err);
      });
  });
}

module.exports = routes;
