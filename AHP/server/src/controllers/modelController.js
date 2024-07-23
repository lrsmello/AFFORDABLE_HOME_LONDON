const modelService = require('../services/modelService');

exports.runModel = async (req, res) => {
  try {
    const userInformation = req.body;  // Recebe as informações do corpo da requisição validadas
    console.log(userInformation);
    const generatedDataMatrix = await modelService.createDataMatrix(userInformation);
    console.log(generatedDataMatrix);
    const matrixNormalized = await modelService.getNormalizedMatrix(generatedDataMatrix);
    console.log(matrixNormalized);
    const normalizedGaussians = await modelService.calculateNormalizedGaussianFactor(matrixNormalized);
    console.log(normalizedGaussians);
    const matrix = await modelService.calculateIndex(normalizedGaussians, matrixNormalized, generatedDataMatrix);
    console.log(matrix);
    let ranking = [];
    // Ordena decrescente para criar um ranking
    if (Array.isArray(matrix)) {
      ranking = matrix.sort((a, b) => b.indexGAHP - a.indexGAHP);
      var distance = userInformation.maximumDistanceFromReference;
      var incomePerMonth = userInformation.incomePerMonth;
      ranking.map((rk)=>{
        if (rk.features.Distance===undefined) {
          rk['isInsideDistance'] = null;
        } else {
          rk['isInsideDistance'] = rk.features.Distance <= distance ? true : false;
        }
        if (rk.features["Rent Price"]===undefined) {
          rk['isAffordableRent'] = null;
        } else {
          rk['isAffordableRent'] =  (incomePerMonth*0.3)>=rk.features["Rent Price"] ? true : false;
        }
        if (rk.features["Cost of Living"]===undefined) {
          rk['isInsideCostOfLiving'] = null;
        } else {
          rk['isInsideCostOfLiving'] =  (incomePerMonth*12)>=rk.features["Cost of Living"] ? true : false;
        }

      });
      res.send({ ranking });
    } else {
      res.send({ ranking });
    }
  } catch (error) {
    console.log(`${error}`);
    res.status(500).send({ error: `Error running model` });
  }
};
