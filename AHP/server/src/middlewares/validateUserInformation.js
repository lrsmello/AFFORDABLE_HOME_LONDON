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
    // just for now, when we implement the other priorities datas needs to be included here
    const validPriorities = [1,2,3,4,5];
    for (let i = 0; i < userInformation.priorities.length; i++) {
      if (validPriorities.indexOf(userInformation.priorities[i])===-1) {
        return res.status(400).send({error:`The valid priorities are ${validPriorities.join(',')}`});
      }      
    }
    // case is everithing fine, go to the next middleware or controller
    next();
  };
  