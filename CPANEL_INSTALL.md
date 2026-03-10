# Avantra Chemicals - Installation Guide

## 3 Steps to Install

---

### Step 1: Create Python App in cPanel

1. Login to **cPanel**
2. Go to **"Setup Python App"** (under Software section)
3. Click **CREATE APPLICATION**
4. Set these values:
   - **Python version**: `3.9` or higher (3.11 recommended)
   - **Application root**: `avantra`
   - **Application URL**: your domain
   - **Startup file**: `passenger_wsgi.py`
   - **Entry point**: `application`
5. Click **CREATE**

---

### Step 2: Upload & Extract

1. Download the **`avantra_deploy.zip`** file
2. In cPanel, go to **File Manager**
3. Navigate to the **Application root** folder (e.g., `/home/youruser/avantra/`)
4. Click **Upload** → upload `avantra_deploy.zip`
5. Select the zip → click **Extract** → Extract to current folder
6. Make sure all files (`server.py`, `models.py`, `passenger_wsgi.py`, `public/` folder, etc.) are directly inside the application root

---

### Step 3: Run Web Installer

1. Create a **MySQL database** in cPanel:
   - Go to **MySQL Databases**
   - Create database (e.g., `avantra_db`)
   - Create user + assign **ALL PRIVILEGES**
2. Open your browser: **`https://yourdomain.com/api/install`**
3. Fill in:
   - Your domain URL
   - MySQL database details
   - Choose an **admin password**
4. Click **Install** — Done!

---

## Access Your Site

| What | URL |
|------|-----|
| Website | `https://yourdomain.com` |
| Admin Panel | `https://yourdomain.com/admin` |
| Install Wizard | `https://yourdomain.com/api/install` |

---

## Troubleshooting

**Dependencies not installing automatically?**
Open cPanel **Terminal** and run:
```
source /home/YOUR_USER/virtualenv/avantra/3.11/bin/activate
pip install -r /home/YOUR_USER/avantra/requirements.txt
```
Then restart the Python app.

**500 error?**
Check cPanel **Error Logs** and make sure the Python app is running.

**Blank page?**
Make sure the `public/` folder with `index.html` is inside the application root.
