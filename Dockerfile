# FROM node:14
# WORKDIR /usr/src/app
# COPY . .
# EXPOSE 3000
# RUN ls -alp
# RUN pwd
# RUN npm run start

FROM nginx:latest
