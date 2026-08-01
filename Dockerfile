FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV PORT=3000 \
    SALT_ROUND=10 \
    JWT_SECRET=change_me \
    JWT_EXPIRY=1d \
    FLIGHT_SERVICE=http://flight-service:3000 \
    BOOKING_SERVICE=http://booking-service:4000
EXPOSE 3000

CMD ["npm", "start"]
