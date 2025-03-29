const { OpenAI } = require("openai");
const { getEmbeddings } = require("./embedding");
const { getOrCreateCollection } = require("./chromaClient");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateBusinessAnalysis = async (
  customQuestion = "Genera un análisis estratégico completo."
) => {
  const collection = await getOrCreateCollection();
  const [queryEmbedding] = await getEmbeddings([customQuestion]);

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding], // ← corregido aquí
    nResults: 8,
  });

  const context = results.documents.flat().join("\n");

  const systemPrompt = `Eres un analista de negocios especializado en industrias tecnológicas en Europa.
Con base en el contexto a continuación, redacta un informe estructurado y profesional para la empresa Nexon Tech.
El informe debe incluir secciones con subtítulos, datos relevantes y análisis profundo.
Estructura esperada:

1. Industry & Market Overview
2. Market Size and Growth Forecast
3. Key Industry Trends
4. Strategic Opportunities
5. PESTEL Analysis
6. Strategic Recommendations

Información de contexto:\n\n${context}`;

  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: customQuestion },
    ],
    temperature: 0.4,
  });

  return chatResponse.choices[0].message.content;
};

module.exports = { generateBusinessAnalysis };
