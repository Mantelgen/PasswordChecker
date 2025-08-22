
from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# Route to serve common-passwords.txt
@app.route('/common-passwords.txt')
def common_passwords():
    return send_from_directory(os.path.dirname(os.path.abspath(__file__)), 'common-passwords.txt')

if __name__ == '__main__':
    app.run(debug=True)
