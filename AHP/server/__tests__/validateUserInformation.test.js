const { validateUserInformation } = require('../src/middlewares/validateUserInformation');

describe('validateUserInformation Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        referenceBoroughId: 'valid-id',
        maximumDistanceFromReference: 5,
        incomePerMonth: 1000,
        categoryPlace: 2,
        priorities: [1,2,3]
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next if all validations pass', () => {
    validateUserInformation(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if referenceBoroughId is missing', () => {
    delete req.body.referenceBoroughId;
    validateUserInformation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ error: 'referenceBoroughId is required' });
  });

  it('should return 400 if maximumDistanceFromReference is not a number', () => {
    req.body.maximumDistanceFromReference = 'not-a-number';
    validateUserInformation(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ error: 'maximumDistanceFromReference must be a number' });
  });


});
