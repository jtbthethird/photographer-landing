FROM mhart/alpine-node:6

WORKDIR /src
ADD . .

EXPOSE 80

RUN npm install
CMD [ "npm", "start" ]
