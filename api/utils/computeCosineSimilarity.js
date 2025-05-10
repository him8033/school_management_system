const natural = require("natural");

const computeCosineSimilarity = (text1, text2) => {
  const tfidf = new natural.TfIdf();

  tfidf.addDocument(text1);
  tfidf.addDocument(text2);

  let vector1 = [];
  let vector2 = [];

  // Get unique words from both texts
  let uniqueWords = new Set([...text1.split(" "), ...text2.split(" ")]);

  // Create TF-IDF vectors
  uniqueWords.forEach((word) => {
    vector1.push(tfidf.tfidf(word, 0)); // TF-IDF score for text1
    vector2.push(tfidf.tfidf(word, 1)); // TF-IDF score for text2
  });

  // Compute Cosine Similarity
  let dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  let magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  let magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));

  let similarity = magnitude1 && magnitude2 ? (dotProduct / (magnitude1 * magnitude2)) * 100 : 0; // Convert to %
  
  return similarity.toFixed(0)
};

module.exports = { computeCosineSimilarity };