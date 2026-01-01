# Rental Backend API Documentation

## Authentication
- `POST /api/auth/register` — Register user (name, email, password, role)
- `POST /api/auth/login` — Login (email, password) → JWT token

## Properties
- `GET /api/properties` — List all properties (filters: location, minRent, maxRent, amenities)
- `GET /api/properties/:id` — Get property details
- `POST /api/properties` — Create property (owner only, JWT required)

## Bookings
- `GET /api/bookings` — List bookings (tenant: own, owner: for owned properties)
- `POST /api/bookings` — Create booking (tenant only, JWT required)
- `PATCH /api/bookings/:id` — Approve/Reject booking (owner only, JWT required)

## WebSocket
- Connect to ws://<host>:<port>/?token=JWT for real-time updates

## Validation & Error Handling
- All endpoints return proper HTTP status codes and error messages
- Validation for required fields, booking conflicts, and role access

## Roles
- owner: Manage properties, approve/reject bookings
- tenant: Search/book properties, view own bookings
- admin: (future) Analytics, user management
