

Single-Page Application for event management, designed for an organizer to manage events and attendees.
Includes authentication, protected routes, session persistence, and CRUD operations against a mock database (json-server).

## 🚀 Features

✅ User registration and login (roles: administrator and visitor).
✅ Protected routes based on authentication and role.
✅ Session persistence in localStorage.
✅ Full CRUD of events.
✅ Visitors can register for events (if they are not full).
✅ Responsive UI adapted to the guide design.
✅ Automatic redirection on invalid routes (not-found.html).
✅ Administrator and visitor users have separate views and permissions.

🗂️ Project Structure

/css/styles.css -> Styles adapted to the design guide
/js/app.js -> Authentication logic, routes, CRUD
/db.json -> Test data for json-server
/index.html -> Initial view
/login.html -> Login
/register.html -> Registration
/dashboard.html -> Main dashboard
/not-found.html -> 
/README.md -> This file

## 🧪 Test users
Administrator:

Email: admin@admin.com

Password: 1234

Role: Administrator

Included in db.json by default.

Visitor:

Must register from the registration view (register.html).

## ⚙️ Installation and Runtime

1️⃣ Install Dependencies

npm install

2️⃣ Launch json-server

npx json-server --watch db.json --port 3000

This will expose the mock API at:
http://localhost:3000/

3️⃣ Serve the SPA
Open index.html directly or

🌐 Main Routes
Home / Dashboard (authenticated): /dashboard.html

Create Event (admin): /dashboard/events/create.html

Edit Event (admin): /dashboard/events/edit.html

Page not found: /not-found.html

If a visitor attempts to access administrative routes, they will be redirected to not-found.html.

If an authenticated user attempts to access /login.html or /register.html, they will be redirected to /dashboard.html.