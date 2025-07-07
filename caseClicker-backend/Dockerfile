# --- Dockerfile ---
FROM python:3.10-slim

WORKDIR /app

# Najpierw kopiujemy tylko requirements, by cachować tę warstwę
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Teraz kopiujemy cały kod
COPY . .

# Ustaw zmienną, żeby Python nie buforował wyjścia
ENV PYTHONUNBUFFERED=1

# Domyślna komenda: migracje + runserver
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
