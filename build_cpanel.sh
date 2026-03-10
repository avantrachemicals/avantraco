#!/bin/bash
# Avantra Chemicals - Build script for cPanel deployment

set -e

echo "================================"
echo "Avantra Chemicals Build Script"
echo "================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create build directory
BUILD_DIR="./cpanel_deploy"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR/backend
mkdir -p $BUILD_DIR/frontend

echo -e "${BLUE}Building frontend...${NC}"

# Build React frontend
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

# Copy frontend build
cp -r frontend/build/* $BUILD_DIR/frontend/
cp frontend/public/.htaccess $BUILD_DIR/frontend/

echo -e "${BLUE}Preparing backend...${NC}"

# Copy backend files
cp backend/server.py $BUILD_DIR/backend/
cp backend/models.py $BUILD_DIR/backend/
cp backend/passenger_wsgi.py $BUILD_DIR/backend/

# Create minimal requirements.txt for cPanel
cat > $BUILD_DIR/backend/requirements.txt << 'EOF'
fastapi==0.110.1
uvicorn==0.29.0
sqlalchemy==2.0.48
pymysql==1.1.2
pyjwt==2.8.0
python-multipart==0.0.9
python-dotenv==1.0.1
EOF

echo -e "${BLUE}Creating deployment package...${NC}"

# Copy installation guide
cp CPANEL_INSTALL.md $BUILD_DIR/

# Create zip file
cd $BUILD_DIR
zip -r ../avantra_cpanel_deploy.zip .
cd ..

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Build Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Deployment package created: avantra_cpanel_deploy.zip"
echo ""
echo "Contents:"
echo "  - backend/     : Upload to your Python app root"
echo "  - frontend/    : Upload contents to public_html"
echo "  - CPANEL_INSTALL.md : Installation instructions"
echo ""
echo "Next steps:"
echo "1. Extract the zip file"
echo "2. Follow CPANEL_INSTALL.md for installation"
echo ""
