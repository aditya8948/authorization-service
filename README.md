# Authorization Service

This is a small Node.js authorization service for a flight booking system. It handles user signup, signin, JWT based authentication, role assignment, and also works as a gateway proxy for the flight and booking services.

The code is intentionally simple: Express for the API layer, Sequelize for MySQL models, bcrypt for password hashing, and JWT for auth tokens.

## What It Does

- Creates users with encrypted passwords.
- Assigns new users the `customer` role by default.
- Signs users in and returns a JWT.
- Verifies JWT tokens for protected routes.
- Supports both `x-access-token` and `Authorization: Bearer <token>`.
- Allows admins to assign roles to users.
- Proxies requests to the flight service and booking service.

## Project Structure

```text
src/
  config/        app, database, and logger config
  controllers/   request handlers
  middlewares/   auth and request validation middleware
  migrations/    Sequelize migrations
  models/        Sequelize models
  repositories/  database access layer
  routes/        API route definitions
  seeders/       initial role data
  services/      business logic
  utils/         common helpers and errors
```

## Environment Variables

Create a `.env` file in the project root. These values are required when the app starts:

```env
PORT=5000
SALT_ROUND=10
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=1d
FLIGHT_SERVICE=http://localhost:3000
BOOKING_SERVICE=http://localhost:4000
```

The app validates these values on startup, so missing or invalid config will fail fast instead of causing confusing runtime errors later.

## Database Setup

This project uses Sequelize with MySQL. Update `src/config/config.json` for your local database username, password, database name, host, and dialect.

Then run:

```bash
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
```

The seeder adds the default roles used by the service:

- `admin`
- `customer`
- `flight_company`

## Running Locally

Install dependencies:

```bash
npm install
```

Start normally:

```bash
npm start
```

Start in development mode with nodemon:

```bash
npm run dev
```

## Main API Routes

Base path:

```text
/api/v1
```

Health check:

```text
GET /api/v1/info
```

Create user:

```text
POST /api/v1/user/signup
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Signin:

```text
POST /api/v1/user/signin
```

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Add role to user:

```text
POST /api/v1/user/role
```

Headers:

```text
x-access-token: <jwt>
```

or:

```text
Authorization: Bearer <jwt>
```

Request body:

```json
{
  "id": 1,
  "role": "admin"
}
```

The role endpoint is protected and requires the authenticated user to already have the `admin` role.

## Service Proxy Routes

Flight service requests:

```text
/flightService/*
```

Booking service requests:

```text
/bookingService/*
```

The proxy removes the service prefix before forwarding the request to the configured service URL.

## Notes

This service is meant to stay focused on authorization. Keep user auth, role checks, and gateway auth concerns here; keep flight and booking business logic in their own services.
