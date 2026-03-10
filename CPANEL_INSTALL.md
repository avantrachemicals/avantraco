# Avantra Chemicals - cPanel Installation Guide

## Prerequisites
- cPanel hosting with **Setup Python App** feature
- MySQL database access
- FTP or File Manager access

---

## Step 1: Create MySQL Database

1. Login to cPanel
2. Go to **MySQL Databases**
3. Create a new database (e.g., `avantra_db`)
4. Create a new MySQL user (e.g., `avantra_user`) with a strong password
5. Add the user to the database with **ALL PRIVILEGES**
6. Note down:
   - Database name
   - Database username
   - Database password
   - Database host (usually `localhost`)

---

## Step 2: Setup Python App in cPanel

1. Login to cPanel
2. Go to **Setup Python App** (under Software section)
3. Click **CREATE APPLICATION**
4. Configure:
   - **Python version**: 3.9 or higher (3.11 recommended)
   - **Application root**: `avantra` (or your preferred folder name)
   - **Application URL**: Leave as your domain or subdomain
   - **Application startup file**: `passenger_wsgi.py`
   - **Application Entry point**: `application`
5. Click **CREATE**
6. Note the **virtual environment path** shown (you'll need it)

---

## Step 3: Upload Files

### Upload Backend Files
Upload these files to your **Application root** folder (e.g., `avantra/`):
- `server.py`
- `models.py`
- `passenger_wsgi.py`
- `requirements.txt`

### Upload Frontend Files
1. On your local machine, build the React app:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Upload the contents of `frontend/build/` folder to your **public_html** (or subdomain folder)
3. Make sure `.htaccess` is uploaded too

---

## Step 4: Install Python Dependencies

1. In cPanel, go back to **Setup Python App**
2. Click on your application
3. Click **Run pip install** or open **Terminal**
4. Activate virtual environment:
   ```bash
   source /home/YOUR_USERNAME/virtualenv/avantra/3.11/bin/activate
   ```
5. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## Step 5: Run Installation Wizard

1. Open your browser and go to: `https://avantra.co/api/install`
2. Fill in the form:
   - **Site URL**: `https://avantra.co`
   - **Database Host**: `localhost`
   - **Database Name**: Your database name
   - **Database Username**: Your database username
   - **Database Password**: Your database password
   - **Admin Password**: Choose a strong password
3. Click **Install Avantra Chemicals**
4. Wait for installation to complete
5. You'll be redirected to the homepage

---

## Step 6: Verify Installation

1. Visit `https://avantra.co` - should show the homepage
2. Visit `https://avantra.co/admin` - login with your admin password
3. Visit `https://avantra.co/products` - should show products page

---

## Folder Structure After Installation

```
/home/username/
├── avantra/                    # Python backend (Application root)
│   ├── server.py
│   ├── models.py
│   ├── passenger_wsgi.py
│   ├── requirements.txt
│   ├── config.json            # Created by installer
│   └── .installed             # Created by installer
│
└── public_html/               # React frontend (Web root)
    ├── index.html
    ├── static/
    │   ├── css/
    │   └── js/
    ├── .htaccess
    └── ... (other build files)
```

---

## Troubleshooting

### "Database not configured" error
- Make sure you ran the installer at `/install`
- Check if `config.json` was created in the backend folder

### 500 Internal Server Error
- Check cPanel Error Logs
- Make sure all Python dependencies are installed
- Verify Python version is 3.9+

### API calls fail
- Check if `.htaccess` is properly uploaded
- Verify the Python app is running in cPanel

### Images not loading
- Make sure image URLs are using HTTPS
- Check file permissions (should be 644 for files)

---

## Admin Panel Access

- URL: `https://avantra.co/admin`
- Password: The one you set during installation

---

## Support

For any issues, contact: support@avantra.co
