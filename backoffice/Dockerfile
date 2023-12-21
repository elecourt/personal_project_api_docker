FROM node:18-alpine AS build-stage

WORKDIR /backoffice

COPY ./package.json ./
RUN npm install 

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build-stage /backoffice/dist /usr/share/nginx/html
EXPOSE 80
VOLUME /backoffice/logs

CMD ["nginx", "-g", "daemon off;"]