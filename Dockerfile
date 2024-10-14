FROM node:20.18.0
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
RUN npx prisma generate
CMD ["npm", "start"]
