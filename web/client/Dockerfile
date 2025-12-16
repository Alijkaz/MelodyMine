FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY . .

RUN apk add --no-cache openssl1.1-compat \
    && npm install

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
