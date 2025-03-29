function preprocessText(text) {
  return text
    .replace(/[\x00-\x1F\x7F\u200B]/g, "") // caracteres invisibles
    .replace(/\s{2,}/g, " ") // espacios dobles
    .replace(/\n{2,}/g, "\n") // líneas vacías múltiples
    .replace(/(\r\n|\r)/g, "\n") // saltos de línea normalizados
    .trim();
}

module.exports = { preprocessText };
