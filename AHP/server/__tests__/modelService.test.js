const modelService = require('../src/services/modelService');
const dataMatrix = require('../../../data/decisionMatrix.json');
 
describe('Model Service', () => {
  it('should normalize the matrix', async () => {
    const normalizedMatrix = await modelService.getNormalizedMatrix(dataMatrix);
    expect(normalizedMatrix).toBeDefined();
    expect(normalizedMatrix.length).toBe(Object.keys(dataMatrix[0].features).length);
  });

  it('should calculate normalized Gaussian factors', async () => {
    const normalizedMatrix = await modelService.getNormalizedMatrix(dataMatrix);
    const gaussianFactors = await modelService.calculateNormalizedGaussianFactor(normalizedMatrix);
    expect(gaussianFactors).toBeDefined();
    expect(gaussianFactors.length).toBe(normalizedMatrix.length);
  });

  it('should calculate the index GAHP', async () => {
    const normalizedMatrix = await modelService.getNormalizedMatrix(dataMatrix);
    const gaussianFactors = await modelService.calculateNormalizedGaussianFactor(normalizedMatrix);
    const matrixWithIndex = await modelService.calculateIndex(gaussianFactors, normalizedMatrix, dataMatrix);
    expect(matrixWithIndex).toBeDefined();
    expect(matrixWithIndex[0]).toHaveProperty('indexGAHP');
  });

});
