const express = require('express');
const app = express();
const stats = require('statistics');

app.use(express.json());

// is a sample data of matrix needs to be replaced
const dataMatrix = require("../../../data/decisionMatrix.json");
// create a list of features based on the first record
const features =  Object.keys(dataMatrix[0]['features']);
// get a list of directions of each criterion, needs to be the same size o features
// maybe it will be better in the dataset
const decisionDirections = require("../../../data/criterionDirections.json");


/**
 * This method receive an Array of objects, where each object has an attibute called features
 * All objects in the array needs to have the same length of features.
 * @param {Array} matrix 
 * @returns Array
 */
async function getNormalizedMatrix(matrix) {
    let normalizedMatrix = [];
    for (let i = 0; i < features.length; i++) {
        var direction = decisionDirections[i];
        var totalCriterio1 = matrix.map((x) => { return x.features }).map((y) => {
            if (direction === "MIN") {
                return 1 / y[features[i]];
            }
            return y[features[i]];
        }).reduce((a, b) => a + b, 0);

        normalizedMatrix.push(matrix.map((x) => { return x.features }).map((y) => {
            if (direction === "MIN") {
                return (1 / y[features[i]]) / totalCriterio1;
            }
            return y[features[i]] / totalCriterio1
        }));
    }
    return normalizedMatrix;
}
/**
 * This method receives a normalized matrix and retur a list of Gaussian Factors normalized
 * @param {Array} normalizedMatrix 
 * @returns Array
 */
async function calculateNormalizedGaussianFactor(normalizedMatrix) {
    let gaussianFactorList = [];
    for (let i = 0; i < normalizedMatrix.length; i++) {
        var normalizedFactores = normalizedMatrix[i];        
        var calcStats = normalizedFactores.reduce(stats);
        calcStats['gaussianFactor'] = calcStats.stdev / calcStats.mean;
        gaussianFactorList.push(calcStats);
    }
    var totalGaussians = gaussianFactorList.map((x) => x.gaussianFactor).reduce((a, b) => a + b, 0);
    return gaussianFactorList.map((x) => x.gaussianFactor / totalGaussians);
}
/**
 * This method receive both original and normalized matrix and the factors
 * it will be calculate for each element the indexGAHP and set it in the original matrix
 * @param {Array} normalizedGaussians 
 * @param {Array} normalizedMatrix 
 * @param {Array} originalMatrix 
 * @returns 
 */
async function calculateIndex(normalizedGaussians,normalizedMatrix,originalMatrix) {
    if (normalizedGaussians.length !== features.length) {
        console.log([normalizedMatrix[0].length, normalizedGaussians.length]);
        console.error("Both matrices need to be the same size");
        return;
    }
    for (let j = 0; j < originalMatrix.length; j++) {
        let indexGAHP = normalizedGaussians.map((fx, idx) => {
            return fx * normalizedMatrix[idx][j];
        }).reduce((a, b) => a + b, 0);
        originalMatrix[j]["indexGAHP"] = indexGAHP;
    }
    return originalMatrix;
}


app.get("/test", async (req, res) => {

    /**
     * The results gererated is the same of the spreadsheet
     * but, now I need to improve here how can we proccess the user choises, 
     * to eliminate variables during this process.
     * Maybe now we need to specify how the req body need to be
     */
    var matrixNormalized = await getNormalizedMatrix(dataMatrix);
    var normalizedGaussians = await calculateNormalizedGaussianFactor(matrixNormalized);
    var matrix = await calculateIndex(normalizedGaussians,matrixNormalized,dataMatrix);
    
    // sort descending by the factor to create a rank
    var ranking = matrix.sort((a,b)=>{
        return b.indexGAHP - a.indexGAHP;
    });

    res.send({
        // "matrixNormalized": matrixNormalized,
        // "gaussians": normalizedGaussians,
        // "matrix":matrix
        "ranking":ranking
    });
});

app.listen(3000, () => {
    console.log("started at port 3000");
});
