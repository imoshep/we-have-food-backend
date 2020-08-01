const multer = require("multer");
const _ = require("lodash");

const storage = multer.diskStorage({
  destination: "./public/data/food/images/",
  filename: function (req, file, cb) {
    const fileName = _.padStart(_.toString(_.random(99999999)), 8, "0");
    const parts = file.mimetype.split("/");
    cb(null, "IMAGE-" + fileName + "." + parts[1]);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
});

module.exports = upload;
