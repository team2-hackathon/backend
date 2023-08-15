FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install

# For development
RUN npm install -g nodemon

COPY . .
EXPOSE 8080
CMD ["npm", "start"]
