const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
const clientDistPath = path.join(__dirname, "client", "dist");
app.use(express.static(clientDistPath));

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
  app.get("/api/uploads", (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(files);
    });
  });

  app.get("/api/downloads", (req, res) => {
    fs.readdir(dataDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(files);
    });
  });

  app.get("/api/files/:filename", (req, res) => {
    const filePath = path.join(dataDir, req.params.filename);
    res.sendFile(filePath);
  });

  app.post("/api/upload", upload.array("files"), (req, res) => {
    res.status(200).json({ message: "Uploaded" });
  });

  app.use("/uploads", express.static(uploadDir));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

module.exports = {
  app,
  setupRoutes,
};
