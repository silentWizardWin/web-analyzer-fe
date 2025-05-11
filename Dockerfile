# node image
FROM node:18

# set working directory
WORKDIR /app

# copy source files
COPY . .

# install dependencies
RUN npm install

# build app
RUN npm run build

# start app
CMD ["npm", "start"]
