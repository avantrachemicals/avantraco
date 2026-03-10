#!/bin/bash
# Build Avantra Chemicals deployment package
set -e

echo "=== Building Avantra Chemicals Deployment Package ==="

DIST_DIR="/tmp/avantra_deploy"
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR/public"

# Copy backend files
echo "Copying backend files..."
cp /app/backend/server.py "$DIST_DIR/"
cp /app/backend/models.py "$DIST_DIR/"
cp /app/backend/passenger_wsgi.py "$DIST_DIR/"
cp /app/backend/requirements.txt "$DIST_DIR/"
cp /app/backend/.htaccess "$DIST_DIR/"

# Copy built frontend into public/
echo "Copying frontend build..."
cp -r /app/frontend/build/* "$DIST_DIR/public/"

# Create README
cat > "$DIST_DIR/README.txt" << 'EOF'
====================================
  AVANTRA CHEMICALS - INSTALLATION
====================================

3 SIMPLE STEPS:

STEP 1: cPanel Setup
  - Go to cPanel > "Setup Python App"
  - Click "CREATE APPLICATION"
  - Python version: 3.9+ (3.11 recommended)
  - Application root: avantra (or your folder name)
  - Startup file: passenger_wsgi.py
  - Entry point: application
  - Click CREATE

STEP 2: Upload Files
  - Upload this entire folder content to the Application root
  - (Use File Manager or FTP)
  - Make sure ALL files are in the application root folder

STEP 3: Install & Configure
  - Create a MySQL database in cPanel > MySQL Databases
  - Visit: https://yourdomain.com/api/install
  - Fill in your MySQL credentials and admin password
  - Click Install - Done!

ACCESS:
  - Website: https://yourdomain.com
  - Admin Panel: https://yourdomain.com/admin
  - Use the admin password you set during installation

NOTE: Dependencies install automatically on first visit.
If you get errors, run this in cPanel Terminal:
  source /home/YOUR_USER/virtualenv/avantra/3.11/bin/activate
  pip install -r requirements.txt
  
Then restart the Python app in cPanel.
====================================
EOF

# Create the zip
echo "Creating zip package..."
cd /tmp
rm -f /app/avantra_deploy.zip
cd "$DIST_DIR"
zip -r /app/avantra_deploy.zip . -x "*.pyc" "__pycache__/*"

echo ""
echo "=== Package created: /app/avantra_deploy.zip ==="
echo "Contents:"
ls -la /app/avantra_deploy.zip
echo ""
echo "Files included:"
unzip -l /app/avantra_deploy.zip | tail -5
