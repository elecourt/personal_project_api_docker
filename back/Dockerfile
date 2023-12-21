FROM node:18-alpine

WORKDIR /back

COPY package.json ./
RUN npm install 
COPY . .
EXPOSE 9000
VOLUME /back/logs

CMD npm run dev