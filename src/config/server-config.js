const dotenv = require('dotenv');

dotenv.config();

const requiredEnvValues = [
    'PORT',
    'SALT_ROUND',
    'JWT_SECRET',
    'JWT_EXPIRY',
    'FLIGHT_SERVICE',
    'BOOKING_SERVICE'
];

const missingEnvValues = requiredEnvValues.filter((key) => !process.env[key]);

if (missingEnvValues.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missingEnvValues.join(', ')}`);
}

const port = Number(process.env.PORT);
const saltRounds = Number(process.env.SALT_ROUND);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT must be a valid port number');
}

if (!Number.isInteger(saltRounds) || saltRounds <= 0) {
    throw new Error('SALT_ROUND must be a positive integer');
}

function validateUrl(key) {
    try {
        new URL(process.env[key]);
    } catch (error) {
        throw new Error(`${key} must be a valid URL`);
    }
}

validateUrl('FLIGHT_SERVICE');
validateUrl('BOOKING_SERVICE');

module.exports = {
    PORT: process.env.PORT,
    SALT_ROUND: process.env.SALT_ROUND,
    JWT_SECRET : process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    FLIGHT_SERVICE: process.env.FLIGHT_SERVICE,
    BOOKING_SERVICE: process.env.BOOKING_SERVICE
}
