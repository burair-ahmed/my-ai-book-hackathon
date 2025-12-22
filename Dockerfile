FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements first
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code and scripts
COPY backend ./backend
COPY scripts ./scripts
COPY docs /app/docs

# Environment variables
ENV PORT=7860
ENV PYTHONPATH=/app/backend

EXPOSE 7860

CMD ["python", "backend/main.py"]
