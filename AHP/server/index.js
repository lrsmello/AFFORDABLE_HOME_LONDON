const express = require('express');
const app = express();

const dataMatrix = require("../../data/decisionMatrix.json");
const decisionDirections = require("../../data/criterionDirections.json");

app.use(express.json());

async function normalizeMatrix(matrix){
   var totalCriterio1 = matrix.map((x)=>{return x.features}).map((y)=>{
        return y["Criterion 1"];
   }).reduce((a,b)=>a+b,0);
    
   var normalizedMatrix1 = matrix.map((x)=>{return x.features}).map((y)=>{
        return y["Criterion 1"]/totalCriterio1;
   });
    return [totalCriterio1,normalizedMatrix1];
}

app.get("/test",async (req,res)=>{


    
    var matrixNormalized = await normalizeMatrix(dataMatrix);

    res.send({
        "result":matrixNormalized,
        "data":dataMatrix,
        "decision":decisionDirections
    });
});

app.listen(3000,()=>{
    console.log("started at port 3000");
});
