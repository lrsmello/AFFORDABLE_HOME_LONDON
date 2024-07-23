const stats = require('statistics');
//const dataMatrix = require('../../../../data/decisionMatrix.json');
const decisionDirectionsDefault = require('../../../../data/criterionDirections.json');
let decisionDirections = decisionDirectionsDefault;
const boroughs = require('../../../../data/boroughs.json');
const distances = require('../../../../data/distance.json');
const dimCategoryRoom = require('../../../../data/dimCategoryRoom.json');
const londonBoroughRent = require('../../../../data/londonBoroughRent.json');
const dimPriority = require('../../../../data/dimPriority.json');
const fixedData = require('../../../../data/fixedData.json');
const boroughDescription = require('../../../../data/boroughDescription.json');
const travelTimes = require('../../../../data/distance_matrix_results.json');

let features = [];

exports.getNormalizedMatrix = async (matrix) => {
  features = Object.keys(matrix[0]['features']);
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
  // get referenced borough by id userInformation.referenceBoroughId filtering the file boroughs.json
  let referenceBoroughId = userInformation.referenceBoroughId;
  // get the distances using the boroughId to filter the distance.json on column target
  let distFromReferenceBorough = distances.filter(
    (d) => d.Target == referenceBoroughId && d.Target !== d.Origin
  ).map((b) => {
    let b_details = boroughs.filter((f) => f.ID == b.Origin);
    if (b_details.length > 0) {
      b_details = b_details[0];
    }
    b['boroughDetails'] = b_details;
    return b;
  });
  // get the category place userInformation.categoryPlace, and use it to get the referenced dimension on dimCategoryRoom.json
  let categoryPlace = userInformation.categoryPlace;
  let category = dimCategoryRoom.filter((f) => f.ID == categoryPlace);
  if (category.length > 0) {
    category = category[0];
  }
  // get the rent price from the file londonBoroughRent.json using the metric NU_LOWER_QUARTILE, filtering the category
  let rentPrices = londonBoroughRent.filter((f) => f.ID_CATEGORY == categoryPlace);
  // to filter the features that is in the fixedData.json, I need to create a from-to parameters between the dimPriority.json and fixedData
  let prioritiesFilter = userInformation.priorities;
  let priorities = dimPriority.filter((f) => prioritiesFilter.indexOf(f.ID) != -1);
  decisionDirections = priorities.map((p) => {
    if (p.NU_DIRECTION > 0) return 'MAX';
    return 'MIN';
  });
  // get the distance between the selected borough to others
  let travelTimesBorough = travelTimes.filter((f) => f.destination_ID === referenceBoroughId);
  // create a new matrix
  let outputMatrix = [];
  // run over the borough list to join all the features
  for (let bi = 0; bi < boroughs.length; bi++) {
    const borough = boroughs[bi];
    let featsObject = {};
    for (let pi = 0; pi < priorities.length; pi++) {
      const priority = priorities[pi];
      // it was necessery create a manually link between the priority and the source data.
      // according to each option.
      // p1
      if (priority.ID === 1) {
        var p1 = rentPrices.filter((f) => f.ID_AREA == borough.ID);
        if (p1.length > 0) {
          p1 = p1[0].NU_LOWER_QUARTILE;
        }
        featsObject[priority.DS_PRIORITY] = p1
      }
      //
      // p2
      if (priority.ID === 2) {
        var p2 = distFromReferenceBorough.filter((f) => f.Origin == borough.ID);
        if (p2.length > 0) {
          p2 = p2[0].Distance;
        } else {
          p2 = 0.000000001;// caso não encontre, atribui almost zero.
          // in the begining was broken here, because the comparison bitween itself borough
        }
        featsObject[priority.DS_PRIORITY] = p2
      }
      //
      // p3
      if (priority.ID === 3) {
        var p3 = fixedData.filter((f) => f.BoroughId === borough.ID);
        if (p3.length > 0) {
          p3 = p3[0].AverageWellbeing;
        }
        featsObject[priority.DS_PRIORITY] = p3
      }
      //
      // p4
      if (priority.ID === 4) {
        var p4 = travelTimesBorough.filter((f) => f.origin_ID === borough.ID);
        if (p4.length > 0) {
          p4 = p4[0].duration;
        }
        else {
          p4 = 0.000000001;// caso não encontre, atribui almost zero.

        }
        featsObject[priority.DS_PRIORITY] = p4
      }
      //
      // p5
      if (priority.ID === 5) {
        var p5 = fixedData.filter((f) => f.BoroughId === borough.ID);
        if (p5.length > 0) {
          p5 = p5[0].AverageIncome;
        }
        featsObject[priority.DS_PRIORITY] = p5
      }
      //
      // other priorities needs to be handled here
      //see the validateUserInformations arround line 20 for configuration as well
    }
    var bdesc = boroughDescription.filter((f) => f.ID_AREA === borough.ID);
    if (bdesc.length > 0) {
      bdesc = bdesc[0].TX_DESCRIPTION;
    } else {
      bdesc = "";
    }

    outputMatrix.push({
      "ID": borough.ID,
      "name": borough.name,
      "description": bdesc,
      "latitude": borough.latitude,
      "longitude": borough.longitude,
      "features": featsObject
    })
  }
  // priority 1  = NU_LOWER_QUARTILE in londonBoroughRent Data
  // priority 2  = Distance in the distFromReferenceBorough variable
  // priority 3  = AverageWellbeing in fixed Data

  // priority 4  = Traveling Time
  // priority 5  = AverageIncome

  // filter data dimensions
  // join features togheter
  // prepare the data
  // remove zero datas
  // return the matrix
  // return dataMatrix; // Exemplo de retorno
  return outputMatrix;
};
