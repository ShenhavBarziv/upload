const express = require("express");
const multer = require("multer");
const path = require("path");
const { FILE_SIZE_LIMIT_MB } = require("./constants");

const app = express();
const storage = multer.diskStorage({
  destination: "./uploads",
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage });

function setupRoutes() {
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  app.get("/upload", (req, res) => {
    res.redirect("/");
  });

  app.post("/upload", upload.array("files"), (req, res) => {
    // if (!req.files || req.files.length === 0) {
    //   return res.redirect("/?error=No files uploaded.");
    // }
    res.redirect("/");
  });

  app.use("/uploads", express.static("uploads"));
}

module.exports = {
  app,
  setupRoutes,
};
