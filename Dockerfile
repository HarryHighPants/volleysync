# Set the base image to the official Node.js 16 image for ARM64v8 architecture
FROM arm64v8/node:16-bullseye-slim

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Set the command to run the application
CMD ["npm", "start"]
