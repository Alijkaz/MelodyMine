FROM node:18-alpine

RUN apk add --no-cache \
    openssl \
    libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

COPY . .

RUN npm install

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
