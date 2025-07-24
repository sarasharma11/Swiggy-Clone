# Dockerfile for React client

# install the image of the Node.js version.
# Build react client
FROM node:17

# Working directory be app
WORKDIR /frontend

# copy package.json file to the container
COPY package.json .

###  Installing dependencies
RUN npm install 

# copies all the files inside the project directory.
COPY . .

# after the image is built, the product will be stored in build folder.
RUN npm run build
RUN npm install -g serve

# CMD ["npm","start"]
CMD serve -s build


