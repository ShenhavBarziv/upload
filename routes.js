const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
    res.render("index");
  });

  app.get("/uploads", (req, res) => {
    const directoryPath = path.join(__dirname, "uploads");
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).send("Unable to scan directory: " + err);
      }

      res.render("uploads", { files });
    });
  });

  app.get("/downloads", (req, res) => {
    const directoryPath = path.join(__dirname, "data");
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).send("Unable to scan directory: " + err);
      }

      res.render("downloads", { files });
    });
  });

  app.get("/files/:filename", (req, res) => {
    const filePath = path.join(__dirname, "data", req.params.filename);
    res.sendFile(filePath);
  });

  app.post("/upload", upload.array("files"), (req, res) => {
    res.redirect("/");
  });

  app.use("/uploads", express.static("uploads"));
}

module.exports = {
  app,
  setupRoutes,
};
