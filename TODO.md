This document tracks the implemented features and planned future enhancements for the Animal Care and Support Project (ACSP).

## ✅ COMPLETED (Implemented)

### Backend & Database

- [x] Initial Express.js server setup
- [x] MongoDB connection integration (`acspAuth` database)
- [x] User Schema implementation (Name, Email, Password, Role)
- [x] Rescue Report Schema with photo path storage
- [x] Password hashing with BcryptJS
- [x] JWT Token generation for secure authentication
- [x] Multer configuration for multi-photo uploads (max 5)
- [x] API Routes for /signup, /login, and /report
- [x] SSL Commerz Payment Gateway logic integration (`/api/donate/init`, `/success`, `/fail`, `/cancel`)
- [x] Dynamic Donation Schema for recording donor data and explicit transaction states

### Frontend & UI

- [x] Landing page (`index.html`) with hero section.
- [x] Responsive navigation bar linking to all modules
- [x] Multi-field Rescue Reporting form (`report.html`)
- [x] Dynamic Photo Upload status feedback
- [x] User Login and Signup forms with form validation
- [x] Integrated success modals for report confirmation
- [x] Unified JavaScript
- [x] Dynamic Donation interface (`donations/donation.html`) and callback processing redirects (`donations/success.html`, `donations/fail.html`, `donations/cancel.html`)

---

## 🚀 FUTURE TASKS (To Implement Later)

### Upcoming Features

- [ ] **NGO Management**: Implement NGO directory and profile registration.
- [ ] **Treatment Module**: Create a system for tracking animal medical history and vet appointments.
- [ ] **Adoption Portal**: Build a marketplace for pet adoption with status tracking.
- [ ] **Real-time Map**: Implement Google Maps / Leaflet for precise rescue location tracking.
- [ ] **Admin Dashboard**: Create a dashboard for NGOs and Admins to manage rescue requests.
- [ ] **User Profile**: Allow users to see their report history and update personal information.
- [ ] **Email Notifications**: Automated email alerts for successful reports and case updates.

### Infrastructure & Security

- [ ] **Protected Routes**: Implement frontend-level route protection based on JWT tokens.
- [ ] **Password Recovery**: Complete the "Forgot Password" logic with OTP/Email.
- [ ] **Image Optimization**: Implement backend resizing for uploaded photos to save storage.
- [ ] **Deployment**: Host the platform on a live server (Vercel/DigitalOcean).
