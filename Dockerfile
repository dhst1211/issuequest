# 1. build the front-end
FROM node:10-alpine AS build-react
RUN mkdir /temp-build
WORKDIR /temp-build
COPY client/package*.json ./
RUN npm install --silent
COPY client/. ./
RUN npm run build

# 2. prepare the back-end
FROM node:10-alpine
RUN mkdir /stars
WORKDIR /stars
COPY package*.json /stars/
COPY tsconfig*.json ./

RUN npm install -g typescript 
RUN npm install --slient
COPY . .
COPY --from=build-react /temp-build/build/ /stars/public/
# RUN npm run tsc


# 3. run this web-application
EXPOSE 3030
ENV NODE_ENV production

CMD [ "npm", "run", "start" ]
