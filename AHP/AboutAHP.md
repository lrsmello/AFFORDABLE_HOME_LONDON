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
- [ ] list of criterions that should we want to use
- [ ] the definition of what the direction is better for each criterion
- [ ] the values of each crossing section of our decision matrix

With this datas available, we can create the processes in an endpoint.


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