const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { preprocessText } = require("../utils/preprocessText");

const { extractText } = require("../services/extractText");
const { getEmbeddings } = require("../services/embedding");
const { getOrCreateCollection } = require("../services/chromaClient");
const { chunkText } = require("../utils/chunk");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.any(), async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No se subieron archivos" });
    }

    const collection = await getOrCreateCollection();

    for (const file of files) {
      const filePath = path.join(__dirname, "../../uploads", file.filename);

      try {
        // 1. Extraer y limpiar texto
        const rawText = await extractText(filePath, file.originalname);
        const text = preprocessText(rawText);

        // 2. Dividir en chunks y filtrar los vacíos o inválidos
        const rawChunks = chunkText(text, 1000);
        const chunks = rawChunks.filter(
          (c) => typeof c === "string" && c.trim().length > 0
        );

        if (chunks.length === 0) {
          console.warn(
            `⚠️ Archivo vacío o sin contenido útil: ${file.originalname}`
          );
          continue;
        }

        console.log(
          `📄 Procesando ${chunks.length} chunks de ${file.originalname}`
        );

        // 3. Embeddings en lotes
        const BATCH_SIZE = 100;
        for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
          const chunkBatch = chunks.slice(i, i + BATCH_SIZE);
          const embeddings = await getEmbeddings(chunkBatch);

          await collection.add({
            ids: chunkBatch.map((_, j) => `${file.filename}_${i + j}`),
            embeddings,
            documents: chunkBatch,
            metadatas: chunkBatch.map(() => ({ source: file.originalname })),
          });

          console.log(
            `✅ Batch ${i / BATCH_SIZE + 1} guardado (${
              chunkBatch.length
            } chunks)`
          );
        }

        console.log(`🎉 Archivo procesado completo: ${file.originalname}`);
      } catch (err) {
        console.error(`❌ Error procesando archivo ${file.originalname}:`, err);
      } finally {
        // 4. Siempre limpiar archivo temporal
        fs.unlinkSync(filePath);
      }
    }

    res.json({
      message:
        "Todos los documentos fueron procesados y almacenados correctamente.",
    });
  } catch (err) {
    console.error("❌ Error general al procesar archivos:", err);
    res.status(500).json({ error: "Error procesando los documentos." });
  }
});

module.exports = router;
