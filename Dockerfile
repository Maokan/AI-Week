# Base Image
FROM node:20-alpine

#supplementary informations for image's metadata
LABEL maintainer="dockerfile pour ai-week (enfin j'crois(pas sur mais j'suis quasi sur d'être sur que je crois))"

# environement
#ENV NODE_ENV=production

# switch to the project, repertory
WORKDIR /app

# get informations about the project
COPY package.json ./

# install NPM
RUN npm install

# get all the project's files
COPY . .

# use port 3000
EXPOSE 3000

# launch command
CMD ["npm", "run", "dev", "--", "--host", "--port", "3000"]
 