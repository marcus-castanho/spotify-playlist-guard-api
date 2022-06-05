FROM node:16 AS development
ENV NODE_ENV=development
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run build

FROM node:16 AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm set-script prepare ""
RUN npm install --only=production
COPY . .
COPY --from=development /usr/src/app/dist ./dist
EXPOSE 3000
CMD [ "node", "dist/main" ]