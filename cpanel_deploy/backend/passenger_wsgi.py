"""
Passenger WSGI entry point for cPanel Python App
"""
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from server import app

# Passenger expects 'application' as the WSGI callable
application = app
