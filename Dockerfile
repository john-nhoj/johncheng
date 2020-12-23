ARG BASEIMAGE=node:14

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Copying source files
COPY . .

# Running the app
ENTRYPOINT ["./scripts/run.sh"]
