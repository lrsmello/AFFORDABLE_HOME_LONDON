from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import json

app = Flask(__name__)

@app.route('/')
def form():
    return render_template('form.html')

@app.route('/submit', methods=['POST'])
def submit():
    name = request.form['name']
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

if __name__ == '__main__':
    app.run(debug=True)
