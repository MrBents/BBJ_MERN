var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.json([
    {
      id: 1,
      username: "someppl"
    },
    {
      id: 2,
      username: "lollipop"
    }
  ]);
});

module.exports = router;
