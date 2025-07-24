# install the image of the Node.js version.
FROM node:16

# path of the working directory.
WORKDIR /backend

#  copy package.json file to the container
COPY package.json .

# install the dependencies
RUN npm install

# copies all the files inside the project directory.
COPY . .

# run script after image is built
CMD ["npm", "run", "server"]

