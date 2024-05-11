<<<<<<< HEAD
# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of the application files to the working directory
COPY . .

# Run Prisma generate
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
=======
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
>>>>>>> git/master
