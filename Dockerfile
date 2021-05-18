FROM node:12.18-alpine
ENV NODE_ENV=production
ENV HOST_URL=https://abyss.eve-nt.uk/api/killmail/push
ENV PASSCODE=ur_mom
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
