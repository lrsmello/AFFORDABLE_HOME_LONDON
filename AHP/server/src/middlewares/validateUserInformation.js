exports.validateUserInformation = (req, res, next) => {
    const userInformation = req.body;
  
    // check if the userInformation has everything that we need
    if (!userInformation.referenceBoroughId) {
      return res.status(400).send({ error: 'referenceBoroughId is required' });
    }
    if (typeof userInformation.maximumDistanceFromReference !== 'number') {
      return res.status(400).send({ error: 'maximumDistanceFromReference must be a number' });
    }
    if (typeof userInformation.incomePerMonth !== 'number') {
      return res.status(400).send({ error: 'incomePerMonth must be a number' });
    }
    if (typeof userInformation.categoryPlace !== 'number') {
      return res.status(400).send({ error: 'categoryPlace must be a number' });
    }
    if (!Array.isArray(userInformation.priorities) || userInformation.priorities.length < 2) {
      return res.status(400).send({ error: 'priorities must be an array with at least 2 items' });
    }
    // case is everithing fine, go to the next middleware or controller
    next();
  };
  