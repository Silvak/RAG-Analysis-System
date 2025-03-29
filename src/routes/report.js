const express = require("express");
const { generateBusinessAnalysis } = require("../services/reportGenerator");

const router = express.Router();

router.post("/", async (req, res) => {
  const { question } = req.body;

  try {
    const report = await generateBusinessAnalysis(
      question ||
        "Genera un análisis de mercado para Nexon Tech basado en el contexto disponible."
    );
    res.json({ report });
  } catch (err) {
    console.error("Error generando reporte:", err);
    res.status(500).json({ error: "No se pudo generar el informe" });
  }
});

module.exports = router;
