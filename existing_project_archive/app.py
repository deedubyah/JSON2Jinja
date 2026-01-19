from flask import Flask, render_template, jsonify, request
import json
from jinja2 import Template, Environment, meta

app = Flask(__name__, static_url_path='/j2j/static')

# Configure for Passenger with base URI
app.config['SERVER_NAME'] = None  # Let Passenger handle this
# app.config['APPLICATION_ROOT'] = '/j2j'
app.config['PREFERRED_URL_SCHEME'] = 'https'

current_data = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/parse_json', methods=['POST'])
def parse_json():
    try:
        global current_data
        current_data = request.get_json()
        return jsonify(current_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/test_template', methods=['POST'])
def test_template():
    try:
        data = request.get_json()
        template_text = data.get('template', '')
        
        template = Template(template_text)
        result = template.render(**current_data)
        
        return jsonify({
            'result': result,
            'success': True
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 400

if __name__ == '__main__':
    app.run(debug=True)
