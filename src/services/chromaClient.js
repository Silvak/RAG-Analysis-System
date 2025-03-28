const { ChromaClient } = require("chromadb");

const chroma = new ChromaClient({ path: "http://chroma:8000" });

const getOrCreateCollection = async () => {
  return await chroma.getOrCreateCollection({ name: "documents" });
};

module.exports = { getOrCreateCollection };
