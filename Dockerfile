FROM node:14
WORKDIR /usr/src/app
COPY . .
# RUN npm install -g npm
# RUN npm install
# RUN npm run build
EXPOSE 3000
ENTRYPOINT ["./scripts/run.sh"]
