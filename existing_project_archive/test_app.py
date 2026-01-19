#!/usr/bin/env python3
"""
Simple test script to check if the Flask app can be imported and run
"""
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    print("Testing Flask app import...")
    from app import app
    print("✓ Flask app imported successfully!")
    
    print(f"App routes:")
    for rule in app.url_map.iter_rules():
        print(f"  {rule}")
    
    print("\nTesting templates directory...")
    templates_dir = os.path.join(os.path.dirname(__file__), 'templates')
    if os.path.exists(templates_dir):
        print(f"✓ Templates directory exists: {templates_dir}")
        files = os.listdir(templates_dir)
        print(f"  Files: {files}")
        if 'index.html' in files:
            print("✓ index.html found in templates")
        else:
            print("✗ index.html NOT found in templates")
    else:
        print(f"✗ Templates directory missing: {templates_dir}")
    
    print("\nTesting app context...")
    with app.app_context():
        from flask import render_template
        try:
            # Try to render the template
            html = render_template('index.html')
            print("✓ Template renders successfully!")
            print(f"  Template length: {len(html)} characters")
        except Exception as e:
            print(f"✗ Template render failed: {e}")
    
except ImportError as e:
    print(f"✗ Import error: {e}")
    print("Make sure all required packages are installed:")
    print("  pip install flask")
except Exception as e:
    print(f"✗ Unexpected error: {e}")
    import traceback
    traceback.print_exc()
