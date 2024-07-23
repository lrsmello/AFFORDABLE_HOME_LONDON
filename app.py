from flask import Flask, render_template, request, jsonify, send_file, redirect
import os
import json
import io
import plotly.graph_objects as go
import plotly.io as pio
import requests

app = Flask(__name__)

@app.route('/')
def form():
    return render_template('form.html')

@app.route('/result')
def formRedirect():
    return render_template('results.html')

@app.route('/submit', methods=['POST'])
def submit():

    userName = request.form['name']
    emailAddres = request.form['email']
    referenceBoroughId = request.form['borough']
    maximumDistanceFromReference = request.form['distance']
    incomePerMonth = request.form['income']
    categoryPlace = request.form['dimCategoryRoom']
    priorities = request.form.getlist('dimPriority')

    priorities = [int(x) for x in priorities]

    # Criando o payload para a API
    payload = {
        'userName': userName,
        'emailAddres': emailAddres,
        'referenceBoroughId': int(referenceBoroughId),
        'maximumDistanceFromReference': int(maximumDistanceFromReference),
        'incomePerMonth': int(incomePerMonth),
        'categoryPlace': int(categoryPlace),
        'priorities': priorities
    }

    # print(payload)

    # URL da API externa
    api_url = 'http://localhost:3000/api/model/run'

    # Fazendo a requisição POST para a API externa
    response = requests.post(api_url, json=payload)

    responseJson = response.json()

    ranking1 = responseJson['ranking'][0]
    ranking1_name = ranking1['name']
    ranking1_description = ranking1['description']
    ranking1_latitude = ranking1['latitude']
    ranking1_longitude = ranking1['longitude']

    ranking2 = responseJson['ranking'][1]
    ranking2_name = ranking2['name']
    ranking2_description = ranking2['description']
    ranking2_latitude = ranking2['latitude']
    ranking2_longitude = ranking2['longitude']

    ranking3 = responseJson['ranking'][2]
    ranking3_name = ranking3['name']
    ranking3_description = ranking3['description']
    ranking3_latitude = ranking3['latitude']
    ranking3_longitude = ranking3['longitude']

    map_data = [
        {"rank":1,"latitude": ranking1_latitude, "longitude": ranking1_longitude, "name": "ranking1_name"},
        {"rank":2,"latitude": ranking2_latitude, "longitude": ranking2_longitude, "name": "ranking2_name"},
        {"rank":3,"latitude": ranking3_latitude, "longitude": ranking3_longitude, "name": "ranking3_name"}
        ]
    
    if response.status_code == 200:
        features = responseJson['inputUser']['priorities']
        return redirect('/polar-chart-data', features)

    return render_template('results.html', ranking1_name=ranking1_name, ranking1_description=ranking1_description, ranking1_latitude=ranking1_latitude,ranking1_longitude=ranking1_longitude,ranking2_name=ranking2_name,ranking2_description=ranking2_description,ranking2_latitude=ranking2_latitude,ranking2_longitude=ranking2_longitude,ranking3_name=ranking3_name,ranking3_description=ranking3_description,ranking3_latitude=ranking3_latitude,ranking3_longitude=ranking3_longitude,map_data=map_data,features=features)


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
    categories = request['features']
    data = {
        'Borough 1': [1, 5, 2, 2, 3],
        'Borough 2': [4, 3, 2.5, 1, 2],
        'Borough 3': [2, 3, 5, 1, 4],
        'Borough RF': [2, 3, 5, 1, 4],
        'categories': categories
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
