const chunkText = (text, maxLength = 500) => {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    chunks.push(text.slice(start, start + maxLength));
    start += maxLength;
  }
  return chunks;
};

module.exports = { chunkText };
