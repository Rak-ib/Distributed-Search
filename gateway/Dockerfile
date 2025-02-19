# Use a stable Node.js version
FROM node:18.16.0

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies first
COPY package.json ./ 
RUN npm install --legacy-peer-deps

# Copy all files, including swagger.yaml
COPY . .

# 🔥 Fix: Expose correct port
EXPOSE 5000  

# Start the server
CMD ["node", "server.js"]
