const express = require("express");
const { ChromaClient } = require("chromadb");

const router = express.Router();

router.delete("/clean", async (req, res) => {
  try {
    const chroma = new ChromaClient({ path: "http://chroma:8000" });
    const collections = await chroma.listCollections();

    for (const col of collections) {
      await chroma.deleteCollection({ collectionName: col.name });
    }

    res.json({ message: "Base de datos limpiada completamente." });
  } catch (err) {
    console.error("Error real al limpiar la base de datos:", err);
    res.status(500).json({ error: "Error limpiando la base de datos" });
  }
});

module.exports = router;
