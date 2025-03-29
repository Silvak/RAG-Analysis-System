const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BATCH_SIZE = 100; // mejor ir seguro

const getEmbeddings = async (texts) => {
  if (!Array.isArray(texts)) throw new Error("Debe ser un array de textos");

  const cleaned = texts.filter(
    (t) => typeof t === "string" && t.trim().length > 0
  );

  const embeddings = [];

  for (let i = 0; i < cleaned.length; i += BATCH_SIZE) {
    const batch = cleaned.slice(i, i + BATCH_SIZE);
    console.log(
      `🔹 Embedding batch ${i / BATCH_SIZE + 1}: ${batch.length} textos`
    );

    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: batch,
    });

    embeddings.push(...response.data.map((obj) => obj.embedding));
  }

  return embeddings;
};

module.exports = { getEmbeddings };
