# Step 1: Build Frontend
FROM node:20 AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Final Image
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements first for better caching
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code and scripts
COPY backend ./backend
COPY scripts ./scripts

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/build ./build

# Environment variables setup (can be overridden in HF)
ENV PORT=7860
ENV PYTHONPATH=/app/backend

# Expose the standard HF Space port
EXPOSE 7860

# Command to run the unified application
CMD ["python", "backend/main.py"]
