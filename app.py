from flask import Flask, render_template, request, jsonify, send_file, redirect
import os
import json
import io
import plotly.graph_objects as go
import plotly.io as pio
import requests
import functions

app = Flask(__name__)

@app.route('/')
def form():
    return render_template('form.html')

@app.route('/result')
def formRedirect():
    return render_template('results.html')

features = []
rankingRefNormalized = []
ranking1Normalized = []
ranking2Normalized = []
ranking3Normalized = []
rankingReffeatures = []
ranking1features = []
ranking2features = []
ranking3features = []

@app.route('/submit', methods=['POST'])
def submit():
    # Carregar o arquivo dimPriority.json
    with open(os.path.join('data', 'dimPriority.json')) as f:
        dimPriorityData = json.load(f)
    
    # Criar um dicionário para mapear IDs para DS_PRIORITY
    priority_dict = {item['ID']: item['DS_PRIORITY'] for item in dimPriorityData}

    #userName = request.form['name']
    #emailAddres = request.form['email']
    referenceBoroughId = request.form['borough']
    maximumDistanceFromReference = request.form['distance']
    incomePerMonth = request.form['income']
    categoryPlace = request.form['dimCategoryRoom']
    priorities = request.form.getlist('dimPriority')

    priorities = [int(x) for x in priorities]

    # Obter os valores DS_PRIORITY correspondentes
    priority_values = [priority_dict.get(priority_id, '') for priority_id in priorities]

    # Criando o payload para a API
    payload = {
        #'userName': userName,
        #'emailAddres': emailAddres,
        'referenceBoroughId': int(referenceBoroughId),
        'maximumDistanceFromReference': int(maximumDistanceFromReference),
        'incomePerMonth': int(incomePerMonth),
        'categoryPlace': int(categoryPlace),
        'priorities': priorities,
        'priorityValues': priority_values  # Adiciona os valores DS_PRIORITY ao payload
    }

    #print(payload)  # Print do payload

    # URL da API externa
    api_url = 'http://localhost:3000/api/model/run'

    # Fazendo a requisição POST para a API externa
    response = requests.post(api_url, json=payload)

    responseJson = response.json()

    # print(responseJson)

    rankingRef = responseJson['ranking'][0]
    rankingRef_name = rankingRef['name']
    rankingRef_description = rankingRef['description']
    rankingRef_latitude = rankingRef['latitude']
    rankingRef_longitude = rankingRef['longitude']
    rankingRef_normalized = rankingRef['normalizedFeatures']
    rankingRef_features = rankingRef['features']
    rankingRef_IsAffordable = rankingRef['isAffordableRent']
    rankingRef_IsDistance = rankingRef['isInsideDistance']
    rankingRef_IsAvgIncome = rankingRef['isInsideCostOfLiving']
    
    global rankingRefNormalized
    rankingRefNormalized = functions.dict_to_list(rankingRef_normalized)

    global rankingReffeatures
    rankingReffeatures = functions.dict_to_list(rankingRef_features)

    ranking1 = responseJson['ranking'][1]
    ranking1_name = ranking1['name']
    ranking1_description = ranking1['description']
    ranking1_latitude = ranking1['latitude']
    ranking1_longitude = ranking1['longitude']
    ranking1_normalized = ranking1['normalizedFeatures']
    ranking1_features = ranking1['features']
    ranking1_IsAffordable = ranking1['isAffordableRent']
    ranking1_IsDistance = ranking1['isInsideDistance']
    ranking1_IsAvgIncome = ranking1['isInsideCostOfLiving']

    global ranking1Normalized
    ranking1Normalized = functions.dict_to_list(ranking1_normalized)

    global ranking1features
    ranking1features = functions.dict_to_list(ranking1_features)

    ranking2 = responseJson['ranking'][2]
    ranking2_name = ranking2['name']
    ranking2_description = ranking2['description']
    ranking2_latitude = ranking2['latitude']
    ranking2_longitude = ranking2['longitude']
    ranking2_normalized = ranking2['normalizedFeatures']
    ranking2_features = ranking2['features']
    ranking2_IsAffordable = ranking2['isAffordableRent']
    ranking2_IsDistance = ranking2['isInsideDistance']
    ranking2_IsAvgIncome = ranking2['isInsideCostOfLiving']
    
    global ranking2Normalized
    ranking2Normalized  = functions.dict_to_list(ranking2_normalized)

    global ranking2features
    ranking2features  = functions.dict_to_list(ranking2_features)

    ranking3 = responseJson['ranking'][3]
    ranking3_name = ranking3['name']
    ranking3_description = ranking3['description']
    ranking3_latitude = ranking3['latitude']
    ranking3_longitude = ranking3['longitude']
    ranking3_normalized = ranking3['normalizedFeatures']
    ranking3_features = ranking3['features']
    ranking3_IsAffordable = ranking3['isAffordableRent']
    ranking3_IsDistance = ranking3['isInsideDistance']
    ranking3_IsAvgIncome = ranking3['isInsideCostOfLiving']
    
    global ranking3Normalized
    ranking3Normalized  = functions.dict_to_list(ranking3_normalized)

    global ranking3features
    ranking3features  = functions.dict_to_list(ranking3_features)

    global features
    features = responseJson['inputUser']['priorities']

    # print(features)

    return render_template('results.html', 
                           rankingRef_name=rankingRef_name, 
                           rankingRef_description=rankingRef_description, 
                           rankingRef_latitude=rankingRef_latitude, 
                           rankingRef_longitude=rankingRef_longitude,
                           rankingRef_IsAffordable=rankingRef_IsAffordable,
                           rankingRef_IsDistance=rankingRef_IsDistance,
                           rankingRef_IsAvgIncome=rankingRef_IsAvgIncome,

                           ranking1_name=ranking1_name, 
                           ranking1_description=ranking1_description, 
                           ranking1_latitude=ranking1_latitude,
                           ranking1_longitude=ranking1_longitude,
                           ranking1_IsAffordable=ranking1_IsAffordable,
                           ranking1_IsDistance=ranking1_IsDistance,
                           ranking1_IsAvgIncome=ranking1_IsAvgIncome,

                           ranking2_name=ranking2_name,
                           ranking2_description=ranking2_description,
                           ranking2_latitude=ranking2_latitude,
                           ranking2_longitude=ranking2_longitude,
                           ranking2_IsAffordable=ranking2_IsAffordable,
                           ranking2_IsDistance=ranking2_IsDistance,
                           ranking2_IsAvgIncome=ranking2_IsAvgIncome,

                           ranking3_name=ranking3_name,
                           ranking3_description=ranking3_description,
                           ranking3_latitude=ranking3_latitude,
                           ranking3_longitude=ranking3_longitude,
                           ranking3_IsAffordable=ranking3_IsAffordable,
                           ranking3_IsDistance=ranking3_IsDistance,
                           ranking3_IsAvgIncome=ranking3_IsAvgIncome,

                           features=features)


@app.route('/data/boroughs')
def get_boroughs():
    data_path = os.path.join('data', 'boroughs.json')
    with open(data_path) as f:
        boroughs = json.load(f)
    return jsonify(boroughs)

@app.route('/data/dimPriority')
def get_dimPriorities():
    data_path = os.path.join('data', 'dimPriority.json')
    with open(data_path) as f:
        dimPriority = json.load(f)
    return jsonify(dimPriority)

@app.route('/data/dimCategoryRoom')
def get_dimCategoryRoom():
    data_path = os.path.join('data', 'dimCategoryRoom.json')
    with open(data_path) as f:
        dimCategoryRoom = json.load(f)
    return jsonify(dimCategoryRoom)

@app.route('/chart/<int:chart_id>')
def generate_chart(chart_id):
    fig, ax = plt.subplots()
    categories = ['A', 'B', 'C', 'D']
    values = [1, 4, 2, 3] if chart_id == 1 else [2, 3, 5, 1]
    
    ax.barh(categories, values)
    ax.set_xlabel('Values')
    ax.set_title(f'Chart {chart_id}')
    
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    return send_file(img, mimetype='image/png')

@app.route('/polar-chart-data')
def get_polar_chart_data():
    categ_string = ['Exclui','Rent Price','Distance','Wellbeing','Travelling time','Cost of Living']
    categories = features
    x = [categ_string[i] for i in categories if i < len(categ_string)]
    
    data = {
        'Borough 1': {
            'main': ranking1Normalized,
            'extra': ranking1features
        },
        'Borough 2': {
            'main': ranking2Normalized,
            'extra': ranking1features
        },
        'Borough 3': {
            'main': ranking3Normalized,
            'extra': ranking1features
        },
        'Borough RF': {
            'main': rankingRefNormalized,
            'extra': ranking1features
        },
        'categories': x
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
