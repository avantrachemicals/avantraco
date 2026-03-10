import os
import sys
import subprocess

# Auto-install dependencies on first run
req_file = os.path.join(os.path.dirname(__file__), 'requirements.txt')
marker_file = os.path.join(os.path.dirname(__file__), '.deps_installed')

if os.path.exists(req_file) and not os.path.exists(marker_file):
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', req_file, '--quiet'])
        with open(marker_file, 'w') as f:
            f.write('ok')
    except Exception as e:
        print(f"Warning: Could not auto-install dependencies: {e}")
        print("Please run manually: pip install -r requirements.txt")

from server import app

# Phusion Passenger expects 'application'
application = app
