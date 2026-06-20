FROM node:20-bullseye-slim

# Install Python and dependencies required for OpenCV
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set up backend directory
WORKDIR /app/backend

# Copy and install python requirements
COPY backend/requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy Node.js package.json and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy all backend files
COPY backend/ .

# Copy ai_service to make it available for the backend
COPY ai_service /app/ai_service

# Expose API port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
