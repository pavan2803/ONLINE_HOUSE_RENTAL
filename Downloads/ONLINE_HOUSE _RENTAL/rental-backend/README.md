# Rental Backend

Online House Rental & Tenant Management System Backend

## Tech Stack
- Node.js
- TypeScript
- Express
- Sequelize ORM
- MySQL

## Setup
1. Copy `.env` and set your MySQL credentials.
2. Run `npm install`.
3. Run `npm run dev` for development or `npm run build && npm start` for production.

## API Endpoints
- `GET /api/properties` — List all properties
- `GET /api/properties/:id` — Get property details
- `POST /api/properties` — Create property (owner)
- `GET /api/bookings` — List all bookings
- `POST /api/bookings` — Create booking (tenant)
- `PATCH /api/bookings/:id` — Approve/Reject booking (owner)

## Validation
- Property title/location required, rent > 0
- Booking must have propertyId and tenantId
- Booking status: Pending/Approved/Rejected
