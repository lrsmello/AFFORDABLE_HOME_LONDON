from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import json

app = Flask(__name__)

@app.route('/')
def form():
    return render_template('form.html')

@app.route('/submit', methods=['POST'])
def submit():
    username = request.form['name']
    email = request.form['email']
    borough = request.form['borough']
    print(f'Name: {name}, Email: {email}, borough: {borough}')
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

if __name__ == '__main__':
    app.run(debug=True)
