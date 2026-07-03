# Cab Booking — MERN Stack Application

Full-stack cab booking app built with MongoDB, Express, React (Vite), and Node.js, following the MVC pattern, ER diagram, roles, and features specified in the project brief — **including the Driver role**, scheduling, rescheduling/cancellation, receipts, and admin reports.

## Project Structure

```
cab-booking/
├── client/                 # React frontend (Vite)
│   └── src/
│       ├── user/           # Home, Login, Register, Uhome, Cabs, BookCab, MyBookings
│       ├── admin/          # Alogin, Ahome, Users, UserEdit, Acabs, Acabedit, Addcar, Bookings, Drivers, Reports
│       ├── driver/         # Dlogin, Dregister, Dhome, DriverEarnings
│       ├── components/     # UserNavbar, AdminNavbar, DriverNavbar, ProtectedRoute
│       ├── AuthContext.jsx # Auth state (token, role: user/admin/driver) via localStorage
│       ├── api.js          # Axios instance with auto JWT header
│       └── App.jsx         # All routes
└── server/                 # Express backend
    ├── models/             # UserSchema, AdminSchema, DriverSchema, CarSchema, MyBookingSchema
    ├── controllers/        # user, admin, car, booking, driver
    ├── routes/              # userRoutes, adminRoutes, carRoutes, bookingRoutes, driverRoutes
    ├── middlewares/        # authMiddleware (user/admin/driver role checks) + multer (image upload)
    ├── db/config.js         # MongoDB connection
    └── server.js            # Entry point
```

## ER Diagram → Schema Mapping

- **User – Ride**: One-to-Many. `MyBooking.user` references `User._id`.
- **Ride – Driver** (Assigned To): Many-to-One. `MyBooking.driver` references `Driver._id`.
- **Driver – Vehicle**: One-to-One. `Driver.car` references `Car._id`. Admin assigns a car to a driver from the **Drivers** page.
- `CarSchema` still carries a denormalized `driverName` field for backward compatibility with the original UI cards, but the **real** driver relationship now lives in `DriverSchema`/`MyBookingSchema.driver`.

## Roles & What Each One Can Do

### User (Rider)
- Register / Login
- Browse available cabs, search/sort by name, type, price
- Book a cab — instant or **scheduled for later** (checkbox on Book a Ride)
- View ride history in **My Bookings**
- **Reschedule** or **cancel** a Pending booking
- **Download a receipt** (plain-text file) for any booking

### Driver *(new)*
- Register / Login (separate auth, own JWT role: `driver`)
- Gets a vehicle assigned by admin (Driver–Vehicle one-to-one)
- Views all rides assigned to them (**My Assigned Rides**)
- **Accepts or rejects** a ride request — rejecting unassigns the ride so admin can reassign it
- Updates ride status (On the Way → Completed)
- Views **earnings** and completed-ride history; completing a ride credits the driver's total earnings

### Admin
- Login (seed via one-time API call — see below)
- **Dashboard**: live Users / Cabs / Bookings / Drivers counts + bar chart
- **Users**: view, edit, delete
- **Drivers** *(new)*: view all drivers, assign a car to an unassigned driver, remove a driver
- **Cabs**: add (with image upload), edit, delete, search/sort; vehicle categories (Mini/Sedan/SUV/etc.) are suggested from existing cars when adding a new one
- **Bookings**: view all rides, assign/reassign a driver, change ride status, cancel a ride
- **Reports & Analytics** *(new)*: total revenue, booking status breakdown, top-performing cars

## Setup Instructions

### 1. Backend (server)

```bash
cd server
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET
npm run dev      # starts on http://localhost:8000 (requires nodemon)
```

Make sure MongoDB is running locally (or point `MONGO_URI` at Atlas).

**Seed an admin account** (one-time, no public admin signup page by design):
```bash
curl -X POST http://localhost:8000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@ucab.com","password":"admin123"}'
```

### 2. Frontend (client)

```bash
cd client
npm install
npm run dev      # starts on http://localhost:5173
```

### 3. Using the app end-to-end

1. **Admin** logs in at `/admin/login` → Add Cab(s) on the **AddCab** page.
2. A **Driver** registers at `/driver/register`, then logs in at `/driver/login` (shows "no vehicle assigned" until step 3).
3. **Admin** goes to **Drivers** page → assigns the new driver to one of the cars added in step 1.
4. A **User** registers/logs in → Browse Cabs → Book Cab (the car now linked to a driver). The booking is created with that driver attached and `driverRequestStatus: "Awaiting"`.
5. **Driver** logs in → sees the ride under **My Assigned Rides** → Accept (or Reject, which sends it back to admin to reassign).
6. **Driver** marks the ride **Completed** when done → fare is added to their **Earnings**.
7. **User** can see the live status in **My Bookings**, reschedule/cancel while it's Pending, or download a receipt any time.
8. **Admin** can monitor everything from **Bookings** (reassign drivers, override status, cancel) and **Reports** (revenue, status breakdown, top cars).

## API Overview

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/users/register, /api/users/login | Public |
| GET/PUT/DELETE | /api/users/:id | Admin |
| POST | /api/admin/register, /api/admin/login | Public (register once to seed) |
| GET | /api/admin/dashboard | Admin |
| GET | /api/admin/reports | Admin |
| GET | /api/cars | Public |
| GET | /api/cars/categories | Public |
| POST/PUT/DELETE | /api/cars/:id | Admin |
| POST | /api/drivers/register, /api/drivers/login | Public |
| GET | /api/drivers/profile, /api/drivers/rides, /api/drivers/earnings | Driver |
| PUT | /api/drivers/rides/:id/respond | Driver (accept/reject) |
| PUT | /api/drivers/rides/:id/status | Driver (On the Way / Completed) |
| GET | /api/drivers | Admin |
| PUT | /api/drivers/:id/assign-car | Admin |
| DELETE | /api/drivers/:id | Admin |
| POST | /api/bookings | User |
| GET | /api/bookings/my | User |
| GET | /api/bookings | Admin |
| GET | /api/bookings/:id, /api/bookings/:id/receipt | User (own) / Admin |
| PUT | /api/bookings/:id/status | Admin |
| PUT | /api/bookings/:id/assign-driver | Admin |
| PUT | /api/bookings/:id/reschedule | User (own, Pending only) |
| DELETE | /api/bookings/:id | User (own) / Admin |

## Notes

- Fare is calculated as `price-per-km × estimated distance` (placeholder logic — swap in a real maps/distance API if needed).
- Car images are stored in `server/uploads/` and served statically at `/uploads/<filename>`.
- Receipts are generated client-side as a downloadable `.txt` file from data returned by `/api/bookings/:id/receipt`; swap in a PDF library (e.g. `pdfkit`) server-side if you want a polished PDF instead.
- Driver auto-assignment at booking time picks whichever driver is currently linked to the chosen car. If no driver is linked yet, the booking is created unassigned and shows up on the admin Bookings page with an "Assign driver…" dropdown.
- This is a development build — for production, add input validation (e.g. Joi/Zod), rate limiting, and HTTPS.
