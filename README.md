# 🖥️ PC Repair System

A fullstack PC repair inventory and management system built using Django (backend) and React (frontend). Designed to run on LAN with one local server and multiple clients.

## 📁 Project Structure

```
pc-repair-system/
├── backend/
└── frontend/
```

## ⚙️ Backend Setup (Django + PostgreSQL) – Windows

1. Clone the repository and go to the backend folder

```
git clone https://github.com/yohanness16/pc-repair-system.git
cd pc-repair-system\backend
```

2. Create and activate a virtual environment

```
python -m venv env
env\Scripts\activate
```

3. Install dependencies

```
pip install -r requirements.txt
```

4. Create `.env` file

```
type nul > .env
```

Paste this into `.env` file

```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
DATABASE_NAME=your_db_name
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=your_db_host
DATABASE_PORT=5432
```

🔑 To generate your own Django `SECRET_KEY`, run this command in a Python shell:

```
python
```

Then inside the shell:

```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Copy the printed key and replace `your-secret-key` in the `.env` file.

5. Apply migrations

```
python manage.py makemigrations
python manage.py migrate
```

6. Create admin user

```
python manage.py createsuperuser
```

7. Start the server

```
python manage.py runserver
```

## 🌐 Frontend Setup (React + Vite + pnpm) – Windows

1. Go to the frontend folder

```
cd ..\frontend
```

2. Install dependencies

```
pnpm install
```

3. Create `.env.local` file

```
type nul > .env.local
```

Paste this into `.env.local` file

```
VITE_API_URL=http:'django server address'
```

4. Start the frontend server

```
pnpm run dev
```

## 📝 Contributor Notes

- Backend: Django + PostgreSQL
- Frontend: React + TailwindCSS + Framer Motion
- Requires manual `.env` setup
- Recommended Node version: 18 or higher
- Install pnpm globally if not already

```
npm install -g pnpm
```

## 📬 Contact

Author: Yohannes  
GitHub: https://github.com/yohanness16
