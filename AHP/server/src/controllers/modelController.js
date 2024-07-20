const modelService = require('../services/modelService');

exports.runModel = async (req, res) => {
  try {
    const userInformation = req.body;  // Recebe as informações do corpo da requisição validadas
    const generatedDataMatrix = await modelService.createDataMatrix(userInformation);
    const matrixNormalized = await modelService.getNormalizedMatrix(generatedDataMatrix);
    const normalizedGaussians = await modelService.calculateNormalizedGaussianFactor(matrixNormalized);
    const matrix = await modelService.calculateIndex(normalizedGaussians, matrixNormalized, generatedDataMatrix);
    let ranking = [];
    // Ordena decrescente para criar um ranking
    if (Array.isArray(matrix)) {
      ranking = matrix.sort((a, b) => b.indexGAHP - a.indexGAHP);
      res.send({ ranking });
    } else {
      res.send({ ranking });
    }
  } catch (error) {
    console.log(`${error}`);
    res.status(500).send({ error: `Error running model` });
  }
};
