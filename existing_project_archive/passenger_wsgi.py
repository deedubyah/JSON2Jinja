#!/usr/bin/env python3
import sys
import os
import traceback
from datetime import datetime

# Add debugging
debug_log_path = '/home/deedbhfg/public_html/j2j/debug.log'

def log_message(message):
    try:
        with open(debug_log_path, 'a') as f:
            f.write(f'{datetime.now()}: {message}\n')
            f.flush()
    except Exception as e:
        print(f"LOG ERROR: {e}")

log_message("=== NEW REQUEST ===")
log_message("passenger_wsgi.py called")
log_message(f"Python version: {sys.version}")
log_message(f"Current directory: {os.getcwd()}")

# Ensure the app directory is in the Python path
app_dir = os.path.dirname(os.path.abspath(__file__))
log_message(f"App directory: {app_dir}")

if app_dir not in sys.path:
    sys.path.insert(0, app_dir)
    log_message(f"Added {app_dir} to Python path")

# Check if app.py exists
app_py_path = os.path.join(app_dir, 'app.py')
log_message(f"app.py exists: {os.path.exists(app_py_path)}")

# Check templates
templates_dir = os.path.join(app_dir, 'templates')
log_message(f"Templates dir exists: {os.path.exists(templates_dir)}")

try:
    log_message("Attempting to import Flask app...")
    from app import app as application
    log_message("Successfully imported Flask app!")
    log_message(f"Flask routes: {[str(rule) for rule in application.url_map.iter_rules()]}")
    
except Exception as e:
    log_message(f"ERROR importing Flask app: {str(e)}")
    log_message(f"Traceback: {traceback.format_exc()}")
    
    # Create error WSGI app
    def application(environ, start_response):
        status = '500 Internal Server Error'
        headers = [('Content-Type', 'text/plain')]
        start_response(status, headers)
        error_msg = f'Import Error: {str(e)}\n\nTraceback:\n{traceback.format_exc()}'
        return [error_msg.encode('utf-8')]
