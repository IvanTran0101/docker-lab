FROM node:20-alpine

# App Runner will provide PORT at runtime; app should listen on process.env.PORT
ENV NODE_ENV=production

WORKDIR /app

# Install dependencies first (better layer cache)
COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 3000
CMD ["node", "main.js"]
