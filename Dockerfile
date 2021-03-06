FROM node:12.18-alpine
ENV NODE_ENV=production
ENV HOST_URL=http://host.docker.internal:8000/api/killmail/push
ENV PASSCODE=ur_mom
ENV REGION_IDS=12000001;12000002;12000003;12000004;12000005;10000002;10000001;10000003;10000004
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
CMD ["npm", "start"]
