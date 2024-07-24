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
      var distance = userInformation.maximumDistanceFromReference;
      var incomePerMonth = userInformation.incomePerMonth;
      ranking.map((rk) => {
        if (rk.features.Distance === undefined) {
          rk['isInsideDistance'] = null;
        } else {
          rk['isInsideDistance'] = rk.features.Distance <= distance ? true : false;
        }
        if (rk.features["Rent Price"] === undefined) {
          rk['isAffordableRent'] = null;
        } else {
          rk['isAffordableRent'] = (incomePerMonth * 0.3) >= rk.features["Rent Price"] ? true : false;
        }
        if (rk.features["Cost of Living"] === undefined) {
          rk['isInsideCostOfLiving'] = null;
        } else {
          rk['isInsideCostOfLiving'] = (incomePerMonth * 12) >= rk.features["Cost of Living"] ? true : false;
        }
        rk['isReferenceBorough'] = (rk.ID===userInformation.referenceBoroughId);
        return rk;
      });

      var maxRent = Math.max(...ranking.map((b) => { return b.features['Rent Price'] }));
      var maxDistance = Math.max(...ranking.map((b) => { return b.features['Distance'] }));
      var maxWellBeing = Math.max(...ranking.map((b) => { return b.features['Well Being'] }));
      var maxTravellingTime = Math.max(...ranking.map((b) => { return b.features['Travelling Time'] }));
      var maxCostOfLiving = Math.max(...ranking.map((b) => { return b.features['Cost of Living'] }));

      ranking = ranking.map((rk) => {
        // console.log(rk)
        rk['normalizedFeatures'] = {
          'Rent Price': 1-(rk['features']['Rent Price'] / maxRent),
          'Distance': 1-(rk['features']['Distance'] / maxDistance),
          'Well Being': rk['features']['Well Being'] / maxWellBeing,
          'Travelling Time': 1-(rk['features']['Travelling Time'] / maxTravellingTime),
          'Cost of Living': 1-(rk['features']['Cost of Living'] / maxCostOfLiving),
        };
        return rk;
      });

      res.send({ inputUser: userInformation, ranking: ranking });
    } else {
      res.send({ ranking });
    }
  } catch (error) {
    console.log(`${error}`);
    res.status(500).send({ error: `Error running model` });
  }
};
