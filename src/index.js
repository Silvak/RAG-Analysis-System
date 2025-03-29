const express = require("express");
const cors = require("cors");
require("dotenv").config();
const uploadRoute = require("./routes/upload");
const ragRoute = require("./routes/rag");
const adminRoute = require("./routes/admin");
const reportRoute = require("./routes/report");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/upload", uploadRoute);
app.use("/api/rag", ragRoute);
app.use("/api/admin", adminRoute);
app.use("/api/report", reportRoute);

// Ruta base
app.get("/", (req, res) => {
  res.send("RAG server is running!");
});

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
