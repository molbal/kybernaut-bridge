FROM node:12.18-alpine
ENV NODE_ENV=production
ENV HOST_URL=http://127.0.0.1:8000/api/killmail/push
ENV PASSCODE=ur_mom
ENV REGION_IDS=12000001;12000002;12000003;12000004;12000005;10000002
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
