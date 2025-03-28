const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const extractTextFromDocx = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
};

const extractText = async (filePath, originalName) => {
  const ext = path.extname(originalName).toLowerCase();
  if (ext === ".pdf") return await extractTextFromPDF(filePath);
  if (ext === ".docx") return await extractTextFromDocx(filePath);
  if (ext === ".txt") return fs.readFileSync(filePath, "utf-8");
  throw new Error("Formato no soportado");
};

module.exports = { extractText };
