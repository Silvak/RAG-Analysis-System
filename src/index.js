const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

require("dotenv").config();

const uploadRoute = require("./routes/upload");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/upload", uploadRoute);

app.get("/", (req, res) => {
  res.send("RAG server is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
