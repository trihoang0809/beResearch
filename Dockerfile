FROM node:19-alpine
 
COPY package.json /app/
COPY testlocateapi.js /app/
COPY testlocateapi.test.js /app/

WORKDIR /app
 
RUN npm install
 
CMD [ "node", "testlocateapi.js" ]
