# Use a stable Node.js version
FROM node:18.16.0

# Set working directory
WORKDIR /app

# Copy package.json (but NOT package-lock.json, since it's missing)
COPY package.json ./

# Force install dependencies even if package-lock.json is missing
RUN npm install --legacy-peer-deps && npm cache clean --force

# Copy the rest of the application files
COPY . . 

# Expose the necessary port
EXPOSE 4002  

# Start the server
CMD ["node", "server.js"]
