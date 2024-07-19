const stats = require('statistics');
const dataMatrix = require('../../../../data/decisionMatrix.json');
const decisionDirections = require('../../../../data/criterionDirections.json');

const features = Object.keys(dataMatrix[0]['features']);

exports.getNormalizedMatrix = async (matrix) => {
  let normalizedMatrix = [];
  for (let i = 0; i < features.length; i++) {
    const direction = decisionDirections[i];
    const totalCriterio1 = matrix.map(x => x.features)
      .map(y => direction === "MIN" ? 1 / y[features[i]] : y[features[i]])
      .reduce((a, b) => a + b, 0);

    normalizedMatrix.push(matrix.map(x => x.features)
      .map(y => direction === "MIN" ? (1 / y[features[i]]) / totalCriterio1 : y[features[i]] / totalCriterio1));
  }
  return normalizedMatrix;
};

exports.calculateNormalizedGaussianFactor = async (normalizedMatrix) => {
  let gaussianFactorList = [];
  for (let i = 0; i < normalizedMatrix.length; i++) {
    const normalizedFactores = normalizedMatrix[i];        
    const calcStats = normalizedFactores.reduce(stats);
    calcStats['gaussianFactor'] = calcStats.stdev / calcStats.mean;
    gaussianFactorList.push(calcStats);
  }
  const totalGaussians = gaussianFactorList.map(x => x.gaussianFactor).reduce((a, b) => a + b, 0);
  return gaussianFactorList.map(x => x.gaussianFactor / totalGaussians);
};

exports.calculateIndex = async (normalizedGaussians, normalizedMatrix, originalMatrix) => {
  if (normalizedGaussians.length !== features.length) {
    console.error("Both matrices need to be the same size");
    return;
  }
  for (let j = 0; j < originalMatrix.length; j++) {
    const indexGAHP = normalizedGaussians.map((fx, idx) => fx * normalizedMatrix[idx][j])
      .reduce((a, b) => a + b, 0);
    originalMatrix[j]["indexGAHP"] = indexGAHP;
  }
  return originalMatrix;
};

exports.createDataMatrix = async (userInformation) => {
  // Implementação da validação e criação da matriz de dados
  
    // validate inputs
    // filter data dimensions
    // join features togheter
    // prepare the data
    // remove zero datas
    // return the matrix
  return dataMatrix; // Exemplo de retorno
};
