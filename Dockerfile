# Base Image
FROM node:22-alpine

# switch to the project, repertory
WORKDIR /app

# get informations about the project (inclure yarn.lock est indispensable)
COPY package.json yarn.lock* ./

# install NPM -> on remplace par YARN comme décidé
RUN yarn install

# get all the project's files
COPY . .

# Générer le client Prisma pour la BDD (si on ne le fait pas, le backend crashe)
RUN yarn prisma generate

# use ports for Vite and Express
EXPOSE 5173 3001

# launch command
CMD ["yarn", "run", "dev"] 