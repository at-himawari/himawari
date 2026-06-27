FROM node:22-bookworm

WORKDIR /opt/app

ENV NODE_ENV=development

COPY package.json package-lock.json* ./
RUN npm install

COPY config ./config
COPY src ./src

EXPOSE 1337

CMD ["npm", "run", "develop"]
