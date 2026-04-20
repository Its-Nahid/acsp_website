# 🐾 ACSP Website — Animal Care and Support Platform

[![Website](https://img.shields.io/badge/Platform-Web-blue)](https://github.com/Its-Nahid/ACSP-Website)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green)](https://github.com/Its-Nahid/ACSP-Website)
[![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen)](https://www.mongodb.com/)
[![Language](https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-orange)](https://developer.mozilla.org/)
[![Status](https://img.shields.io/badge/Status-Active-success)]()

A modern web application designed to streamline animal rescue and support operations.  
ACSP enables users to report animals in need, upload photos, and interact with a responsive frontend while maintaining secure user authentication and backend database management.

---

## 🏗 Project Structure

- **/Backend**: Node.js and Express server handling API requests and database interactions.
  - `server.js`: Main entry point for the backend.
  - `models/`: Mongoose schemas for User, RescueReport, and Donation.
  - `uploads/`: Directory for storing uploaded photos.
- **/Frontend**: Client-side files.
  - `index.html`: Main landing page with navigation and emergency contacts.
  - `login.html` & `signup.html`: User authentication pages.
  - `report.html`: Rescue reporting form with photo upload support.
  - `donations/donation.html`: Dynamic SSL Commerz payment form with cause selection.
  - `donations/success.html`, `donations/fail.html`, `donations/cancel.html`: Payment gateway resolution redirects.
  - `adoptionpage.html`: Dynamic pet adoption gallery with filtering and pagination.
  - `adoption_form.html`: Interactive multi-photo listing form for pets.
  - `components.js`: Shared component library for unified UI headers/footers.
  - `rescuse.html`: Information related to rescue operations.
  - `forgot-password.html`: Placeholder for password recovery.
  - `script.js`: Unified JavaScript for frontend logic and API integration.
  - `css/`: Stylesheets.

## ✨ Implemented Features

### 1. User Authentication

- **Signup & Login:** Secure registration and login with encrypted passwords (`bcryptjs`) and JWT-based session management.
- **Frontend Integration:** Connected forms using `fetch` API for smooth interaction.
- **State Management:** Authentication status stored in `localStorage` for session persistence.

### 2. Rescue Reporting System

- **Report Submission:** Capture details such as animal type, category, urgency, and location.
- **Photo Uploads:** Support up to 5 images per report using `multer`; stored in `Backend/uploads/`.
- **Database Storage:** Reports saved in MongoDB (`acspAuth` database).
- **Confirmation:** Dynamic success modal confirms report submission.

### 3. Frontend Logic & UI

- **Unified JavaScript:** `script.js` manages forms, uploads, and dynamic UI updates.
- **Dynamic Feedback:** Toast notifications for success/error messaging.
- **Modern UI:** Tailwind CSS combined with Google Material Symbols for responsive design.

### 4. Secure Donation Gateway

- **SSL Commerz Integration:** Integrated `sslcommerz-lts` for handling secure payment processing and initialization.
- **Dynamic Cause Selection:** Donors can visually select specific animal causes or NGO partners via interactive UI cards linked to database tags.
- **Smart Payment Inputs:** Preset donation amount buttons feature elegant override mechanics when custom financial inputs are typed.
- **Database Tracking:** Every transaction persistently stores contextual donor information (Name, Phone, Location, Transaction ID, Status) into the updated MongoDB ecosystem.

### 5. Pet Adoption Marketplace

- **Dynamic Gallery:** Real-time data fetching from MongoDB to display pet listings with status badges (Vaccinated, Neutered).
- **Listing Submission:** Sophisticated form for posting pets including multi-photo uploads (max 5) and health/personality profiling.
- **UI Consistency:** Leverages a custom shared component system (`components.js`) for a unified experience across the portal.
- **Success Experience:** Beautiful, animated success modal with refresh protection for stable form submissions.

---

## 🔧 Pending / In Progress

- Navigation links to **NGO Directory and Treatment** pages currently point to placeholders and require full implementation.
- Backend logic for **forgot-password** functionality.

---

## ⚙️ Tech Stack

| Layer        | Technology                                |
| ------------ | ----------------------------------------- |
| Backend      | Node.js, Express.js                       |
| Database     | MongoDB, Mongoose                         |
| File Uploads | Multer                                    |
| Auth         | JWT, BcryptJS                             |
| Frontend     | HTML5, CSS3 (Tailwind), JavaScript (ES6+) |
| Misc         | CORS, Fetch API, SSL Commerz              |

---

## How to Run

1. **Backend**:
   - Navigate to `Backend/` directory.
   - Run `npm install`.
   - Start the server: `node server.js` (Server runs on port 5000).
2. **Frontend**:
   - Open `Frontend/index.html` in a web browser.
   - Ensure the backend is running for auth and reporting features to work

---

## 🐛 Known Issues

- Forgot-password feature not yet implemented.
- Some frontend navigation links point to placeholder pages.
- File upload limit per report is capped at 5 images.

## 🧠 What I Learned

- **Full-stack integration:** Connecting Node.js backend with MongoDB and a dynamic frontend.
- **Payment Verification:** Synchronizing webhooks, backend REST states, and external payment APIs seamlessly via SSL Commerz.
- **Authentication & Security:** Implementing JWT-based sessions and secure password storage.
- **File uploads:** Handling images with `multer` and storing them reliably in the backend.
- **Frontend-Backend interaction:** Using `fetch` API for asynchronous form submissions.
- **Modern UI design:** Utilizing Tailwind CSS for responsive and clean design patterns.

## 👨‍💻 Author

**Nahid**  
GitHub: [https://github.com/Its-Nahid](https://github.com/Its-Nahid)

⭐ If you find this project useful, consider **starring the repository** to support development.
