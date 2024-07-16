from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def form():
    return render_template('form.html')

@app.route('/submit', methods=['POST'])
def submit():
    name = request.form['name']
    email = request.form['email']
    # Aqui você pode adicionar a lógica para salvar os dados
    # Por exemplo, salvar em um banco de dados ou enviar um e-mail
    print(f'Nome: {name}, Email: {email}')
    return redirect(url_for('form'))

if __name__ == '__main__':
    app.run(debug=True)
