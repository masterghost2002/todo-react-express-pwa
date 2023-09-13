FROM node:current-alpine as build
WORKDIR /app
RUN npm install yarn 
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build
FROM nginx:1.19-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80