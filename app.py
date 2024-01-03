from flask import Flask
from backend.views import main_blueprint

app = Flask(__name__)

app.register_blueprint(main_blueprint, url_prefix='/main')

if __name__ == '__main__':
    app.run(debug=True)


