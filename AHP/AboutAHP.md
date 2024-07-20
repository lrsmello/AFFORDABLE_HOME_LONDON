AHP What is it?
===================

AHP is an Operational Research Method used to help with the decision making process when its have a multiple-criteria. To more about, please read the source (https://ijahp.org/index.php/IJAHP/article/view/833), on that example, the method is called AHP Gausian and was used to choose what kind of warship Brazil needs.

# Gausian AHP

According to the source above, the AHP process could be like the next steps

1. Estabilish the decision matrix
2. Calculate the average of the alternatives
3. Calculate the standart deviation of the alternatives for each criterion
4. Calculate the Gaussian factor for each criterion 
5. Multiplying the Gaussian factor by the decision matrix
6. Normalization of results 
7. Obtaining the ranking


## The Ideia

So, based on our problem that is show the optimum borough based on the users criteria, the decision matrix could be a list of all boroughs with all the criterions (like distance, rent price, and other rates that can be useful).

Attached here has a spreadsheet with a sample data and process.

In this way, I think that we need:

- [x] list of boroughs
- [x] list of criterions that should we want to use
- [x] the definition of what the direction is better for each criterion
- [x] the values of each crossing section of our decision matrix

With this datas available, we can create the processes in an endpoint.

The rows between 36 and 56 should be well formated, but it didn't work. If anyone knows how can I do the right way to format this stuff in Markdown, let me know please.

´´´JSON
Request
[POST] /boroughs/ranking

body 
{
    "referencedBorough":"Hackney",
    // others criterions
}

Response
body
[
    {
        "borough":"Islington",
        "rankingPosition": 1,
        // other relevant information
    }
]

´´´

## Pseudo AHP engine endpoint

- Receive a list with all the criteria is important to user (just a name).
- create a decision matrix
- normalize the matrix
- calc the average
- calc the standard deviation
- calc the gaussian factor
- normalize the gausian factor
- calculate the index AHP
- generate the rank
- return the result

## Platform Idea

Rest api with nodeJs Express
https://www.npmjs.com/package/r-integration

# How to run the server model ?

- You need to have installed nodeJs on the computer. (https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
- By console (terminal) inside the folder "server", you can run:

```
npm install
```

And after all instalations, you can run the server with the command:

```
npm start
```

This actions should start a webserver to provide the API as seems like the documentation up above, listening to the port 3000, you will be able to create a post request to http://localhost:3000/api/model/run