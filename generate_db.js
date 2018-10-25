const ConveyorModel = require("./models/conveyor");
const mongoose = require("mongoose");
var config = require("./config");

let conveyors = [
  {
    id: 1
  },
  {
    id: 2
  },
  {
    id: 3
  },
  {
    id: 4
  },
  {
    id: 5
  },
  {
    id: 6
  },
  {
    id: 7
  },
  {
    id: 8
  },
  {
    id: 9
  },
  {
    id: 10
  },
  {
    id: 11
  },
  {
    id: 12
  }
];

function generateData() {
  conveyors.map(c => {
    ConveyorModel.create({ number: c.id }, (err, awesome_instance) => {
      if (err) return handleError(err);
      else {
        console.log("created", awesome_instance);
      }
    });
  });
}

function deleteConveyors() {
  return new Promise((resolve, reject) => {
    mongoose.connection.db.dropCollection("conveyors", (err, result) => {
      if (err) reject(err);
      else {
        console.log("Dropped conveyors collection");
        resolve();
      }
    });
  });
}

mongoose.connect(
  config.db_url,
  async (err, client) => {
    if (err) console.log("MongoDB connection error", err);
    else {
      console.log("Successful mongo connection");
      try {
        await deleteConveyors();
      } catch (err) {}
      generateData();
    }
  }
);
