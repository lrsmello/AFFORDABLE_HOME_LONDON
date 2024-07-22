from flask import Flask, render_template, request, redirect, url_for, jsonify, send_file
import os
import json
import io
import matplotlib.pyplot as plt
import requests

app = Flask(__name__)

@app.route('/')
def form():
    return render_template('form.html')

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
        'referenceBoroughId': referenceBoroughId,
        'maximumDistanceFromReference': int(maximumDistanceFromReference),
        'incomePerMonth': int(incomePerMonth),
        'categoryPlace': int(categoryPlace),
        'priorities': priorities
    }

    print(payload)

    # URL da API externa
    api_url = 'http://localhost:3000/api/model/run'

    # Fazendo a requisição POST para a API externa
    response = requests.post(api_url, json=payload)

    # Verificando a resposta da API
    if response.status_code == 200:
        print(f'Success: {response.json()}')
    else:
        print(f'Failed: {response.status_code}, {response.text}')

    return redirect(url_for('form'))

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

if __name__ == '__main__':
    app.run(debug=True)
