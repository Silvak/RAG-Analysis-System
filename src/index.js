const express = require("express");
const cors = require("cors");
require("dotenv").config();

const uploadRoute = require("./routes/upload");
const ragRoute = require("./routes/rag");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/upload", uploadRoute);
app.use("/api/rag", ragRoute);

// Ruta base
app.get("/", (req, res) => {
  res.send("RAG server is running!");
});

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
