const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Ensure required directories exist
const uploadDir = path.join(__dirname, "uploads");
const dataDir = path.join(__dirname, "data");
[uploadDir, dataDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: uploadDir,
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
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return res.status(500).send("Unable to scan directory: " + err);
      }

      res.render("uploads", { files });
    });
  });

  app.get("/downloads", (req, res) => {
    fs.readdir(dataDir, (err, files) => {
      if (err) {
        return res.status(500).send("Unable to scan directory: " + err);
      }

      res.render("downloads", { files });
    });
  });

  app.get("/files/:filename", (req, res) => {
    const filePath = path.join(dataDir, req.params.filename);
    res.sendFile(filePath);
  });

  app.post("/upload", upload.array("files"), (req, res) => {
    res.redirect("/");
  });

  app.use("/uploads", express.static(uploadDir));
}

module.exports = {
  app,
  setupRoutes,
};
