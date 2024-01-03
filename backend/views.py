from flask import Blueprint, json, jsonify, render_template
import os
from collections import defaultdict
from flask_cors import CORS

main_blueprint = Blueprint('main', __name__,
                           template_folder='templates',
                           static_folder='static',
                           static_url_path='backend/static'
                           )

CORS(main_blueprint, supports_credentials=True)
file_path = os.path.join(os.path.dirname(__file__), 'static/data', 'soccer_small.json')

@main_blueprint.route('/')
def home():
    return render_template('home.html')

@main_blueprint.route('/players')
def players():
    with open(file_path, 'r') as file:
        values = json.load(file)
    return values

@main_blueprint.route('/players/<string:name>')
def playerName(name):
    with open(file_path, 'r') as file:
        values = json.load(file)
    for entry in values:
        if entry.get('Name') == name:
            return entry

@main_blueprint.route('/clubs')
def clubs():
    with open(file_path, 'r') as file:
        values = json.load(file)
    club_data = defaultdict(list)
    for entry in values:
        club_data[entry['Club']].append(entry)
    return club_data

@main_blueprint.route('/attributes')
def attributes():
    with open(file_path, 'r') as file:
        values = json.load(file)
    attributes_list = list(values[0].keys())
    return attributes_list
