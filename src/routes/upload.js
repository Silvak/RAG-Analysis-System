const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { extractText } = require("../services/extractText");
const { getEmbedding } = require("../services/embedding");
const { getOrCreateCollection } = require("../services/chromaClient");
const { chunkText } = require("../utils/chunk");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = path.join(__dirname, "../../uploads", req.file.filename);
    const text = await extractText(filePath, req.file.originalname);
    const chunks = chunkText(text, 500);

    const collection = await getOrCreateCollection();

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await getEmbedding(chunk);
      await collection.add({
        ids: [`${req.file.filename}_${i}`],
        embeddings: [embedding],
        documents: [chunk],
        metadatas: [{ source: req.file.originalname }],
      });
    }

    fs.unlinkSync(filePath); // elimina archivo temporal

    res.json({ message: "Documento procesado y almacenado en Chroma" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error procesando documento" });
  }
});

module.exports = router;
