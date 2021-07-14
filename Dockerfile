FROM node:14.17-alpine AS builder

WORKDIR /usr/src/app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
RUN npm install --silent

COPY . ./

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /usr/src/app/build . 

ENTRYPOINT ["nginx", "-g", "daemon off;"]