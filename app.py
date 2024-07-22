from flask import Flask, render_template, request, redirect, url_for, jsonify, send_file
import os
import json
import io
import matplotlib.pyplot as plt

app = Flask(__name__)

@app.route('/')
def form():
    return render_template('form.html')

@app.route('/submit', methods=['POST'])
def submit():
    userName = request.form['name']
    emailAddres = request.form['email']
    referenceBoroughId = request.form['borough']
    print(f'Name: {username}, Email: {email}, Borough: {borough}')
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
