FROM node:14

# Create app directory
WORKDIR /src/app

# Install app dependencies
COPY package*.json /src/app/

RUN npm install
# If you are building your code for production

# Bundle app source
COPY . /src/app/

CMD [ "npm", "start" ]