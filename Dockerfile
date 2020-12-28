FROM node:14
WORKDIR /usr/src/app
COPY . .
ENTRYPOINT ["./scripts/run.sh"]
