const express = require("express");
const { getEmbeddings } = require("../services/embedding");
const { getOrCreateCollection } = require("../services/chromaClient");
const { OpenAI } = require("openai");

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Falta la pregunta" });

  try {
    const [embedding] = await getEmbeddings([question]);
    const collection = await getOrCreateCollection();

    const results = await collection.query({
      queryEmbeddings: [embedding], // ← corregido aquí
      nResults: 5,
    });

    const context = results.documents.flat().join("\n");

    const prompt = `Actúa como un analista de negocio. Usa la siguiente información para responder la pregunta:\n\n${context}\n\nPregunta: ${question}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (err) {
    console.error("❌ Error en consulta RAG:", err);
    res.status(500).json({ error: "Error ejecutando la consulta RAG" });
  }
});

module.exports = router;
