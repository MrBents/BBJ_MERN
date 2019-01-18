const config = require("../config");
const axios = require("axios");
const BatchSummary = require("../models/batchSummary");

function StatHandler() {
  this.conveyors = {
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
    9: {},
    10: {},
    11: {},
    12: {}
  };

  this.batchLimit = 5;

  // each entry needs:
  // Conveyor, size, class, time, id

  this.addEntry = async function(entry) {
    let bucket = this.conveyors[entry.conveyor];
    if (entry.class in bucket) {
      // Handle logic for yes Data
      bucket[entry.class].push(entry);
      if (
        entry.class === "good" &&
        bucket[entry.class].length >= this.batchLimit //once a conveyor reaches <batchLimit> good photos a record is saved
      ) {
        try {
          await this.summarize(
            entry,
            bucket["good"],
            "bad" in bucket ? bucket["bad"] : []
          );
          bucket = {};
        } catch (err) {
          console.error(err);
        }
      }
    } else {
      // Handle logic for no Data
      bucket[entry.class] = [entry];
    }
    this.conveyors[entry.conveyor] = bucket;
  };

  this.summarize = (entry, good, bad) => {
    return new Promise((resolve, reject) => {
      BatchSummary.create(
        {
          conveyor: entry.conveyor,
          good_entries: good,
          good_count: good ? good.length : 0,
          bad_entries: bad,
          bad_count: bad ? bad.length : 0,
          color: entry.color,
          type: entry.type,
          size: entry.size
        },
        (err, bs_instance) => {
          if (err) reject(err);
          resolve(bs_instance);
        }
      );
    });
  };

  return this;
}

module.exports = StatHandler;
