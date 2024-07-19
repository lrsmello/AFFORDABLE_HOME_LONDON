const request = require('supertest');
const app = require('../src/app');
const modelRequestBody = require('../../../data/modelRequestBody.json');
const modelService = require('../src/services/modelService');

// Mock the service functions
jest.mock('../src/services/modelService');

describe('Model Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should run the model and return a ranking', async () => {
    const mockDataMatrix = [...require('../../../data/decisionMatrix.json')];
    const mockNormalizedMatrix = await modelService.getNormalizedMatrix(mockDataMatrix);
    const mockGaussianFactors = await modelService.calculateNormalizedGaussianFactor(mockNormalizedMatrix);
    const mockMatrixWithIndex = await modelService.calculateIndex(mockGaussianFactors, mockNormalizedMatrix, mockDataMatrix);

    modelService.createDataMatrix.mockResolvedValue(mockDataMatrix);
    modelService.getNormalizedMatrix.mockResolvedValue(mockNormalizedMatrix);
    modelService.calculateNormalizedGaussianFactor.mockResolvedValue(mockGaussianFactors);
    modelService.calculateIndex.mockResolvedValue(mockMatrixWithIndex);

    const res = await request(app)
      .post('/api/model/run')
      .send(modelRequestBody);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ranking');
    expect(res.body.ranking).toBeInstanceOf(Array);
  });

});
