FROM node:14

WORKDIR /app

COPY app/package*.json ./
RUN npm install

COPY . .

# Use nodemon in development mode, otherwise start the app normally
CMD ["npm", "run", "dev"]
